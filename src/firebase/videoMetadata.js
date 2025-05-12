/**
 * videoMetadata.js - Firebase video metadata functionality
 * 
 * This module handles video metadata operations in Firebase Storage
 * including updating favorite status and categories.
 */

import { 
  ref, 
  updateMetadata,
  getMetadata
} from 'firebase/storage';
import { storage } from './index';
import { getCurrentUser } from './auth';

/**
 * Update the favorite status of a video
 * 
 * @param {string} filePath - The path to the video in Firebase Storage
 * @param {boolean} isFavorite - Whether the video should be marked as favorite
 * @returns {Promise<object>} - The success status
 */
export const updateVideoFavorite = async (filePath, isFavorite) => {
  const user = getCurrentUser();
  
  if (!user) {
    throw new Error('User must be logged in to update video favorites');
  }
  
  const fileRef = ref(storage, filePath);
  
  try {
    // Get existing metadata
    const currentMetadata = await getMetadata(fileRef);
    
    // Prepare updated custom metadata
    const customMetadata = {
      ...currentMetadata.customMetadata,
      isFavorite: String(isFavorite) // Store as string since metadata values must be strings
    };
    
    // Update the metadata
    await updateMetadata(fileRef, { customMetadata });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating video favorite status:', error);
    throw error;
  }
};

/**
 * Update the interesting category status of a video
 * 
 * @param {string} filePath - The path to the video in Firebase Storage
 * @param {boolean} isInteresting - Whether the video should be marked as interesting
 * @returns {Promise<object>} - The success status
 */
export const updateVideoInteresting = async (filePath, isInteresting) => {
  const user = getCurrentUser();
  
  if (!user) {
    throw new Error('User must be logged in to update video categories');
  }
  
  const fileRef = ref(storage, filePath);
  
  try {
    // Get existing metadata
    const currentMetadata = await getMetadata(fileRef);
    
    // Get current categories or initialize empty
    let categories = [];
    if (currentMetadata.customMetadata && currentMetadata.customMetadata.categories) {
      try {
        categories = JSON.parse(currentMetadata.customMetadata.categories);
      } catch {
        // If parsing fails, start with empty array
        categories = [];
      }
    }
    
    // Update categories
    if (isInteresting && !categories.includes('interesting')) {
      categories.push('interesting');
    } else if (!isInteresting) {
      categories = categories.filter(cat => cat !== 'interesting');
    }
    
    // Make sure 'all' category is always present
    if (!categories.includes('all')) {
      categories.push('all');
    }
    
    // Prepare updated custom metadata
    const customMetadata = {
      ...currentMetadata.customMetadata,
      categories: JSON.stringify(categories)
    };
    
    // Update the metadata
    await updateMetadata(fileRef, { customMetadata });
    
    return { success: true, categories };
  } catch (error) {
    console.error('Error updating video categories:', error);
    throw error;
  }
}; 