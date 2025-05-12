/**
 * videoDeletion.js - Firebase video deletion functionality
 * 
 * This module handles deleting videos from Firebase Storage
 */

import { 
  ref, 
  deleteObject
} from 'firebase/storage';
import { storage } from './index';
import { getCurrentUser } from './auth';

/**
 * Delete a video from Firebase Storage
 * 
 * @param {string} filePath - The path to the video in Firebase Storage
 * @returns {Promise<object>} - The success status
 */
export const deleteVideo = async (filePath) => {
  const user = getCurrentUser();
  
  if (!user) {
    throw new Error('User must be logged in to delete videos');
  }
  
  // Check if user owns this video (if it's in their user folder)
  if (filePath.startsWith(`users/${user.uid}`)) {
    const fileRef = ref(storage, filePath);
    
    try {
      await deleteObject(fileRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  } else {
    throw new Error('User does not have permission to delete this video');
  }
}; 