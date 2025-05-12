'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Video, VideoContextType } from '../types';
import { mockVideos } from '../utils/mockData';

// Create the context with a default empty value
const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  
  // Initialize with mock data
  useEffect(() => {
    // In a real app, this would fetch from an API
    setVideos(mockVideos);
    if (mockVideos.length > 0) {
      setCurrentVideo(mockVideos[0]);
    }
  }, []);

  // Handle favorites
  const addToFavorites = (videoId: string) => {
    setVideos((prev: Video[]) => 
      prev.map((video: Video) => 
        video.id === videoId ? { ...video, isFavorite: true } : video
      )
    );
  };

  const removeFromFavorites = (videoId: string) => {
    setVideos((prev: Video[]) => 
      prev.map((video: Video) => 
        video.id === videoId ? { ...video, isFavorite: false } : video
      )
    );
  };

  // Handle categories
  const addToCategory = (videoId: string, category: string) => {
    setVideos((prev: Video[]) => 
      prev.map((video: Video) => 
        video.id === videoId && !video.categories.includes(category) 
          ? { ...video, categories: [...video.categories, category] } 
          : video
      )
    );
  };

  const removeFromCategory = (videoId: string, category: string) => {
    setVideos((prev: Video[]) => 
      prev.map((video: Video) => 
        video.id === videoId 
          ? { ...video, categories: video.categories.filter((c: string) => c !== category) } 
          : video
      )
    );
  };

  // Update video title
  const updateVideoTitle = (videoId: string, title: string) => {
    setVideos((prev: Video[]) => 
      prev.map((video: Video) => 
        video.id === videoId ? { ...video, title } : video
      )
    );
    
    // Also update current video if it's the one being edited
    if (currentVideo?.id === videoId) {
      setCurrentVideo((prev: Video | null) => prev ? { ...prev, title } : null);
    }
  };

  // Context value object
  const value = {
    videos,
    currentVideo,
    setCurrentVideo,
    addToFavorites,
    removeFromFavorites,
    addToCategory,
    removeFromCategory,
    updateVideoTitle
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
}

// Custom hook to use the video context
export function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
} 