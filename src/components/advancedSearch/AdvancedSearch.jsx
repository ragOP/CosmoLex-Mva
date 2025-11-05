import React, { useState, useEffect } from 'react';
import { RotateCcw, Filter, X } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getAdvancedSearchMeta,
  performAdvancedSearch,
} from '@/api/api_services/advancedSearch';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { usePermission } from '@/utils/usePermission';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';

const AdvancedSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchFormData, setSearchFormData] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  // Permissions
  const { hasPermission, isAdmin } = usePermission();
  const canRunSearch = isAdmin || hasPermission('search.advanced.run');

  // Load search criteria from URL params on component mount
  useEffect(() => {
    const urlCriteria = {};
    const hasResults = searchParams.get('page') === 'results';

    searchParams.forEach((value, key) => {
      if (key !== 'results' && key !== 'page' && value && value.trim() !== '') {
        urlCriteria[key] = value.trim();
      }
    });

    if (Object.keys(urlCriteria).length > 0) {
      setSearchFormData(urlCriteria);

      // Check permission before executing search
      if (!canRunSearch) {
        toast.error('You do not have permission to run advanced searches.');
        return;
      }

      // Only trigger search if we *didn't already* add page=results
      if (!hasResults) {
        handleSearch(urlCriteria);
      } else {
        // If page=results and criteria exist, just show results
        searchMutation.mutate(urlCriteria);
      }
    } else if (hasResults) {
      setSearchResults({ data: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch search metadata
  const { data: metaData, isLoading: isLoadingMeta } = useQuery({
    queryKey: ['advancedSearchMeta'],
    queryFn: getAdvancedSearchMeta,
  });

  // Search mutation
  const searchMutation = useMutation({
    mutationFn: performAdvancedSearch,
    onSuccess: (data) => {
      setSearchResults(data);
      setIsSearching(false);
      toast.success('Search completed successfully!');
    },
    onError: (error) => {
      setIsSearching(false);
      toast.error('Search failed. Please try again.');
      console.error('Search error:', error);
      // Remove page=results parameter on error since no results are displayed
      const currentParams = new URLSearchParams(searchParams);
      currentParams.delete('page');
      setSearchParams(currentParams);
    },
  });

  const handleSearch = (formData) => {
    // Check permission before running search
    if (!canRunSearch) {
      toast.error('You do not have permission to run advanced searches.');
      return;
    }

    setIsSearching(true);
    setSearchFormData(formData);

    // Save search criteria to URL - only include fields with actual values
    const newSearchParams = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      // Only include fields that have meaningful values
      if (
        value &&
        value.toString().trim() !== '' &&
        value !== 'undefined' &&
        value !== 'null'
      ) {
        newSearchParams.set(key, value.toString().trim());
      }
    });

    // Add page=results parameter to indicate search results are being displayed
    newSearchParams.set('page', 'results');

    setSearchParams(newSearchParams);

    searchMutation.mutate(formData);
  };

  // const handleReset = () => {
  //   setSearchFormData({});
  //   setSearchResults(null);
  // };

  const handleClearResults = () => {
    setSearchResults(null);
    setSearchFormData({});
    // Clear search parameters from URL including page=results
    setSearchParams(new URLSearchParams());
  };

  // Hide component entirely when user lacks permission
  if (!canRunSearch) {
    return null;
  }

  return (
    <div className="px-4 pb-2 flex flex-col gap-2 h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="pl-2">
          <h1 className="text-xl font-bold text-gray-900">Advanced Search</h1>
          <p className="text-base text-gray-600 ">
            Search through contacts and cases with advanced filters
          </p>
        </div>

        <div className="flex items-center gap-3">
          {searchResults && (
            <Button
              onClick={handleClearResults}
              variant="outline"
              className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
            >
              <X size={16} />
              Clear Results
            </Button>
          )}
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white/50 backdrop-blur-md border border-gray-200/80 shadow-lg gap-4 p-4 rounded-lg flex flex-col h-full overflow-auto ">
        <div className="flex items-center gap-3">
          {searchResults ? (
            <>
              <Filter className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-semibold text-gray-800">
                Search Results ({searchResults?.data?.length || 0})
              </h2>
            </>
          ) : (
            <>
              <Filter className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-semibold text-gray-800">
                Search Criteria
              </h2>
            </>
          )}
        </div>

        {isLoadingMeta ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#7367F0] rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              Loading search options...
            </h3>
            <p className="text-sm text-gray-500">
              Please wait while we fetch the available search filters
            </p>
          </div>
        ) : !searchResults ? (
          <SearchForm
            metaData={metaData}
            onSearch={handleSearch}
            isSearching={isSearching}
            searchFormData={searchFormData}
          />
        ) : null}

        {/* Search Results */}
        {searchResults && (
          <SearchResults
            results={searchResults}
            searchCriteria={searchFormData}
          />
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;
