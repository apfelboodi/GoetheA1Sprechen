
import React from 'react';

const NoSmokingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="4" y1="20" x2="4" y2="9" />
    <line x1="8" y1="20" x2="8" y2="13" />
    <path d="M4 16h4" />
    <path d="M18 16h4" />
    <path d="M22 12v4" />
    <path d="M18 12h-1.4a4 4 0 0 0-3.8 2.9" />
    <path d="M12 12H4.5A2.5 2.5 0 0 1 2 9.5v0A2.5 2.5 0 0 1 4.5 7H12" />
    <path d="M12 8V4a2 2 0 0 0-2-2H8" />
    <path d="M2 2l20 20" />
  </svg>
);

export default NoSmokingIcon;
