import React from 'react';
import { useProducts } from '../../contexts/ProductContext';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import styles from './products.module.css';

const ProductFilters: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    searchTerm, 
    setSearchTerm,
    products
  } = useProducts();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterGroup}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filterGroup}>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className={styles.categorySelect}
        >
          <option value="">All Categories</option>
          {PRODUCT_CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {(selectedCategory || searchTerm) && (
        <button 
          onClick={clearFilters}
          className={styles.clearFiltersBtn}
        >
          Clear Filters
        </button>
      )}

      <div className={styles.resultsCount}>
        {products.length} {products.length === 1 ? 'product' : 'products'} found
      </div>
    </div>
  );
};

export default ProductFilters;
