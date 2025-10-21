export const buildFilterQuery = (filters) => {
  const qs = new URLSearchParams();

  if (filters.client_name) qs.set('client_name', filters.client_name);
  if (filters.priority_id) qs.set('priority_id', filters.priority_id);
  if (filters.status_id) qs.set('status_id', filters.status_id);
  if (filters.assigned_to) qs.set('assigned_to', filters.assigned_to);
  if (filters.from_date) qs.set('from_date', filters.from_date);
  if (filters.to_date) qs.set('to_date', filters.to_date);
  if (filters.assigned_by) qs.set('assigned_by', filters.assigned_by);
  if (filters.administrator) qs.set('administrator', filters.administrator);

  return qs;
};

//Check if any filters are active

export const hasActiveFilters = (filters) => {
  return Object.values(filters).some((value) => value && value !== '');
};

export const extractFiltersFromURL = (searchParams) => {
  return {
    client_name: searchParams.get('client_name') || '',
    priority_id: searchParams.get('priority_id') || '',
    status_id: searchParams.get('status_id') || '',
    assigned_to: searchParams.get('assigned_to') || '',
    from_date: searchParams.get('from_date') || '',
    to_date: searchParams.get('to_date') || '',
    assigned_by: searchParams.get('assigned_by') || '',
    administrator: searchParams.get('administrator') || '',
  };
};

export const updateURLWithFilters = (filters, currentSearchParams) => {
  const next = new URLSearchParams(currentSearchParams);

  // Clear existing filter params
  const filterKeys = [
    'client_name',
    'priority_id',
    'status_id',
    'assigned_to',
    'from_date',
    'to_date',
    'assigned_by',
    'administrator',
  ];

  filterKeys.forEach((key) => next.delete(key));

  // Set new filter params
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== '') {
      next.set(key, value);
    }
  });

  return next;
};

export const clearFiltersFromURL = (currentSearchParams) => {
  const next = new URLSearchParams(currentSearchParams);

  const filterKeys = [
    'client_name',
    'priority_id',
    'status_id',
    'assigned_to',
    'from_date',
    'to_date',
    'assigned_by',
    'administrator',
  ];

  filterKeys.forEach((key) => next.delete(key));

  return next;
};

export const getInitialFilterState = (searchParams) => {
  return extractFiltersFromURL(searchParams);
};

export const getActiveFiltersCount = (filters) => {
  return Object.values(filters).filter((value) => value && value !== '').length;
};

export const createEmptyFilterState = () => {
  return {
    client_name: '',
    priority_id: '',
    status_id: '',
    assigned_to: '',
    from_date: '',
    to_date: '',
    assigned_by: '',
    administrator: '',
  };
};
