'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Video, VideoContextType } from '../types';
import { getUserVideos, getPublicVideos } from '../firebase/videoRetrieval';
import { updateVideoFavorite } from '../firebase/videoMetadata';
import { updateVideoInteresting } from '../firebase/videoMetadata';
import { deleteVideo } from '../firebase/videoDeletion';

// Create the context with a default empty value
const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Initialize with real Firebase data instead of mock data
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        // Get both user's videos and public videos
        const [userVideos, publicVideos] = await Promise.all([
          getUserVideos(),
          getPublicVideos()
        ]);
        
        // Format videos for display
        const formattedVideos = [
          ...userVideos.map(video => ({
            id: video.name,
            title: video.name.split('_').slice(1).join('_'), // Remove timestamp prefix
            src: video.downloadURL,
            date: new Date(parseInt(video.name.split('_')[0])).toLocaleDateString(),
            isPublic: false,
            isFavorite: video.metadata?.isFavorite || false, // Use metadata from Firebase
            categories: video.metadata?.categories || ['all'], // Use categories from Firebase
            filePath: video.fullPath // Add the full path for deletion
          })),
          ...publicVideos.map(video => ({
            id: video.name,
            title: video.name.split('_').slice(1).join('_'), // Remove timestamp prefix
            src: video.downloadURL,
            date: new Date(parseInt(video.name.split('_')[0])).toLocaleDateString(),
            isPublic: true,
            isFavorite: video.metadata?.isFavorite || false, // Use metadata from Firebase
            categories: video.metadata?.categories || ['all', 'interesting'], // Use categories from Firebase
            filePath: video.fullPath // Add the full path for deletion
          }))
        ];
        
        setVideos(formattedVideos);
        if (formattedVideos.length > 0) {
          setCurrentVideo(formattedVideos[0]);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, []);

  // Handle favorites
  const addToFavorites = async (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video || !video.filePath) return;
    
    try {
      await updateVideoFavorite(video.filePath, true);
      setVideos((prev: Video[]) => 
        prev.map((video: Video) => 
          video.id === videoId ? { ...video, isFavorite: true } : video
        )
      );
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFromFavorites = async (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video || !video.filePath) return;
    
    try {
      await updateVideoFavorite(video.filePath, false);
      setVideos((prev: Video[]) => 
        prev.map((video: Video) => 
          video.id === videoId ? { ...video, isFavorite: false } : video
        )
      );
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  // Handle categories
  const addToCategory = async (videoId: string, category: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video || !video.filePath) return;
    
    try {
      await updateVideoInteresting(video.filePath, true);
      setVideos((prev: Video[]) => 
        prev.map((video: Video) => 
          video.id === videoId && !video.categories.includes(category) 
            ? { ...video, categories: [...video.categories, category] } 
            : video
        )
      );
    } catch (error) {
      console.error('Error adding to category:', error);
    }
  };

  const removeFromCategory = async (videoId: string, category: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video || !video.filePath) return;
    
    try {
      await updateVideoInteresting(video.filePath, false);
      setVideos((prev: Video[]) => 
        prev.map((video: Video) => 
          video.id === videoId 
            ? { ...video, categories: video.categories.filter((c: string) => c !== category) } 
            : video
        )
      );
    } catch (error) {
      console.error('Error removing from category:', error);
    }
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

  // Delete video from the local state and Firebase
  const deleteVideoFromState = async (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video || !video.filePath) return;
    
    try {
      await deleteVideo(video.filePath);
      setVideos((prev: Video[]) => prev.filter((video: Video) => video.id !== videoId));
      
      // If the current video is being deleted, clear it
      if (currentVideo?.id === videoId) {
        setCurrentVideo(null);
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  // Context value object
  const value = {
    videos,
    currentVideo,
    setCurrentVideo,
    loading,
    addToFavorites,
    removeFromFavorites,
    addToCategory,
    removeFromCategory,
    updateVideoTitle,
    deleteVideoFromState
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