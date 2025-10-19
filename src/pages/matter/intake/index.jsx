import React from 'react';
import Button from '@/components/Button';
import MatterTable from '@/components/matter/MatterTable';
import { Loader2, Plus, X, Search } from 'lucide-react'; // Added Search icon
import { useQuery } from '@tanstack/react-query';
import getMatters from './helpers/getMatters';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Clock } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import getMatterMeta from '@/pages/matter/intake/helpers/getMatterMeta';

const FilterTag = ({ filterKey, filterValue, onRemove }) => (
  <div className="flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">
    <span className="capitalize">{filterKey.replace(/_/g, ' ')}: {filterValue}</span>
    <button onClick={() => onRemove(filterKey, filterValue)} className="rounded-full hover:bg-indigo-200">
      <X size={14} />
    </button>
  </div>
);


const TasksPage = () => {
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState({});
  const [searchText, setSearchText] = useState('');
  const [currentFilterType, setCurrentFilterType] = useState('');

  const { data: matters, isLoading } = useQuery({
    queryKey: ['matters'],
    queryFn: getMatters,
  });

  const { data: matterMeta } = useQuery({
    queryKey: ['matterMeta'],
    queryFn: getMatterMeta,
  });

  const filteredMatters = React.useMemo(() => {
    const baseMatters = matters || [];

    // Search functionality is applied first
    const searchedMatters = searchText
      ? baseMatters.filter((matter) =>
        (matter?.contact || '')
          .toString()
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
      : baseMatters;

    const filterKeys = Object.keys(activeFilters);

    if (filterKeys.length === 0) {
      return searchedMatters;
    }

    return searchedMatters.filter((matter) => {
      return filterKeys.every((key) => {
        const selectedValues = activeFilters[key];
        if (!selectedValues || selectedValues.length === 0) {
          return true;
        }
        return selectedValues.includes(matter[key]);
      });
    });
  }, [activeFilters, matters, searchText]);

  const handleFilterChange = (type, value) => {
    setActiveFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      const currentValues = newFilters[type] || [];

      if (currentValues.includes(value)) {
        newFilters[type] = currentValues.filter((v) => v !== value);
      } else {
        newFilters[type] = [...currentValues, value];
      }

      if (newFilters[type].length === 0) {
        delete newFilters[type];
      }

      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setCurrentFilterType('');
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 h-full w-full overflow-auto">
      {/* --- Main Header Container --- */}
      <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-center px-[50px] pt-4 gap-3">
        <p className="text-2xl font-bold">Matters ({filteredMatters?.length || 0})</p>

        {/* --- Right-side Controls Container (responsive) --- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-[80%] sm:w-auto">
          {/* --- Standalone Search Input --- */}
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-[#E2E8F0] rounded-md px-2 h-10 shadow w-[80%] sm:w-auto">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search contact..."
              className="h-full w-full outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center gap-3.5 bg-white/50 backdrop-blur-sm border border-[#E2E8F0] rounded-md px-2 h-10 shadow w-full sm:w-auto">
            <Clock size={16} className="text-[#6366F1]" />
            <span className="text-sm font-semibold uppercase text-[#40444D]">
              Filter
            </span>
            <span className="h-5 w-px bg-[#E2E8F0]" />
            <div className="min-w-[120px] h-full flex items-center mr-[-8px]">
              <Select
                value={currentFilterType}
                onValueChange={(value) => setCurrentFilterType(value)}
                disabled={isLoading}
              >
                <SelectTrigger className="h-10 bg-transparent border-0 shadow-none px-1 focus:ring-0 focus:outline-none w-auto min-w-[120px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="min-w-[160px]">
                  <SelectItem value="case_role">Case Role</SelectItem>
                  <SelectItem value="case_type">Case Type</SelectItem>
                  <SelectItem value="case_status">Case Status</SelectItem>
                  <SelectItem value="marketing_source">Marketing Source</SelectItem>
                  <SelectItem value="assignees">Assignee</SelectItem>
                  <SelectItem value="owners">Owner</SelectItem>
                  <SelectItem value="ad_campaign_id">Ad Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[120px] h-full flex items-center">
              <Select
                value=""
                onValueChange={(value) => {
                  if (currentFilterType && value) {
                    handleFilterChange(currentFilterType, value)
                  }
                }}
                disabled={!currentFilterType || isLoading}
              >
                <SelectTrigger className="h-10 bg-transparent border-0 shadow-none px-1 focus:ring-0 focus:outline-none w-auto min-w-[120px]">
                  <SelectValue placeholder={activeFilters[currentFilterType]?.join(', ') || 'Select Value...'} />
                </SelectTrigger>
                <SelectContent className="min-w-[160px]">
                  {matterMeta && currentFilterType && matterMeta[currentFilterType] ? (
                    matterMeta[currentFilterType]?.map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1 text-sm text-gray-500">Select a category first</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Create button moved outside of Select to avoid layout issues on small screens */}
            <div className="ml-auto sm:ml-2">
              <Button
                onClick={() => navigate(`/dashboard/inbox/overview/create`)}
                className="cursor-pointer text-center pr-1.5 max-w-48 rounded-md min-w-36 ml-3.5 sm:ml-1.5"
                icon={Plus}
                iconPosition="left"
              >
                Create Matter
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* --- Active Filters & Clear Button Display --- */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-2 min-h-[34px]">
        {Object.keys(activeFilters).length > 0 && (
          <>
            {Object.entries(activeFilters).flatMap(([key, values]) =>
              values.map(value =>
                <FilterTag key={`${key}-${value}`} filterKey={key} filterValue={value} onRemove={handleFilterChange} />
              )
            )}
            <button
              onClick={clearAllFilters}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 h-7 w-[100px] px-2 py-1 text-xs font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Clear All
            </button>
          </>
        )}
      </div>

      <div className="px-4 max-h-[calc(100%-120px)]">
        <MatterTable
          matters={filteredMatters || []}
          onRowClick={(params) => {
            navigate(`/dashboard/inbox/overview?slugId=${params.row.slug}`, {
              state: { slug: params.row.slug },
            });
          }}
        />
      </div>
    </div>
  );
};

export default TasksPage;