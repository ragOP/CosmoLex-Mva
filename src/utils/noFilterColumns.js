export const noFilterColumns = (columns = []) => {
  if (!columns.length) return [];
  return columns.map((col) => ({
    ...col,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
  }));
};
