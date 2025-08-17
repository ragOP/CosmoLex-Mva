import React, { useState } from 'react';
import { Stack, IconButton, Typography, Chip } from '@mui/material';
import { Search, RotateCcw, Plus, Calculator, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFeeSplits, createFeeSplit } from '@/api/api_services/finance';
import { Input } from '@/components/ui/input';
import CreateFeeSplitDialog from './components/CreateFeeSplitDialog';
import { toast } from 'sonner';

const FeeSplitsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch fee splits
  const { data: feeSplitsResponse, isLoading, refetch } = useQuery({
    queryKey: ['feeSplits'],
    queryFn: getFeeSplits,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const feeSplits = feeSplitsResponse?.data || [];

  const handleRefresh = () => {
    refetch();
  };

  // Create fee split mutation
  const createFeeSplitMutation = useMutation({
    mutationFn: createFeeSplit,
    onSuccess: () => {
      toast.success('Fee split created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['feeSplits']);
    },
    onError: (error) => {
      toast.error('Failed to create fee split. Please try again.');
      console.error('Create fee split error:', error);
    }
  });

  const handleCreateFeeSplit = (feeSplitData) => {
    createFeeSplitMutation.mutate(feeSplitData);
  };

  const filteredFeeSplits = feeSplits.filter(split => 
    split.case_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    split.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    split.firm_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Settled':
        return { bgcolor: '#d1fae5', color: '#065f46' };
      case 'Pending':
        return { bgcolor: '#fef3c7', color: '#92400e' };
      case 'Active':
        return { bgcolor: '#dbeafe', color: '#1e40af' };
      default:
        return { bgcolor: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div className="p-4">
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <h2 className="text-xl font-semibold text-gray-900">Fee Splits Management</h2>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search fee splits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <button 
              onClick={() => setCreateDialogOpen(true)}
              className="px-4 py-2 bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Fee Split
            </button>
          </Stack>
        </Stack>
        
        {/* Fee Splits List */}
        <div className="flex items-center justify-center">
          {isLoading ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#7367F0] rounded-full animate-spin mx-auto mb-4"></div>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Loading fee splits...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we fetch your fee splits data
              </Typography>
            </div>
          ) : filteredFeeSplits.length === 0 ? (
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calculator className="w-12 h-12 text-purple-500" />
              </div>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#374151', mb: 2 }}>
                No fee splits yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                {searchTerm ? 
                  `No fee splits found matching "${searchTerm}". Try adjusting your search terms.` :
                  "Start managing your fee agreements by adding your first fee split arrangement."
                }
              </Typography>
              {!searchTerm && (
                <button 
                  onClick={() => setCreateDialogOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#7367F0] to-[#453E90] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Plus size={18} className="mr-2 inline" />
                  Add First Fee Split
                </button>
              )}
            </div>
          ) : (
            <div className="w-full">
              {/* Table Header */}
              <div className="bg-gray-50 rounded-t-lg border border-gray-200 px-6 py-4">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                  <div className="col-span-3">Case Information</div>
                  <div className="col-span-2">Partner Firm</div>
                  <div className="col-span-2">Split Details</div>
                  <div className="col-span-3">Financial Breakdown</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1">Date</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="bg-white border-l border-r border-b border-gray-200 rounded-b-lg">
                {filteredFeeSplits.map((split, index) => (
                  <div
                    key={split.id}
                    className={`px-6 py-4 border-gray-100 hover:bg-gray-50 transition-colors ${
                      index !== filteredFeeSplits.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Case Information */}
                      <div className="col-span-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                              {split.case_name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {split.case_number}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Partner Firm */}
                      <div className="col-span-2">
                        <p className="font-medium text-gray-900 text-sm">{split.firm_name}</p>
                        <p className="text-xs text-gray-500">{split.split_type}</p>
                      </div>

                      {/* Split Details */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-600">Us: {split.our_percentage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium text-orange-600">Them: {split.their_percentage}</span>
                        </div>
                      </div>

                      {/* Financial Breakdown */}
                      <div className="col-span-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Total:</span>
                            <span className="font-semibold text-gray-900">{split.total_settlement}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-blue-600">Our Share:</span>
                            <span className="font-medium text-blue-600">{split.our_share}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-orange-600">Their Share:</span>
                            <span className="font-medium text-orange-600">{split.their_share}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-1">
                        <Chip
                          label={split.status}
                          size="small"
                          sx={{
                            ...getStatusColor(split.status),
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}
                        />
                      </div>

                      {/* Date */}
                      <div className="col-span-1">
                        <p className="text-xs text-gray-500">
                          {new Date(split.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create Fee Split Dialog */}
        <CreateFeeSplitDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateFeeSplit}
          isLoading={createFeeSplitMutation.isPending}
        />
      </Stack>
    </div>
  );
};

export default FeeSplitsTab; 