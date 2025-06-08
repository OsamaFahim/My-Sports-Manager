import React, { useState } from 'react';
import { useProducts } from '../../contexts/ProductContext';
import CategoryGrid from './CategoryGrid.tsx';
import CategoryProducts from './CategoryProducts.tsx';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import styles from './shop.module.css';

const ShopPage: React.FC = () => {
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const getCategoryProductCount = (category: string) => {
    return products.filter(product => product.category === category).length;
  };
  if (loading) {
    return (
      <div className={styles.shopContainer}>
        <div className={styles.loading}>Loading shop...</div>
      </div>
    );
  }
  return (
    <div className={styles.shopContainer}>
      <div className={styles.wrapper}>
        {!selectedCategory && (
          <div className={styles.shopHeader}>
            <h1 className={styles.shopTitle}>Sports Shop</h1>
            <p className={styles.shopSubtitle}>
              Discover premium sports equipment and gear from our community of sports enthusiasts
            </p>
          </div>
        )}

        {selectedCategory ? (
          <CategoryProducts
            category={selectedCategory}
            products={products.filter(product => product.category === selectedCategory)}
            onBack={handleBackToCategories}
          />        ) : (
          <CategoryGrid
            categories={PRODUCT_CATEGORIES}
            onCategorySelect={handleCategorySelect}
            getCategoryProductCount={getCategoryProductCount}
          />
        )}
      </div>
    </div>
  );
};

export default ShopPage;
