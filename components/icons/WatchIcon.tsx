
import React from 'react';

const WatchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="6" />
    <path d="M12 8v4l2 2" />
    <path d="M12 22a8 8 0 0 0 8-8" />
    <path d="M12 2a8 8 0 0 0-8 8" />
    <path d="m20 12-2-3" />
    <path d="m4 12 2-3" />
  </svg>
);

export default WatchIcon;
