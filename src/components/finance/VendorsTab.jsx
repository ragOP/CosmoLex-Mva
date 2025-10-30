import React, { useState, useEffect } from 'react';
import {
  Stack,
  IconButton,
  Typography,
  Chip,
  Dialog,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import {
  Search,
  RotateCcw,
  Plus,
  Users,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Grid3X3,
  List,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getVendors,
  createVendor,
  deleteVendor,
  updateVendor,
} from '@/api/api_services/finance';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CreateVendorDialog from './components/CreateVendorDialog';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PermissionGuard from '@/components/auth/PermissionGuard';
import { usePermission } from '@/utils/usePermission';

const VendorsTab = ({ slugId }) => {
  // Permission checks
  const { hasPermission } = usePermission();
  const canViewVendors = hasPermission('vendors.view');
  const canCreateVendor = hasPermission('vendors.create');
  const canShowVendor = hasPermission('vendors.show');
  const canUpdateVendor = hasPermission('vendors.update');
  const canDeleteVendor = hasPermission('vendors.delete');

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Fetch vendors
  const {
    data: vendorsResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['vendors'],
    queryFn: getVendors,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const vendors = vendorsResponse?.data || [];

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && vendors.length) {
      const vendor = vendors.find((v) => String(v.id) === String(editId));
      if (vendor) {
        setEditingVendor(vendor);
        setEditDialogOpen(true);
      }
    } else {
      setEditDialogOpen(false);
      setEditingVendor(null);
    }
  }, [searchParams, vendors]);

  const handleRefresh = () => {
    refetch();
  };

  // Create vendor mutation
  const createVendorMutation = useMutation({
    mutationFn: createVendor,
    onSuccess: () => {
      toast.success('Vendor created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['vendors']);
    },
    onError: (error) => {
      toast.error('Failed to create vendor. Please try again.');
      console.error('Create vendor error:', error);
    },
  });

  // Update vendor mutation
  const updateVendorMutation = useMutation({
    mutationFn: ({ id, data }) => updateVendor(id, data),
    onSuccess: () => {
      toast.success('Vendor updated successfully!');
      setEditDialogOpen(false);
      setEditingVendor(null);
      queryClient.invalidateQueries(['vendors']);
      // Clear the edit parameter from URL
      const params = new URLSearchParams(searchParams);
      params.delete('edit');
      navigate(`?${params.toString()}`, { replace: true });
    },
    onError: (error) => {
      toast.error('Failed to update vendor. Please try again.');
      console.error('Update vendor error:', error);
    },
  });

  // Delete vendor mutation
  const deleteVendorMutation = useMutation({
    mutationFn: deleteVendor,
    onSuccess: () => {
      toast.success('Vendor deleted successfully!');
      setDeleteDialogOpen(false);
      setVendorToDelete(null);
      queryClient.invalidateQueries(['vendors']);
      // Navigate back to vendors tab
      navigate(
        `/dashboard/inbox/finance?tab=vendors${
          slugId ? `&slugId=${slugId}` : ''
        }`
      );
    },
    onError: (error) => {
      toast.error('Failed to delete vendor. Please try again.');
      console.error('Delete vendor error:', error);
    },
  });

  const handleCreateVendor = (vendorData) => {
    createVendorMutation.mutate(vendorData);
  };

  const handleUpdateVendor = (data) => {
    if (!editingVendor) return;
    updateVendorMutation.mutate({ id: editingVendor.id, data });
  };

  const handleViewVendor = (vendorId) => {
    if (canShowVendor) {
      navigate(
        `/dashboard/inbox/finance/${vendorId}?slugId=${slugId}&tab=vendors`
      );
    }
  };

  const handleEditVendor = (vendorId) => {
    // Open edit dialog via URL param for consistency
    navigate(
      `/dashboard/inbox/finance?slugId=${slugId}&tab=vendors&edit=${vendorId}`
    );
  };

  const handleDeleteVendor = (vendor) => {
    setVendorToDelete(vendor);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteVendor = () => {
    if (vendorToDelete) {
      deleteVendorMutation.mutate(vendorToDelete.id);
    }
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.write_to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${vendor.first_name} ${vendor.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return { bgcolor: '#d1fae5', color: '#065f46' };
      case 'Inactive':
        return { bgcolor: '#fee2e2', color: '#991b1b' };
      case 'Pending':
        return { bgcolor: '#fef3c7', color: '#92400e' };
      default:
        return { bgcolor: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <PermissionGuard
      permission="vendors.view"
      fallback={
        <div className="p-4">
          <div className="text-center py-8">
            <p className="text-red-600">
              You don't have permission to view vendors.
            </p>
          </div>
        </div>
      }
    >
      <>
        <div className="p-4">
          <Stack spacing={3}>
            {/* Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Vendors Management
              </h2>

              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton onClick={handleRefresh} size="small">
                  <RotateCcw size={18} />
                </IconButton>

                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <Input
                    placeholder="Search vendors..."
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

                <PermissionGuard permission="vendors.create">
                  <button
                    onClick={() => setCreateDialogOpen(true)}
                    className="px-4 py-2 bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Vendor
                  </button>
                </PermissionGuard>
              </Stack>
            </Stack>

            {/* Vendors List */}
            <div className="flex items-center justify-center">
              {isLoading ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-[#7367F0] rounded-full animate-spin mx-auto mb-4"></div>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Loading vendors...
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please wait while we fetch your vendors data
                  </Typography>
                </div>
              ) : filteredVendors.length === 0 ? (
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-12 h-12 text-green-500" />
                  </div>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, color: '#374151', mb: 2 }}
                  >
                    No vendors yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Create your first vendor to get started
                  </Typography>
                </div>
              ) : (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'
                      : 'w-full'
                  }
                >
                  {filteredVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className={`bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 ${
                        canShowVendor
                          ? 'hover:border-gray-300 cursor-pointer'
                          : 'cursor-default'
                      } ${viewMode === 'grid' ? 'p-6' : 'p-4'}`}
                      onClick={() => handleViewVendor(vendor.id)}
                    >
                      {/* Header */}
                      <div
                        className={`flex items-start justify-between ${
                          viewMode === 'list' ? 'mb-3' : ''
                        }`}
                      >
                        <div>
                          <h3
                            className={`font-semibold text-gray-900 truncate ${
                              viewMode === 'grid'
                                ? 'text-lg mb-1'
                                : 'text-base mb-0.5'
                            }`}
                          >
                            {vendor.name}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            Contact: {vendor.write_to}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Chip
                            label={
                              vendor.w9_on_file ? 'W9 Filed' : 'W9 Pending'
                            }
                            size="small"
                            sx={{
                              ...getStatusColor(
                                vendor.w9_on_file ? 'Active' : 'Pending'
                              ),
                              fontSize: '0.75rem',
                              fontWeight: 500,
                            }}
                          />
                          <IconButton
                            size="small"
                            className="text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAnchorEl(e.currentTarget);
                              setSelectedVendor(vendor);
                            }}
                          >
                            <MoreVertical size={16} />
                          </IconButton>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div
                        className={`space-y-2 ${
                          viewMode === 'grid' ? 'mb-4' : 'mb-3'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="truncate">
                            {vendor.primary_email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{vendor.primary_phone}</span>
                        </div>
                        {viewMode === 'grid' && (
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-xs leading-relaxed">
                              {[
                                vendor.address1,
                                vendor.address2,
                                vendor.city,
                                vendor.state,
                                vendor.zip,
                                vendor.country,
                              ]
                                .filter(Boolean)
                                .join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Vendor Details */}
                      <div
                        className={`space-y-2 ${
                          viewMode === 'grid' ? 'mb-4 p-3' : 'mb-3 p-2'
                        } bg-gray-50 rounded-lg`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Tax ID:</span>
                          <span className="font-medium">{vendor.tax_id}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Account #:</span>
                          <span className="font-medium">
                            {vendor.account_number}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">1099 Track:</span>
                          <span
                            className={`font-medium ${
                              vendor.track_1099
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {vendor.track_1099 ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div
                        className={`flex items-center justify-between border-t border-gray-100 ${
                          viewMode === 'grid' ? 'pt-4' : 'pt-2'
                        }`}
                      >
                        <div className="text-xs text-gray-500">
                          Contact: {vendor.write_to}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Create Vendor Dialog */}
          </Stack>
        </div>
        <CreateVendorDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateVendor}
          isLoading={createVendorMutation.isPending}
        />
        <CreateVendorDialog
          open={editDialogOpen}
          onClose={() => {
            const params = new URLSearchParams(searchParams);
            params.delete('edit');
            navigate(`?${params.toString()}`, { replace: true });
          }}
          onSubmit={handleUpdateVendor}
          isLoading={updateVendorMutation.isPending}
          editMode={true}
          editingVendor={editingVendor}
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
              Delete Vendor
            </Typography>
            <Typography variant="body1" className="text-gray-600 mb-6">
              Are you sure you want to delete "{vendorToDelete?.name}"? This
              action cannot be undone.
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
                onClick={confirmDeleteVendor}
                disabled={deleteVendorMutation.isPending}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {deleteVendorMutation.isPending
                  ? 'Deleting...'
                  : 'Delete Vendor'}
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
            setSelectedVendor(null);
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
          <PermissionGuard permission="vendors.show">
            <MenuItem
              onClick={() => {
                if (selectedVendor) {
                  handleViewVendor(selectedVendor.id);
                  setAnchorEl(null);
                  setSelectedVendor(null);
                }
              }}
            >
              <ListItemIcon>
                <Eye size={16} />
              </ListItemIcon>
              View Vendor Details
            </MenuItem>
          </PermissionGuard>
          <PermissionGuard permission="vendors.update">
            <MenuItem
              onClick={() => {
                if (selectedVendor) {
                  handleEditVendor(selectedVendor.id);
                  setAnchorEl(null);
                  setSelectedVendor(null);
                }
              }}
            >
              <ListItemIcon>
                <Edit size={16} />
              </ListItemIcon>
              Edit Vendor
            </MenuItem>
          </PermissionGuard>
          <PermissionGuard permission="vendors.delete">
            <MenuItem
              onClick={() => {
                if (selectedVendor) {
                  handleDeleteVendor(selectedVendor);
                  setAnchorEl(null);
                  setSelectedVendor(null);
                }
              }}
              sx={{ color: '#dc2626' }}
            >
              <ListItemIcon>
                <Trash2 size={16} style={{ color: '#dc2626' }} />
              </ListItemIcon>
              Delete Vendor
            </MenuItem>
          </PermissionGuard>
        </Menu>
      </>
    </PermissionGuard>
  );
};

export default VendorsTab;
