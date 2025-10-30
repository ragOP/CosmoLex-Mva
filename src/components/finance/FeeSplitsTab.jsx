import React, { useState, useEffect } from 'react';
import {
  Stack,
  IconButton,
  Typography,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
} from '@mui/material';
import {
  Search,
  RotateCcw,
  Plus,
  Calculator,
  FileText,
  DollarSign,
  TrendingUp,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Grid3X3,
  List,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFeeSplits,
  createFeeSplit,
  updateFeeSplit,
  deleteFeeSplit,
} from '@/api/api_services/finance';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CreateFeeSplitDialog from './components/CreateFeeSplitDialog';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PermissionGuard from '@/components/auth/PermissionGuard';
import { usePermission } from '@/utils/usePermission';

const FeeSplitsTab = ({ slugId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingFeeSplit, setEditingFeeSplit] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feeSplitToDelete, setFeeSplitToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFeeSplit, setSelectedFeeSplit] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Permission checks
  const { hasPermission } = usePermission();
  const canViewFeeSplits = hasPermission('fee-splits.view');
  const canCreateFeeSplit = hasPermission('fee-splits.create');
  const canUpdateFeeSplit = hasPermission('fee-splits.update');
  const canDeleteFeeSplit = hasPermission('fee-splits.delete');
  const canShowFeeSplit = hasPermission('fee-splits.show');

  // Fetch fee splits
  const {
    data: feeSplitsResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['feeSplits', slugId],
    queryFn: () => getFeeSplits(slugId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!slugId,
  });

  const feeSplits = feeSplitsResponse?.data || [];

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && feeSplits.length) {
      const feeSplit = feeSplits.find((f) => String(f.id) === String(editId));
      if (feeSplit) {
        setEditingFeeSplit(feeSplit);
        setEditDialogOpen(true);
      }
    } else {
      setEditDialogOpen(false);
      setEditingFeeSplit(null);
    }
  }, [searchParams, feeSplits]);

  const handleRefresh = () => {
    refetch();
  };

  // Create fee split mutation
  const createFeeSplitMutation = useMutation({
    mutationFn: ({ slugId, ...feeSplitData }) =>
      createFeeSplit(feeSplitData, slugId),
  });

  // Update fee split mutation
  const updateFeeSplitMutation = useMutation({
    mutationFn: ({ id, data }) => updateFeeSplit(id, data, slugId),
  });

  // Delete fee split mutation
  const deleteFeeSplitMutation = useMutation({
    mutationFn: deleteFeeSplit,
    onSuccess: () => {
      toast.success('Fee split deleted successfully!');
      setDeleteDialogOpen(false);
      setFeeSplitToDelete(null);
      queryClient.invalidateQueries(['feeSplits', slugId]);
    },
    onError: (error) => {
      toast.error('Failed to delete fee split. Please try again.');
      console.error('Delete fee split error:', error);
    },
  });

  const handleCreateFeeSplit = async (feeSplitData, setApiErrors) => {
    try {
      const result = await createFeeSplitMutation.mutateAsync({
        ...feeSplitData,
        slugId,
      });

      // Return the result to the dialog for proper error handling
      return result;
    } catch (error) {
      console.error('Create fee split error:', error);

      // Handle API validation errors
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.Apistatus === false && errorData.errors) {
          setApiErrors(errorData.errors);
          return errorData; // Return error data to dialog
        }
      }

      // Return generic error
      return {
        Apistatus: false,
        message: 'Failed to create fee split. Please try again.',
      };
    }
  };

  const handleUpdateFeeSplit = async (data) => {
    if (!editingFeeSplit) return;

    try {
      const result = await updateFeeSplitMutation.mutateAsync({
        id: editingFeeSplit.id,
        data,
      });

      // Return the result to the dialog for proper error handling
      return result;
    } catch (error) {
      console.error('Update fee split error:', error);

      // Handle API validation errors
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.Apistatus === false && errorData.errors) {
          return errorData; // Return error data to dialog
        }
      }

      // Return generic error
      return {
        Apistatus: false,
        message: 'Failed to update fee split. Please try again.',
      };
    }
  };

  const handleViewFeeSplit = (feeSplitId) => {
    if (canShowFeeSplit) {
      navigate(
        `/dashboard/inbox/finance/${feeSplitId}?slugId=${slugId}&tab=fee-splits`
      );
    }
  };

  const handleEditFeeSplit = (feeSplitId) => {
    // Open edit dialog via URL param for consistency
    navigate(
      `/dashboard/inbox/finance?slugId=${slugId}&tab=fee-splits&edit=${feeSplitId}`
    );
  };

  const handleDeleteFeeSplit = (feeSplit) => {
    setFeeSplitToDelete(feeSplit);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteFeeSplit = () => {
    if (feeSplitToDelete) {
      deleteFeeSplitMutation.mutate(feeSplitToDelete.id);
    }
  };

  const filteredFeeSplits = feeSplits.filter((split) => {
    const firmName = split.firm_name?.toLowerCase() || '';
    const overrideType = split.override_type?.toLowerCase() || '';
    const referralStatus = split.referral_status?.toLowerCase() || '';
    const firmAgreement = split.firm_agreement?.toLowerCase() || '';
    const createdBy = split.created_by?.toLowerCase() || '';
    const overrideValue = split.override?.toLowerCase() || '';

    return (
      firmName.includes(searchTerm.toLowerCase()) ||
      overrideType.includes(searchTerm.toLowerCase()) ||
      referralStatus.includes(searchTerm.toLowerCase()) ||
      firmAgreement.includes(searchTerm.toLowerCase()) ||
      createdBy.includes(searchTerm.toLowerCase()) ||
      overrideValue.includes(searchTerm.toLowerCase())
    );
  });

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
    <PermissionGuard
      permission="fee-splits.view"
      fallback={
        <div className="p-4">
          <div className="text-center py-8">
            <p className="text-red-600">
              You don't have permission to view fee splits.
            </p>
          </div>
        </div>
      }
    >
      <div className="p-4">
        <Stack spacing={3}>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              Fee Splits Management
            </h2>

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

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>

              <PermissionGuard permission="fee-splits.create">
                <button
                  onClick={() => setCreateDialogOpen(true)}
                  className="px-4 py-2 bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Fee Split
                </button>
              </PermissionGuard>
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
              <div className="text-center max-w-md py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calculator className="w-12 h-12 text-purple-500" />
                </div>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: '#374151', mb: 2 }}
                >
                  No fee splits yet
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4, lineHeight: 1.6 }}
                >
                  {searchTerm
                    ? `No fee splits found matching "${searchTerm}". Try adjusting your search terms.`
                    : 'Start managing your fee agreements by adding your first fee split arrangement.'}
                </Typography>
                {!searchTerm && (
                  <PermissionGuard permission="fee-splits.create">
                    <button
                      onClick={() => setCreateDialogOpen(true)}
                      className="px-6 py-3 bg-gradient-to-r from-[#7367F0] to-[#453E90] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      <Plus size={18} className="mr-2 inline" />
                      Add First Fee Split
                    </button>
                  </PermissionGuard>
                )}
              </div>
            ) : (
              <div className="w-full">
                {viewMode === 'grid' ? (
                  // Grid View - Cards
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFeeSplits.map((split) => (
                      <div
                        key={split.id}
                        className={`bg-white rounded-xl border border-gray-200 p-6 transition-all duration-200 ${
                          canShowFeeSplit
                            ? 'hover:shadow-lg hover:border-gray-300 cursor-pointer'
                            : ''
                        }`}
                        onClick={() =>
                          canShowFeeSplit && handleViewFeeSplit(split.id)
                        }
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                Fee Split #{split.id}
                              </h3>
                              <p className="text-xs text-gray-500">
                                Created by {split.created_by || 'Unknown'}
                              </p>
                            </div>
                          </div>
                          <IconButton
                            size="small"
                            className="text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAnchorEl(e.currentTarget);
                              setSelectedFeeSplit(split);
                            }}
                          >
                            <MoreVertical size={16} />
                          </IconButton>
                        </div>

                        {/* Firm Info */}
                        <div className="mb-4">
                          <p className="font-medium text-gray-900 text-sm mb-1">
                            {split.firm_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {split.override_type}
                          </p>
                        </div>

                        {/* Split Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-600">
                              Override: {split.override}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600">
                              Agreement: {split.firm_agreement}
                            </span>
                          </div>
                        </div>

                        {/* Financial Summary */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                Override Type:
                              </span>
                              <span className="font-semibold text-gray-900">
                                {split.override_type}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-blue-600">
                                Override Value:
                              </span>
                              <span className="font-medium text-blue-600">
                                {split.override}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <Chip
                            label={split.referral_status}
                            size="small"
                            sx={{
                              ...getStatusColor(split.referral_status),
                              fontSize: '0.75rem',
                              fontWeight: 500,
                            }}
                          />
                          <div className="text-xs text-gray-500">
                            <p>
                              {new Date(split.created_at).toLocaleDateString()}
                            </p>
                            {split.created_by && (
                              <p className="text-xs text-gray-400">
                                by {split.created_by}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // List View - Table
                  <>
                    {/* Table Header */}
                    <div className="bg-gray-50 rounded-t-lg border border-gray-200 px-6 py-4">
                      <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                        <div className="col-span-3">Fee Split Info</div>
                        <div className="col-span-2">Partner Firm</div>
                        <div className="col-span-2">Override Details</div>
                        <div className="col-span-3">Agreement & Status</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-1">Date</div>
                      </div>
                    </div>

                    {/* Table Body */}
                    <div className="bg-white border-l border-r border-b border-gray-200 rounded-b-lg">
                      {filteredFeeSplits.map((split, index) => (
                        <div
                          key={split.id}
                          className={`px-6 py-4 border-gray-100 transition-colors ${
                            index !== filteredFeeSplits.length - 1
                              ? 'border-b'
                              : ''
                          }`}
                          style={{
                            cursor: canShowFeeSplit ? 'pointer' : 'default',
                            backgroundColor: 'transparent',
                          }}
                          onClick={() =>
                            canShowFeeSplit && handleViewFeeSplit(split.id)
                          }
                          onMouseEnter={(e) => {
                            if (canShowFeeSplit) {
                              e.currentTarget.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (canShowFeeSplit) {
                              e.currentTarget.style.backgroundColor =
                                'transparent';
                            }
                          }}
                        >
                          <div className="grid grid-cols-12 gap-4 items-center">
                            {/* Fee Split Information */}
                            <div className="col-span-3">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                    Fee Split #{split.id}
                                  </h3>
                                  <p className="text-xs text-gray-500">
                                    Created by {split.created_by || 'Unknown'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Partner Firm */}
                            <div className="col-span-2">
                              <p className="font-medium text-gray-900 text-sm">
                                {split.firm_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {split.override_type}
                              </p>
                            </div>

                            {/* Split Details */}
                            <div className="col-span-2">
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-medium text-blue-600">
                                  Override: {split.override}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calculator className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium text-green-600">
                                  Agreement: {split.firm_agreement}
                                </span>
                              </div>
                            </div>

                            {/* Financial Breakdown */}
                            <div className="col-span-3">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    Override Type:
                                  </span>
                                  <span className="font-semibold text-gray-900">
                                    {split.override_type}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-blue-600">
                                    Override Value:
                                  </span>
                                  <span className="font-medium text-blue-600">
                                    {split.override}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-green-600">
                                    Firm Agreement:
                                  </span>
                                  <span className="font-medium text-green-600">
                                    {split.firm_agreement}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Status */}
                            <div className="col-span-1">
                              <Chip
                                label={split.referral_status}
                                size="small"
                                sx={{
                                  ...getStatusColor(split.referral_status),
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                }}
                              />
                            </div>

                            {/* Date */}
                            <div className="col-span-1">
                              <div className="text-xs text-gray-500">
                                <p>
                                  {new Date(
                                    split.created_at
                                  ).toLocaleDateString()}
                                </p>
                                {split.created_by && (
                                  <p className="text-xs text-gray-400">
                                    by {split.created_by}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="col-span-1">
                              <IconButton
                                size="small"
                                className="text-gray-400 hover:text-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAnchorEl(e.currentTarget);
                                  setSelectedFeeSplit(split);
                                }}
                              >
                                <MoreVertical size={16} />
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Create Fee Split Dialog */}
          <CreateFeeSplitDialog
            open={createDialogOpen}
            onClose={(success) => {
              if (success) {
                // Success - invalidate queries and close dialog
                queryClient.invalidateQueries(['feeSplits', slugId]);
              }
              setCreateDialogOpen(false);
            }}
            onSubmit={handleCreateFeeSplit}
            isLoading={createFeeSplitMutation.isPending}
          />

          {/* Edit Fee Split Dialog */}
          <CreateFeeSplitDialog
            open={editDialogOpen}
            onClose={(success) => {
              if (success) {
                // Success - invalidate queries, close dialog, and clear URL params
                queryClient.invalidateQueries(['feeSplits', slugId]);
                const params = new URLSearchParams(searchParams);
                params.delete('edit');
                navigate(`?${params.toString()}`, { replace: true });
              }
              setEditDialogOpen(false);
              setEditingFeeSplit(null);
            }}
            onSubmit={handleUpdateFeeSplit}
            isLoading={updateFeeSplitMutation.isPending}
            editMode={true}
            editingFeeSplit={editingFeeSplit}
          />

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <div className="p-6">
              <Typography
                variant="h6"
                className="font-semibold text-gray-900 mb-4"
              >
                Delete Fee Split
              </Typography>
              <Typography variant="body1" className="text-gray-600 mb-6">
                Are you sure you want to delete this fee split? This action
                cannot be undone.
              </Typography>
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setDeleteDialogOpen(false)}
                  variant="outline"
                  className="border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeleteFeeSplit}
                  disabled={deleteFeeSplitMutation.isPending}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  {deleteFeeSplitMutation.isPending
                    ? 'Deleting...'
                    : 'Delete Fee Split'}
                </Button>
              </div>
            </div>
          </Dialog>

          {/* Three-dot Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => {
              setAnchorEl(null);
              setSelectedFeeSplit(null);
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <PermissionGuard permission="fee-splits.show">
              <MenuItem
                onClick={() => {
                  if (selectedFeeSplit) {
                    handleViewFeeSplit(selectedFeeSplit.id);
                    setAnchorEl(null);
                    setSelectedFeeSplit(null);
                  }
                }}
              >
                <ListItemIcon>
                  <Eye size={16} />
                </ListItemIcon>
                View Fee Split Details
              </MenuItem>
            </PermissionGuard>
            <PermissionGuard permission="fee-splits.update">
              <MenuItem
                onClick={() => {
                  if (selectedFeeSplit) {
                    handleEditFeeSplit(selectedFeeSplit.id);
                    setAnchorEl(null);
                    setSelectedFeeSplit(null);
                  }
                }}
              >
                <ListItemIcon>
                  <Edit size={16} />
                </ListItemIcon>
                Edit Fee Split
              </MenuItem>
            </PermissionGuard>
            <PermissionGuard permission="fee-splits.delete">
              <MenuItem
                onClick={() => {
                  if (selectedFeeSplit) {
                    handleDeleteFeeSplit(selectedFeeSplit);
                    setAnchorEl(null);
                    setSelectedFeeSplit(null);
                  }
                }}
                sx={{ color: '#dc2626' }}
              >
                <ListItemIcon>
                  <Trash2 size={16} style={{ color: '#dc2626' }} />
                </ListItemIcon>
                Delete Fee Split
              </MenuItem>
            </PermissionGuard>
          </Menu>
        </Stack>
      </div>
    </PermissionGuard>
  );
};

export default FeeSplitsTab;
