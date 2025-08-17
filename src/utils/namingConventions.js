// Snake Case
// camelCase
// PascalCase

// Example
// snake_case
// camelCase
// PascalCase

const toSnakeCase = (str) => str.replace(/([A-Z])/g, '_$1').toLowerCase();
const toCamelCase = (str) =>
  str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
const toPascalCase = (str) =>
  str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

const toTitleCase = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export { toSnakeCase, toCamelCase, toPascalCase, toTitleCase };
