export const setQueryParam = (key, value, setSearchParams, searchParams) => {
  searchParams.set(key, value);
  setSearchParams(searchParams);
};
