const formatCanadianPhone = (value) => {
  if (!value) return value;
  const digits = value.replace(/\D/g, '').slice(0, 10);
  const len = digits.length;

  if (len < 4) return `(${digits}`;
  if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export default formatCanadianPhone;
