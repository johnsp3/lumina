'use client';

import React, { useState } from 'react';
import Button from '@/components/Button';

const CATEGORIES = [
  { id: 'all', name: 'All Videos' },
  { id: 'favorites', name: 'Favorites' },
  { id: 'travel', name: 'Travel' },
  { id: 'family', name: 'Family' },
  { id: 'holidays', name: 'Holidays' },
  { id: 'pets', name: 'Pets' },
  { id: 'music', name: 'Music' },
  { id: 'sports', name: 'Sports' }
];

interface CategoryNavigationProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function CategoryNavigation({
  activeCategory,
  setActiveCategory
}: CategoryNavigationProps) {
  return (
    <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`category-button ${
            activeCategory === category.id
              ? 'category-button-active'
              : 'category-button-inactive'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
} 