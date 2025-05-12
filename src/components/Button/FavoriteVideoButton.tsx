/**
 * @file FavoriteVideoButton.tsx
 * @description Favorite toggle button component for macOS 15.4 desktop application
 */

import React, { useState } from 'react';
import { VideoViewModel } from '../../viewmodels/VideoViewModel';

interface FavoriteVideoButtonProps {
  videoId: string;
  isFavorite: boolean;
  filePath?: string;
  onToggle?: (isFavorite: boolean) => void;
  className?: string;
}

/**
 * FavoriteVideoButton Component
 * 
 * Toggleable button for marking videos as favorites
 * following MVVM architecture for macOS desktop
 */
export default function FavoriteVideoButton({
  videoId,
  isFavorite,
  filePath,
  onToggle,
  className = '',
}: FavoriteVideoButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handles the favorite toggle action
   */
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const success = await VideoViewModel.toggleFavorite(videoId, !isFavorite, filePath);
      if (success && onToggle) {
        onToggle(!isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button 
      className={`rounded-full p-1.5 bg-black/30 hover:bg-black/50 transition-colors ${isProcessing ? 'animate-pulse' : ''} ${className}`}
      onClick={handleToggleFavorite}
      disabled={isProcessing}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill={isFavorite ? "#FF3B30" : "none"} 
        stroke={isFavorite ? "#FF3B30" : "white"} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
} 