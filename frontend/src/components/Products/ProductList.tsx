import React from 'react';
import { useProducts } from '../../contexts/ProductContext';
import styles from './products.module.css';

interface ProductListProps {
  setEditingProductId: (id: string | null) => void;
}

const ProductList: React.FC<ProductListProps> = ({ setEditingProductId }) => {
  const { products, deleteProduct, isAuthenticated, username, loading } = useProducts();

  if (loading) return <p className={styles.loadingText}>Loading products...</p>;
  if (products.length === 0) return <p className={styles.emptyText}>No products found. Be the first to add one!</p>;

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  return (
    <div className={styles.productGrid}>
      {products.map(product => {
        const canEdit = isAuthenticated && username === product.username;
        
        return (
          <div key={product._id} className={styles.productCard}>
            <div className={styles.productImageContainer}>
              <img 
                src={product.productImage} 
                alt={product.name}
                className={styles.productImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                }}
              />
              <div className={styles.categoryBadge}>
                {product.category}
              </div>
            </div>
            
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productDescription}>{product.description}</p>
              
              <div className={styles.productDetails}>
                <div className={styles.priceQuantity}>
                  <span className={styles.price}>${product.price.toFixed(2)}</span>
                  <span className={styles.quantity}>
                    Stock: {product.quantity} {product.quantity === 1 ? 'unit' : 'units'}
                  </span>
                </div>
                
                <div className={styles.productMeta}>
                  <span className={styles.seller}>By: {product.username}</span>
                  <span className={styles.date}>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {canEdit && (
                <div className={styles.productActions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => setEditingProductId(product._id)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
