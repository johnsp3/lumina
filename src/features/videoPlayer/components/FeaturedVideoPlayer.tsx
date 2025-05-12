'use client';

import React from 'react';
import { useVideo } from '../../../context/VideoContext';
import VideoPlayer from '../../../components/VideoPlayer';
import Button from '../../../components/Button';
import { useState } from 'react';

export default function FeaturedVideoPlayer() {
  const { currentVideo, addToFavorites, removeFromFavorites } = useVideo();
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  
  if (!currentVideo) {
    return (
      <div className="w-full bg-zinc-100 aspect-video flex items-center justify-center">
        <p className="text-zinc-500">No video selected</p>
      </div>
    );
  }
  
  const toggleFavorite = () => {
    if (currentVideo.isFavorite) {
      removeFromFavorites(currentVideo.id);
    } else {
      addToFavorites(currentVideo.id);
    }
  };
  
  return (
    <div className="bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          {/* Video Player */}
          <div className="aspect-video">
            <VideoPlayer video={currentVideo} autoPlay />
          </div>
          
          {/* Video Info */}
          <div className="bg-white p-4 sm:p-6 border-b border-zinc-100">
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900">{currentVideo.title}</h1>
                <p className="text-zinc-500 mt-1">
                  Added on {currentVideo.dateAdded ? new Date(currentVideo.dateAdded).toLocaleDateString('en-US', {
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  }) : 'Unknown date'}
                </p>
              </div>
              
              <div className="flex space-x-3 mt-4 sm:mt-0">
                {/* Toggle Favorite Button */}
                <Button
                  variant={currentVideo.isFavorite ? 'primary' : 'outline'}
                  size="sm"
                  onClick={toggleFavorite}
                  className="flex items-center space-x-1"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill={currentVideo.isFavorite ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span>{currentVideo.isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
                </Button>
                
                {/* More Info Button */}
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                >
                  {isInfoExpanded ? 'Less Info' : 'More Info'}
                </Button>
              </div>
            </div>
            
            {/* Expanded Info */}
            {isInfoExpanded && (
              <div className="mt-4 bg-surface p-4 rounded-md">
                <h3 className="font-medium text-zinc-900 mb-2">Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500">Video ID</p>
                    <p className="font-mono">{currentVideo.id}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Duration</p>
                    <p>{currentVideo.duration ? `${Math.floor(currentVideo.duration / 60)}m ${currentVideo.duration % 60}s` : 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Categories</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentVideo.categories.map((category: string) => (
                        <span key={category} className="px-2 py-0.5 bg-zinc-200 text-zinc-700 rounded-full text-xs">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 