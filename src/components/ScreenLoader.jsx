import React from 'react';
import '../../src/App.css'; // Make sure your loader CSS is here

const ScreenLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <span className="loader"></span>
    </div>
  );
};

export default ScreenLoader;
