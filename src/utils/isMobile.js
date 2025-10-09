import { useMediaQuery } from '@mui/material';

// Mobile detection utility
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768; // md breakpoint
};

// Get screen size for conditional styling
export const getScreenSize = () => {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 640) return 'sm';
  if (width < 768) return 'md';
  if (width < 1024) return 'lg';
  if (width < 1280) return 'xl';
  return '2xl';
};

export const getTableWidth = () => {
  // Breakpoints aligned with common device sizes
  const isXs = useMediaQuery('(max-width:600px)'); // phones
  const isSmMd = useMediaQuery('(min-width:601px) and (max-width:1200px)'); // small tablets to small laptops
  const isLgUp = useMediaQuery('(min-width:1201px)'); // large laptops and desktops

  // On phones, use full viewport width
  if (isXs) return '100vw';

  // On tablets and small laptops, subtract sidebar width to avoid overflow
  if (isSmMd) return 'calc(100vw - 256px)';

  // On large screens, also subtract sidebar width for consistent layout
  if (isLgUp) return 'calc(100vw - 256px)';

  // Fallback
  return '100%';
};
