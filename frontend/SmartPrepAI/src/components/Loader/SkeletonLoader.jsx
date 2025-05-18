import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-4 p-4">
      {/* Title placeholder */}
      <div className="h-6 bg-gray-300 rounded w-1/2" />

      {/* Text line placeholders */}
      <div className="h-4 bg-gray-300 rounded w-full" />
      <div className="h-4 bg-gray-300 rounded w-5/6" />
      <div className="h-4 bg-gray-300 rounded w-2/3" />

      {/* Button placeholder */}
      <div className="h-10 bg-gray-300 rounded w-24 mt-4" />
    </div>
  );
};

export default SkeletonLoader;
