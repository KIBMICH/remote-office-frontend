"use client";

import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-20 w-20'
};

export default function Avatar({ src, alt = 'Avatar', fallback, size = 'md', className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset error state when src changes
  React.useEffect(() => {
    if (src) {
      setImageError(false);
      setIsLoading(true);
    }
  }, [src]);

  const handleImageError = () => {
    console.warn('Avatar image failed to load:', src);
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  // Add a safety timeout: if the image hasn't loaded after a while, stop spinning and show fallback
  React.useEffect(() => {
    if (!src) return;
    setIsLoading(true);
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Avatar image load timed out, showing fallback:', src);
        setImageError(true);
        setIsLoading(false);
      }
    }, 8000); // 8 seconds safety timeout
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Construct full URL if src is a relative path
  const getImageUrl = (imageSrc?: string) => {
    if (!imageSrc) return null;
    
    // Handle local previews (Data URLs or Object URLs) directly
    if (imageSrc.startsWith('data:') || imageSrc.startsWith('blob:')) {
      return imageSrc;
    }

    // If it's already a full URL (including Cloudinary URLs), return as is
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      return imageSrc;
    }
    
    // If it's a Cloudinary URL that might be missing protocol, add https
    if (imageSrc.startsWith('res.cloudinary.com')) {
      return `https://${imageSrc}`;
    }
    
    // If it's a relative path, construct full URL with backend base
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // Remove /api from base URL if present since avatar URLs typically don't include /api
    const cleanBaseUrl = baseUrl.replace('/api', '');
    
    // Handle different possible avatar URL formats
    if (imageSrc.startsWith('/')) {
      return `${cleanBaseUrl}${imageSrc}`;
    } else {
      return `${cleanBaseUrl}/${imageSrc}`;
    }
  };

  const imageUrl = getImageUrl(src);
  const shouldShowImage = imageUrl && !imageError;

  // Debug logging
  React.useEffect(() => {
    if (src) {
      console.log('Avatar component received src:', src);
      console.log('Avatar component constructed imageUrl:', imageUrl);
      console.log('Avatar isLoading:', isLoading, 'imageError:', imageError);
    }
  }, [src, imageUrl, isLoading, imageError]);

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-700 ring-1 ring-gray-600/60 flex items-center justify-center relative overflow-hidden ${className}`}>
      {shouldShowImage ? (
        <>
          <img 
            src={imageUrl} 
            alt={alt}
            className={`h-full w-full object-cover rounded-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          {fallback ? (
            <span className="text-gray-300 font-semibold text-sm">
              {fallback}
            </span>
          ) : (
            <svg className="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="8" r="3" />
              <path d="M4 20a8 8 0 0 1 16 0" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
}
