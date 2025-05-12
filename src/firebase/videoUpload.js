/**
 * videoUpload.js - Firebase video upload functionality
 * 
 * This module handles video file uploads to Firebase Storage
 * for both private user videos and public videos.
 */

import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL
} from 'firebase/storage';
import { storage } from './index';
import { getCurrentUser } from './auth';

/**
 * Configure larger uploads with custom settings
 * 
 * @param {object} storageRef - Firebase storage reference
 * @param {File} file - The file to upload
 * @returns {object} - The upload task
 */
export const createUploadTask = (storageRef, file) => {
  // Create metadata with content type
  const metadata = {
    contentType: file.type,
  };

  // For large files, create a resumable upload with metadata
  return uploadBytesResumable(storageRef, file, metadata);
};

/**
 * Upload a video file to the user's private storage
 * 
 * @param {File} file - The video file to upload
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<object>} - Upload result with file info and URL
 */
export const uploadVideo = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const user = getCurrentUser();
    
    if (!user) {
      reject(new Error('User must be logged in to upload videos'));
      return;
    }

    // Create a unique filename
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name}`;
    
    // Create storage reference
    const videoRef = ref(storage, `users/${user.uid}/videos/${fileName}`);
    
    // Start upload with optimized settings for large files
    const uploadTask = createUploadTask(videoRef, file);
    
    // Listen for state changes
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progress updates
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
        
        // Log detailed progress for large uploads
        console.log(`Upload progress: ${Math.round(progress)}% (${snapshot.bytesTransferred} / ${snapshot.totalBytes} bytes)`);
      },
      (error) => {
        // Error handling
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        // Upload completed successfully
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            fileName,
            fileSize: uploadTask.snapshot.totalBytes,
            contentType: file.type,
            downloadURL,
            path: `users/${user.uid}/videos/${fileName}`,
            createdAt: timestamp,
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

/**
 * Upload a public video file (accessible by anyone)
 * 
 * @param {File} file - The video file to upload
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<object>} - Upload result with file info and URL
 */
export const uploadPublicVideo = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const user = getCurrentUser();
    
    if (!user) {
      reject(new Error('User must be logged in to upload videos'));
      return;
    }

    // Create a unique filename
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name}`;
    
    // Create storage reference for public folder
    const videoRef = ref(storage, `public/videos/${fileName}`);
    
    // Start upload with optimized settings for large files
    const uploadTask = createUploadTask(videoRef, file);
    
    // Listen for state changes
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progress updates
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
        
        // Log detailed progress for large uploads
        console.log(`Upload progress: ${Math.round(progress)}% (${snapshot.bytesTransferred} / ${snapshot.totalBytes} bytes)`);
      },
      (error) => {
        // Error handling
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        // Upload completed successfully
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            fileName,
            fileSize: uploadTask.snapshot.totalBytes,
            contentType: file.type,
            downloadURL,
            path: `public/videos/${fileName}`,
            createdAt: timestamp,
            uploadedBy: user.uid
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}; 