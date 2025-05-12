'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-subtle">
        <div className="container-padding py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900">
            Lumina
          </Link>
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos..."
              className="pl-10 pr-4 py-2 w-64 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* Featured Video Section */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="aspect-video bg-gray-800 flex items-center justify-center">
            <p className="text-white">No video selected</p>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <main className="container-padding py-12">
        <div className="max-w-7xl mx-auto">
          {/* Category Navigation */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-6">
            <button 
              className={`category-button ${activeCategory === 'all' ? 'category-button-active' : 'category-button-inactive'}`}
              onClick={() => setActiveCategory('all')}
            >
              All Videos
            </button>
            <button 
              className={`category-button ${activeCategory === 'favorites' ? 'category-button-active' : 'category-button-inactive'}`}
              onClick={() => setActiveCategory('favorites')}
            >
              Favorites
            </button>
            <button 
              className={`category-button ${activeCategory === 'interesting' ? 'category-button-active' : 'category-button-inactive'}`}
              onClick={() => setActiveCategory('interesting')}
            >
              Interesting
            </button>
          </div>
          
          {/* Video Gallery (Placeholder grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="video-thumbnail">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium truncate">Video #{index + 1}</h3>
                  <p className="text-xs text-gray-500 mt-1">Added recently</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 