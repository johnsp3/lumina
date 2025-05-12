import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  listAll,
  deleteObject
} from 'firebase/storage';
import { storage } from './index';
import { getCurrentUser } from './auth';

// Configure larger uploads with custom settings
const createUploadTask = (storageRef, file) => {
  // Create metadata with content type
  const metadata = {
    contentType: file.type,
  };

  // For large files, create a resumable upload with metadata
  return uploadBytesResumable(storageRef, file, metadata);
};

// Upload a video file to the user's storage
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

// Upload a public video file (accessible by anyone)
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

// Get a list of all videos for current user
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
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          downloadURL
        };
      })
    );
    
    return videos;
  } catch (error) {
    console.error('Error getting user videos:', error);
    throw error;
  }
};

// Get a list of all public videos
export const getPublicVideos = async () => {
  const listRef = ref(storage, 'public/videos');
  
  try {
    const result = await listAll(listRef);
    
    // Get download URLs and metadata for each file
    const videos = await Promise.all(
      result.items.map(async (itemRef) => {
        const downloadURL = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          downloadURL
        };
      })
    );
    
    return videos;
  } catch (error) {
    console.error('Error getting public videos:', error);
    throw error;
  }
};

// Delete a video
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