import { ReactNode } from 'react';

export interface Video {
  id: string;
  title: string;
  src: string;
  thumbnail: string;
  duration: number; // in seconds
  dateAdded: string; // ISO string
  categories: string[];
  isFavorite: boolean;
}

export type Category = 'all' | 'favorites' | 'interesting';

export interface VideoContextType {
  videos: Video[];
  currentVideo: Video | null;
  setCurrentVideo: (video: Video | null) => void;
  addToFavorites: (videoId: string) => void;
  removeFromFavorites: (videoId: string) => void;
  addToCategory: (videoId: string, category: string) => void;
  removeFromCategory: (videoId: string, category: string) => void;
  updateVideoTitle: (videoId: string, title: string) => void;
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