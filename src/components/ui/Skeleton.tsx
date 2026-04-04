import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, variant = 'rectangular' }) => {
  return (
    <div 
      className={`animate-pulse bg-surface-200 dark:bg-surface-800 ${
        variant === 'rectangular' ? 'rounded-none' : variant === 'circular' ? 'rounded-full' : 'rounded-2xl'
      } ${className}`}
    />
  );
};
