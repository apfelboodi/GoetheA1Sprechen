
import React from 'react';

const CutleryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 2v20" />
    <path d="M8 2v5a3 3 0 0 1-6 0V2h6Z" />
    <path d="M16 4h2a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-2" />
  </svg>
);

export default CutleryIcon;
