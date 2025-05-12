/**
 * videoRetrieval.js - Firebase video retrieval functionality
 * 
 * This module handles retrieving videos from Firebase Storage
 * including getting user videos and public videos with metadata.
 */

import { 
  ref, 
  listAll,
  getDownloadURL,
  getMetadata
} from 'firebase/storage';
import { storage } from './index';
import { getCurrentUser } from './auth';

/**
 * Get a list of all videos for current user
 * 
 * @returns {Promise<Array>} - Array of video objects with metadata
 */
export const getUserVideos = async () => {
  const user = getCurrentUser();
  
  if (!user) {
    throw new Error('User must be logged in to get videos');
  }
  
  const listRef = ref(storage, `users/${user.uid}/videos`);
  
  try {
    const result = await listAll(listRef);
    
    // Get download URLs and metadata for each file
    const videos = await Promise.all(
      result.items.map(async (itemRef) => {
        const downloadURL = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        
        // Parse custom metadata
        let isFavorite = false;
        let categories = ['all'];
        
        if (metadata.customMetadata) {
          // Parse favorite status
          if (metadata.customMetadata.isFavorite === 'true') {
            isFavorite = true;
          }
          
          // Parse categories
          if (metadata.customMetadata.categories) {
            try {
              categories = JSON.parse(metadata.customMetadata.categories);
            } catch {
              // If parsing fails, keep default categories
            }
          }
        }
        
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          downloadURL,
          metadata: {
            isFavorite,
            categories
          }
        };
      })
    );
    
    return videos;
  } catch (error) {
    console.error('Error getting user videos:', error);
    throw error;
  }
};

/**
 * Get a list of all public videos
 * 
 * @returns {Promise<Array>} - Array of video objects with metadata
 */
export const getPublicVideos = async () => {
  const listRef = ref(storage, 'public/videos');
  
  try {
    const result = await listAll(listRef);
    
    // Get download URLs and metadata for each file
    const videos = await Promise.all(
      result.items.map(async (itemRef) => {
        const downloadURL = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        
        // Parse custom metadata
        let isFavorite = false;
        let categories = ['all', 'interesting']; // Public videos are interesting by default
        
        if (metadata.customMetadata) {
          // Parse favorite status
          if (metadata.customMetadata.isFavorite === 'true') {
            isFavorite = true;
          }
          
          // Parse categories
          if (metadata.customMetadata.categories) {
            try {
              categories = JSON.parse(metadata.customMetadata.categories);
              
              // Ensure 'interesting' is included for public videos
              if (!categories.includes('interesting')) {
                categories.push('interesting');
              }
            } catch {
              // If parsing fails, keep default categories
            }
          }
        }
        
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          downloadURL,
          metadata: {
            isFavorite,
            categories
          }
        };
      })
    );
    
    return videos;
  } catch (error) {
    console.error('Error getting public videos:', error);
    throw error;
  }
}; 