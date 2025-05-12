import React, { useState, useRef } from 'react';
import { uploadVideo, uploadPublicVideo } from '../../firebase/storage';
import { useAuth } from '../../context/AuthContext';

interface VideoUploadProps {
  isPublic?: boolean;
  onUploadComplete?: (videoData: any) => void;
  onUploadError?: (error: any) => void;
}

export default function VideoUpload({ 
  isPublic = false, 
  onUploadComplete, 
  onUploadError 
}: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }
      
      // Validate file size (limit to 2GB)
      if (selectedFile.size > 2 * 1024 * 1024 * 1024) {
        setError('File size exceeds 2GB limit');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    
    if (!currentUser) {
      setError('You must be logged in to upload videos');
      return;
    }
    
    setUploading(true);
    setProgress(0);
    
    try {
      // Upload to either public or user-specific storage
      const uploadFunction = isPublic ? uploadPublicVideo : uploadVideo;
      const videoData = await uploadFunction(file, (progressValue: number) => {
        setProgress(progressValue);
      });
      
      // Clear form and show success
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Call completion callback if provided
      if (onUploadComplete) {
        onUploadComplete(videoData);
      }
    } catch (error: any) {
      setError(error.message || 'Upload failed');
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Upload Video</h3>
      
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">
          Select video file
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 
                     file:rounded-full file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={uploading}
        />
        <p className="mt-1 text-xs text-gray-500">Supported formats: MP4, MOV, AVI, etc. Maximum size: 2GB</p>
      </div>
      
      {file && (
        <div className="mb-4">
          <p className="text-sm mb-1">Selected file: {file.name}</p>
          <p className="text-xs text-gray-500">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
            {file.size > 500 * 1024 * 1024 && (
              <span className="ml-2 text-amber-600">
                (Large file - upload may take several minutes)
              </span>
            )}
          </p>
        </div>
      )}
      
      {uploading && (
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full mb-1">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">{Math.round(progress)}%</p>
            {progress > 0 && progress < 100 && (
              <p className="text-xs text-gray-500">
                Please keep this window open until upload completes
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className="flex space-x-2">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`px-4 py-2 rounded-md text-white font-medium
                    ${!file || uploading 
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        
        {file && !uploading && (
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 font-medium
                       hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        {isPublic 
          ? 'This video will be publicly available to all users'
          : 'This video will only be accessible to you'}
      </div>
    </div>
  );
} 