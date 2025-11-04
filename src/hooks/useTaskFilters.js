import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  buildFilterQuery,
  hasActiveFilters,
  extractFiltersFromURL,
  updateURLWithFilters,
  clearFiltersFromURL,
  getInitialFilterState,
  getActiveFiltersCount,
  createEmptyFilterState,
} from '@/utils/taskFilters';

export const useTaskFilters = ({ getFilteredTasks, tasks, tasksLoading }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract current filter parameters from URL
  const urlFilters = useMemo(
    () => extractFiltersFromURL(searchParams),
    [searchParams]
  );

  const [tempFilters, setTempFilters] = useState(
    getInitialFilterState(searchParams)
  );

  const [serverTasks, setServerTasks] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const isApplyingFilters = useRef(false);

  useEffect(() => {
    setTempFilters(urlFilters);
  }, [urlFilters]);

  useEffect(() => {
    if (tasksLoading || isApplyingFilters.current) return;

    if (hasActiveFilters(urlFilters)) {
      const qs = buildFilterQuery(urlFilters);

      isApplyingFilters.current = true;
      setIsFiltering(true);

      getFilteredTasks(qs.toString())
        .then((data) => {
          setServerTasks(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          console.error('Initial filter error:', error);
          toast.error('Failed to apply initial filters. Please try again.');
          setServerTasks([]);
        })
        .finally(() => {
          setIsFiltering(false);
          isApplyingFilters.current = false;
        });
    }
  }, [tasksLoading, getFilteredTasks, urlFilters]);

  const applyFilters = useCallback(
    (overrides = null) => {
      const filtersToApply = overrides
        ? { ...tempFilters, ...overrides }
        : tempFilters;

      const next = updateURLWithFilters(filtersToApply, searchParams);
      setSearchParams(next, { replace: true });

      if (!hasActiveFilters(filtersToApply)) {
        setServerTasks(Array.isArray(tasks) ? tasks : []);
        return;
      }

      // Build query string and fetch filtered data
      const qs = buildFilterQuery(filtersToApply);

      isApplyingFilters.current = true;
      setIsFiltering(true);

      getFilteredTasks(qs.toString())
        .then((data) => {
          setServerTasks(Array.isArray(data) ? data : []);
          toast.success(
            `Found ${
              Array.isArray(data) ? data.length : 0
            } tasks matching your filters.`
          );
        })
        .catch((error) => {
          console.error('Filter error:', error);
          toast.error('Failed to apply filters. Please try again.');
          setServerTasks([]);
        })
        .finally(() => {
          setIsFiltering(false);
          isApplyingFilters.current = false;
        });
    },
    [tempFilters, searchParams, setSearchParams, tasks, getFilteredTasks]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setTempFilters(createEmptyFilterState());

    const next = clearFiltersFromURL(searchParams);
    setSearchParams(next, { replace: true });

    setServerTasks(Array.isArray(tasks) ? tasks : []);
  }, [searchParams, setSearchParams, tasks]);

  //Update a specific filter value
  const updateFilter = useCallback((key, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);
  console.log(tempFilters, '>>>>>>>>>tempFilters');

  //Get count of active filters
  const activeFiltersCount = getActiveFiltersCount(urlFilters);

  const displayTasks = useMemo(() => {
    if (serverTasks !== null) {
      return serverTasks;
    }
    if (!hasActiveFilters(urlFilters)) {
      return Array.isArray(tasks) ? tasks : [];
    }
    return [];
  }, [serverTasks, tasks, urlFilters]);

  return {
    // State
    tempFilters,
    serverTasks: displayTasks,
    isFiltering,
    activeFiltersCount,
    urlFilters,

    // Actions
    applyFilters,
    clearAllFilters,
    updateFilter,
    setTempFilters,

    // Utilities
    hasActiveFilters: () => hasActiveFilters(tempFilters),
    buildFilterQuery: () => buildFilterQuery(tempFilters),
  };
};
