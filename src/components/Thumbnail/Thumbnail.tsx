'use client';

import React, { useState } from 'react';
import { Video } from '../../types';
import { useVideo } from '../../context/VideoContext';
import { DeleteVideoButton } from '../Button';

interface ThumbnailProps {
  video: Video;
  onClick: () => void;
}

export default function Thumbnail({ video, onClick }: ThumbnailProps) {
  const { addToFavorites, removeFromFavorites, updateVideoTitle, deleteVideoFromState } = useVideo();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(video.title);

  const formatDuration = (seconds: number | undefined) => {
    if (seconds === undefined) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTitleSubmit = () => {
    if (newTitle.trim() && newTitle !== video.title) {
      updateVideoTitle(video.id, newTitle);
    }
    setIsEditingTitle(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setNewTitle(video.title);
      setIsEditingTitle(false);
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.isFavorite) {
      removeFromFavorites(video.id);
    } else {
      addToFavorites(video.id);
    }
  };

  return (
    <div 
      className="video-thumbnail group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Thumbnail image */}
      <div className="aspect-video relative overflow-hidden">
        {/* Video preview image */}
        <div className="w-full h-full bg-zinc-200">
          {video.thumbnail ? (
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
          {formatDuration(video.duration)}
        </div>
        
        {/* Hover overlay */}
        <div 
          className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="bg-black/50 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
        
        {/* Favorite button */}
        <button 
          className={`absolute top-2 right-2 text-white transition-transform duration-300 ${isHovered ? 'scale-100' : 'scale-0'}`}
          onClick={toggleFavorite}
        >
          {video.isFavorite ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FF3B30" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          )}
        </button>

        {/* Delete button */}
        {video.filePath && (
          <DeleteVideoButton 
            videoId={video.id}
            videoPath={video.filePath}
            onDeleteSuccess={() => deleteVideoFromState(video.id)}
          />
        )}
      </div>
      
      {/* Video title */}
      <div className="p-3">
        {isEditingTitle ? (
          <input
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleSubmit}
            onKeyDown={handleTitleKeyDown}
            autoFocus
            className="w-full text-sm font-medium border-b border-accent focus:outline-none"
          />
        ) : (
          <h3 
            className="text-sm font-medium truncate cursor-text"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setIsEditingTitle(true);
            }}
          >
            {video.title}
          </h3>
        )}
        <p className="text-xs text-zinc-500 mt-1">
          {video.dateAdded ? 
            new Date(video.dateAdded).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : 
            video.date || "No date"
          }
        </p>
      </div>
    </div>
  );
} 