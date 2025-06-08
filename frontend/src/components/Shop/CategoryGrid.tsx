import React from 'react';
import styles from './shop.module.css';

interface CategoryGridProps {
  categories: readonly string[];
  onCategorySelect: (category: string) => void;
  getCategoryProductCount: (category: string) => number;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onCategorySelect,
  getCategoryProductCount,
}) => {
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

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'Jerseys':
        return 'Team jerseys and sports uniforms';
      case 'Sports Shoes':
        return 'Athletic footwear for all sports';
      case 'Footballs':
        return 'Footballs and sports balls';
      case 'Bats':
        return 'Cricket bats, baseball bats and more';
      default:
        return 'Sports equipment and accessories';
    }
  };

  return (
    <div className={styles.categoryGrid}>
      {categories.map((category) => {
        const productCount = getCategoryProductCount(category);
        return (          <div
            key={category}
            className={styles.categoryCard}
            onClick={() => onCategorySelect(category)}
          >
            <div className={styles.categoryIcon}>
              {getCategoryIcon(category)}
            </div>
            <h3 className={styles.categoryName}>{category}</h3>
            <p className={styles.categoryDescription}>
              {getCategoryDescription(category)}
            </p>
            <div className={styles.categoryProductCount}>
              {productCount} {productCount === 1 ? 'item' : 'items'}
            </div>
          </div>
        );
      })}
    </div>  );
};

export default CategoryGrid;
