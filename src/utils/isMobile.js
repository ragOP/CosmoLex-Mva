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
  if (typeof window === 'undefined') return '100%';
  const width = window.innerWidth;
  const isMobile = width <= 600;
  const isTablet = width <= 1024;
  return isMobile ? '100vw' : isTablet ? 'calc(100vw - 256px)' : '100%';
};
