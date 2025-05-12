/**
 * @file InterestingVideoButton.tsx
 * @description Interesting toggle button component for macOS 15.4 desktop application
 */

import React, { useState } from 'react';
import { VideoViewModel } from '../../viewmodels/VideoViewModel';

interface InterestingVideoButtonProps {
  videoId: string;
  isInteresting: boolean;
  filePath?: string;
  onToggle?: (isInteresting: boolean) => void;
  className?: string;
}

/**
 * InterestingVideoButton Component
 * 
 * Toggleable button for marking videos as interesting
 * following MVVM architecture for macOS desktop
 */
export default function InterestingVideoButton({
  videoId,
  isInteresting,
  filePath,
  onToggle,
  className = '',
}: InterestingVideoButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handles the interesting toggle action
   */
  const handleToggleInteresting = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const success = await VideoViewModel.toggleInteresting(videoId, !isInteresting, filePath);
      if (success && onToggle) {
        onToggle(!isInteresting);
      }
    } catch (error) {
      console.error('Error toggling interesting status:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button 
      className={`rounded-full p-1.5 bg-black/30 hover:bg-black/50 transition-colors ${isProcessing ? 'animate-pulse' : ''} ${className}`}
      onClick={handleToggleInteresting}
      disabled={isProcessing}
      aria-label={isInteresting ? "Remove from interesting" : "Mark as interesting"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill={isInteresting ? "#34C759" : "none"} 
        stroke={isInteresting ? "#34C759" : "white"} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  );
} 