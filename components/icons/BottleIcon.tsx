
import React from 'react';

const BottleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M8 2h8v2H8z" />
    <path d="M9 4v16a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V4" />
    <path d="M8 4h8" />
  </svg>
);

export default BottleIcon;
