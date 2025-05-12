import React, { useState } from 'react';
import Button from './Button';
import { VideoViewModel } from '../../viewmodels/VideoViewModel';

interface DeleteVideoButtonProps {
  videoId: string;
  videoPath: string;
  onDeleteSuccess?: () => void;
  onDeleteError?: (error: any) => void;
  className?: string;
}

/**
 * DeleteVideoButton component for removing videos from storage
 * 
 * This component handles the UI and logic for deleting videos
 * with a confirmation dialog to prevent accidental deletions
 */
export default function DeleteVideoButton({
  videoId,
  videoPath,
  onDeleteSuccess,
  onDeleteError,
  className = '',
}: DeleteVideoButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the initial delete button click to show confirmation
   */
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmation(true);
  };

  /**
   * Handles cancellation of delete operation
   */
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmation(false);
  };

  /**
   * Handles the confirmed deletion of a video
   */
  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    setError(null);
    
    try {
      // Use the VideoViewModel to delete the video
      await VideoViewModel.deleteVideo(videoPath);
      
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      
      setShowConfirmation(false);
    } catch (error: any) {
      setError(error.message || 'Failed to delete video');
      
      if (onDeleteError) {
        onDeleteError(error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (showConfirmation) {
    return (
      <div 
        className={`delete-video-confirmation p-3 absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col items-center justify-center gap-3 z-10 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-white text-sm font-medium text-center">
          Are you sure you want to delete this video?
        </p>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCancelDelete}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
        {error && (
          <p className="text-red-400 text-xs mt-1">{error}</p>
        )}
      </div>
    );
  }
  
  return (
    <button 
      className={`delete-video-button absolute top-2 left-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${className}`}
      onClick={handleDeleteClick}
      aria-label="Delete video"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"></path>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
      </svg>
    </button>
  );
} 