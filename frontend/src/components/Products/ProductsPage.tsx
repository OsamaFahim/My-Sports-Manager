import React, { useState } from 'react';
import { useProducts } from '../../contexts/ProductContext';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import ProductFilters from './ProductFilters';
import styles from './products.module.css';

const ProductsPage: React.FC = () => {
  const { isAuthenticated, products } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const handleEditProduct = (id: string | null) => {
    setEditingProductId(id);
    setShowForm(true);
  };

  const handleFormDone = () => {
    setShowForm(false);
    setEditingProductId(null);
  };

  const editingProduct = editingProductId ? products.find(p => p._id === editingProductId) : null;
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.pageHeader}>
          <h2 className={styles.title}>Sports Products</h2>
          <p className={styles.subtitle}>
            Discover and buy the best sports equipment and accessories!
          </p>
          
          {isAuthenticated && (
            <button 
              className={styles.addButton} 
              onClick={() => setShowForm(v => !v)}
            >
              {showForm ? 'Cancel' : 'Add Product'}
            </button>
          )}
        </div>

        {showForm && (
          <ProductForm 
            onDone={handleFormDone}
            initial={editingProduct || undefined}
            editingId={editingProductId}
          />
        )}

        <ProductFilters />
        
        <ProductList setEditingProductId={handleEditProduct} />
      </div>
    </div>
  );
};

export default ProductsPage;
