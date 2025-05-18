import React from 'react';

const SpinnerLoader = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default SpinnerLoader;
