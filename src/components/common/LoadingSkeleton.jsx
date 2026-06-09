import React from "react";

const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm animate-pulse"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/3"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-xl w-full mt-auto"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
