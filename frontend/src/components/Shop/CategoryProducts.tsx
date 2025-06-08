import React from 'react';
import { Product } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';
import styles from './shop.module.css';

interface CategoryProductsProps {
  category: string;
  products: Product[];
  onBack: () => void;
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({
  category,
  products,
  onBack,
}) => {
  const { addToCart } = useCart();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Jerseys':
        return '👕';
      case 'Sports Shoes':
        return '👟';
      case 'Footballs':
        return '⚽';
      case 'Bats':
        return '🏏';
      default:
        return '🏃‍♂️';
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <div>
      <div className={styles.categoryHeader}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back to Categories
        </button>
        <div className={styles.categoryTitle}>
          <h2 className={styles.categoryTitleMain}>
            {getCategoryIcon(category)} {category}
          </h2>
          <p className={styles.categoryTitleSub}>
            {products.length} {products.length === 1 ? 'item' : 'items'} available
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className={styles.noProducts}>
          <div className={styles.noProductsIcon}>📦</div>
          <h3 className={styles.noProductsTitle}>No products in this category yet</h3>
          <p className={styles.noProductsText}>
            Be the first to add a {category.toLowerCase()} product!
          </p>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <img
                src={product.productImage}
                alt={product.name}
                className={styles.productImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                }}
              />

              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDescription}>{product.description}</p>

                <div className={styles.productDetails}>
                  <span className={styles.productPrice}>${product.price.toFixed(2)}</span>
                  <span className={styles.productQuantity}>
                    Stock: {product.quantity}
                  </span>
                </div>                <div className={styles.productActions}>
                  <button 
                    className={`${styles.actionButton} ${styles.addToCartButton}`}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.quantity === 0}
                  >
                    {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>  );
};

export default CategoryProducts;
