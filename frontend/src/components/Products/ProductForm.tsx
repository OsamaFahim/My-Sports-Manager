import React, { useState } from 'react';
import { useProducts, Product } from '../../contexts/ProductContext';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import styles from './products.module.css';

interface Props {
  onDone: () => void;
  initial?: Product;
  editingId?: string | null;
}

const ProductForm: React.FC<Props> = ({ onDone, initial, editingId }) => {
  const { addProduct, updateProduct, products } = useProducts();
  
  // Get the product being edited
  const productToEdit = editingId ? products.find(p => p._id === editingId) : null;
  const [form, setForm] = useState({
    name: productToEdit?.name || initial?.name || '',
    description: productToEdit?.description || initial?.description || '',
    quantity: productToEdit?.quantity || initial?.quantity || 0,
    price: productToEdit?.price || initial?.price || 0,
    productImage: productToEdit?.productImage || initial?.productImage || '',
    category: productToEdit?.category || initial?.category || PRODUCT_CATEGORIES[0],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value 
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (form.quantity < 0) newErrors.quantity = 'Quantity must be non-negative';
    if (form.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!form.productImage.trim()) newErrors.productImage = 'Product image URL is required';
    if (!form.category) newErrors.category = 'Category is required';

    // Basic URL validation for product image
    try {
      new URL(form.productImage);
    } catch {
      if (form.productImage.trim()) {
        newErrors.productImage = 'Please enter a valid image URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await addProduct(form);
      }
      setForm({ 
        name: '', 
        description: '', 
        quantity: 0, 
        price: 0, 
        productImage: '', 
        category: PRODUCT_CATEGORIES[0] 
      });
      onDone();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>
        {editingId ? 'Edit Product' : 'Add New Product'}
      </h3>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            maxLength={100}
          />
          {errors.name && <span className={styles.errorText}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Product Description"
            required
            className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
            maxLength={500}
            rows={4}
          />          {errors.description && <span className={styles.errorText}>{errors.description}</span>}
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Quantity</label>
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              required
              min="0"
              className={`${styles.input} ${errors.quantity ? styles.inputError : ''}`}
            />
            {errors.quantity && <span className={styles.errorText}>{errors.quantity}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Price ($)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
              required
              min="0.01"
              className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
            />
            {errors.price && <span className={styles.errorText}>{errors.price}</span>}
          </div>
        </div>

        <div className={styles.formGroup}>
          <input
            name="productImage"
            value={form.productImage}
            onChange={handleChange}
            placeholder="Product Image URL"
            required
            className={`${styles.input} ${errors.productImage ? styles.inputError : ''}`}
          />
          {errors.productImage && <span className={styles.errorText}>{errors.productImage}</span>}
        </div>

        <div className={styles.formGroup}>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
          >
            {PRODUCT_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <span className={styles.errorText}>{errors.category}</span>}
        </div>

        <div className={styles.formActions}>
          <button className={styles.submitBtn} type="submit">
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
          <button type="button" className={styles.cancelBtn} onClick={onDone}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
