import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MatterTable from '@/components/matter/MatterTable';
import getMatters from '@/pages/matter/intake/helpers/getMatters';

const ActiveFilesPage = () => {
  const navigate = useNavigate();

  const {
    data: matters,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['matters', 'active'],
    queryFn: () => getMatters({ status: 'active_files' }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const handleRowClick = (params) => {
    console.log('Matter clicked:', params.row);
    // You can add navigation logic here if needed
  };

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col space-y-6 overflow-y-auto overflow-x-hidden no-scrollbar p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h2 className="text-[32px] text-[#1E293B] font-bold font-sans">
            Active Files (In Progress)
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>Refresh</span>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading active files...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-500">
            <span>Error loading active files. Please try again.</span>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="h-full">
            {matters && matters.length > 0 ? (
              <MatterTable matters={matters} onRowClick={handleRowClick} />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <span>No active files found.</span>
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  className="mt-4"
                >
                  Refresh
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveFilesPage;
