import { ReactNode } from 'react';

export interface Video {
  id: string;
  title: string;
  src: string;
  thumbnail?: string;
  duration?: number; // in seconds
  dateAdded?: string; // ISO string
  date?: string; // Formatted date string
  categories: string[];
  isFavorite: boolean;
  filePath?: string; // Storage path for deletion operations
  isPublic?: boolean; // Whether the video is public or private
}

export type Category = 'all' | 'favorites' | 'interesting';

export interface VideoContextType {
  videos: Video[];
  currentVideo: Video | null;
  loading: boolean;
  setCurrentVideo: (video: Video | null) => void;
  addToFavorites: (videoId: string) => Promise<void>;
  removeFromFavorites: (videoId: string) => Promise<void>;
  addToCategory: (videoId: string, category: string) => Promise<void>;
  removeFromCategory: (videoId: string, category: string) => Promise<void>;
  updateVideoTitle: (videoId: string, title: string) => void;
  deleteVideoFromState: (videoId: string) => Promise<void>;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

export interface ThumbnailProps {
  video: Video;
  onClick: () => void;
}

export interface VideoPlayerProps {
  video: Video;
  className?: string;
  autoPlay?: boolean;
} 