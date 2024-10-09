import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryFilter = ({ onCategoryChange }: { onCategoryChange: (category: string) => void }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('https://fe-tech-test-api-dev-416879028044.asia-southeast2.run.app/api/v1/categories')
      .then(response => {
        setCategories(response.data.data);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  return (
    <select onChange={(e) => onCategoryChange(e.target.value)}>
      <option value="">All Categories</option>
      {categories.map((category: any) => (
        <option key={category.id} value={category.id}>{category.name}</option>
      ))}
    </select>
  );
};

export default CategoryFilter;
