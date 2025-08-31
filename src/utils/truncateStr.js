export const truncateStr = (str = '', len = 20, end = '...') => {
  if (!str) return '';

  if (str.length > len) {
    return str.substring(0, len) + end;
  }
  return str;
};
