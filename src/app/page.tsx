'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="w-full h-[70vh] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center space-y-6 container-padding">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Lumina
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            A premium experience for your precious video memories
          </p>
          <div className="pt-6">
            <Link 
              href="/gallery" 
              className="px-8 py-3 bg-blue-500 text-white rounded-full text-lg font-medium shadow-sm hover:shadow-md transition-standard"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-20 container-padding">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Premium Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-gray-50">
              <h3 className="text-xl font-semibold mb-3">4K Video Playback</h3>
              <p className="text-gray-600">
                Optimized performance for the highest resolution videos in your collection.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-gray-50">
              <h3 className="text-xl font-semibold mb-3">Intuitive Organization</h3>
              <p className="text-gray-600">
                Smart categorization with favorites and custom collections.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-gray-50">
              <h3 className="text-xl font-semibold mb-3">Elegant Design</h3>
              <p className="text-gray-600">
                Apple-inspired minimal interface that puts your content first.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 