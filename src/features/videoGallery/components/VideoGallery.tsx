'use client';

import React, { useMemo } from 'react';
import Thumbnail from '@/components/Thumbnail';
import { useVideo } from '@/context/VideoContext';
import { Video } from '@/types';

interface VideoGalleryProps {
  category: string;
  searchQuery: string;
}

export default function VideoGallery({ category, searchQuery }: VideoGalleryProps) {
  const { videos, setCurrentVideo } = useVideo();
  
  const filteredVideos = useMemo(() => {
    return videos.filter((video: Video) => {
      // Filter by category
      if (category !== 'all') {
        if (category === 'favorites' && !video.isFavorite) return false;
        else if (category !== 'favorites' && !video.categories.includes(category)) return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return video.title.toLowerCase().includes(query);
      }
      
      return true;
    });
  }, [videos, category, searchQuery]);
  
  // Display empty state if no videos match the filters
  if (filteredVideos.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-xl font-medium text-zinc-700">No videos found</h3>
        <p className="mt-2 text-zinc-500">
          {searchQuery 
            ? `No results for "${searchQuery}"`
            : `No videos in the ${category} category`
          }
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {filteredVideos.map((video: Video) => (
        <Thumbnail
          key={video.id}
          video={video}
          onClick={() => setCurrentVideo(video)}
        />
      ))}
    </div>
  );
} 