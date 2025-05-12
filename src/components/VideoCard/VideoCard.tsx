/**
 * @file VideoCard.tsx
 * @description Video card component for macOS 15.4 desktop application
 */

import React, { useState, useEffect } from 'react';
import { useVideo } from '../../context/VideoContext';
import { DeleteVideoButton, FavoriteVideoButton, InterestingVideoButton } from '../Button';
import { Video } from '../../types';

/**
 * VideoCard props interface
 */
interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

/**
 * VideoCard Component
 * 
 * Displays a video thumbnail with interactive buttons and metadata
 * following MVVM architecture for macOS desktop
 */
export default function VideoCard({ video, onClick }: VideoCardProps) {
  // Local state for button and tag visibility
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isInteresting, setIsInteresting] = useState<boolean>(false);
  
  const { 
    deleteVideoFromState, 
    addToFavorites,
    removeFromFavorites,
    addToCategory,
    removeFromCategory
  } = useVideo();

  // Initialize states from video props
  useEffect(() => {
    setIsFavorite(video.isFavorite || false);
    setIsInteresting(video.categories?.includes('interesting') || false);
  }, [video]);

  /**
   * Handles favorite toggle state
   */
  const handleFavoriteToggle = async (newState: boolean) => {
    try {
      if (newState) {
        await addToFavorites(video.id);
      } else {
        await removeFromFavorites(video.id);
      }
      setIsFavorite(newState);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  /**
   * Handles interesting toggle state
   */
  const handleInterestingToggle = async (newState: boolean) => {
    try {
      if (newState) {
        await addToCategory(video.id, 'interesting');
      } else {
        await removeFromCategory(video.id, 'interesting');
      }
      setIsInteresting(newState);
    } catch (error) {
      console.error('Error toggling interesting:', error);
    }
  };

  /**
   * Handles video deletion
   */
  const handleDeleteSuccess = () => {
    deleteVideoFromState(video.id);
  };

  return (
    <div className="video-card group cursor-pointer hover:shadow-md transition-shadow duration-300 rounded-lg overflow-hidden bg-white">
      {/* Video Thumbnail */}
      <div className="aspect-video relative overflow-hidden">
        <video
          src={video.src}
          className="w-full h-full object-cover"
          preload="metadata"
          muted
        />
        
        {/* Play button overlay */}
        <div 
          className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={onClick}
        >
          <div className="bg-black/50 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
        
        {/* Delete Button - Left Side */}
        {video.filePath && (
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <DeleteVideoButton 
              videoId={video.id}
              videoPath={video.filePath}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </div>
        )}
        
        {/* Action Buttons - Right Side */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <FavoriteVideoButton 
            videoId={video.id}
            isFavorite={isFavorite}
            filePath={video.filePath}
            onToggle={handleFavoriteToggle}
          />

          <InterestingVideoButton 
            videoId={video.id}
            isInteresting={isInteresting}
            filePath={video.filePath}
            onToggle={handleInterestingToggle}
          />
        </div>
      </div>
      
      {/* Video Details */}
      <div className="p-3">
        <h3 className="text-sm font-medium truncate">{video.title}</h3>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">{video.date || ''}</p>
          <div className="flex space-x-1">
            {isFavorite && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                Favorite
              </span>
            )}
            {isInteresting && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Interesting
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 