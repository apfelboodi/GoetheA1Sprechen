
import React from 'react';

const MusicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="2" />
    <path d="m15 12-5-2" />
    <path d="M17 12a5 5 0 0 0-5-5" />
    <path d="M19 12a7 7 0 0 0-7-7" />
  </svg>
);

export default MusicIcon;
