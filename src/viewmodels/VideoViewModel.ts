/**
 * @file VideoViewModel.ts
 * @description ViewModel for video-related operations in the macOS 15.4 desktop application
 */

import { deleteVideo } from '../firebase/videoDeletion';
import { updateVideoFavorite, updateVideoInteresting } from '../firebase/videoMetadata';

/**
 * VideoViewModel
 * 
 * Handles all video-related business logic and state management
 * following MVVM architecture for macOS desktop application
 */
export class VideoViewModel {
  /**
   * Delete a video from storage
   * 
   * @param filePath - The storage path of the video to delete
   * @returns Promise<boolean> - The success status of the operation
   */
  static async deleteVideo(filePath: string): Promise<boolean> {
    try {
      await deleteVideo(filePath);
      return true;
    } catch (error) {
      console.error('Error in VideoViewModel.deleteVideo:', error);
      throw error;
    }
  }

  /**
   * Toggle favorite status of a video
   * 
   * @param videoId - The ID of the video
   * @param isFavorite - The new favorite status
   * @param filePath - The storage path of the video
   * @returns Promise<boolean> - The success status of the operation
   */
  static async toggleFavorite(videoId: string, isFavorite: boolean, filePath?: string): Promise<boolean> {
    try {
      if (filePath) {
        await updateVideoFavorite(filePath, isFavorite);
      }
      return true; // Return success status instead of state
    } catch (error) {
      console.error('Error in VideoViewModel.toggleFavorite:', error);
      throw error; // Throw error to be handled by UI layer
    }
  }

  /**
   * Toggle interesting status of a video
   * 
   * @param videoId - The ID of the video
   * @param isInteresting - The new interesting status
   * @param filePath - The storage path of the video
   * @returns Promise<boolean> - The success status of the operation
   */
  static async toggleInteresting(videoId: string, isInteresting: boolean, filePath?: string): Promise<boolean> {
    try {
      if (filePath) {
        await updateVideoInteresting(filePath, isInteresting);
      }
      return true; // Return success status instead of state
    } catch (error) {
      console.error('Error in VideoViewModel.toggleInteresting:', error);
      throw error; // Throw error to be handled by UI layer
    }
  }

  /**
   * Format video duration in minutes:seconds
   * 
   * @param seconds - Duration in seconds
   * @returns Formatted duration string (MM:SS)
   */
  static formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  /**
   * Format date to user-friendly string
   * 
   * @param dateString - ISO date string
   * @returns Formatted date string
   */
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
} 