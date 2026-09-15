import React from "react";

const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-slate-100" />
            <div className="h-4 w-3/4 rounded-md bg-slate-100" />
          </div>
          <div className="mb-6 space-y-3">
            <div className="h-3 w-1/2 rounded bg-slate-100" />
            <div className="h-3 w-1/3 rounded bg-slate-100" />
          </div>
          <div className="h-9 w-full rounded-lg bg-slate-100" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
