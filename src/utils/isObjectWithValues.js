export const isObjectWithValues = (obj) => {
  return Object.values(obj).some((value) => value !== '');
};
