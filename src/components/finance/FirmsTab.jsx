import React, { useState } from 'react';
import { Stack, IconButton, Typography, Chip, Box, Menu, MenuItem, ListItemIcon, Dialog } from '@mui/material';
import { Search, RotateCcw, Plus, Building, Mail, Phone, MapPin, MoreVertical, Grid3X3, List, Edit, Trash2, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFirms, createFirm, updateFirm, deleteFirm } from '@/api/api_services/finance';
import { Input } from '@/components/ui/input';
import CreateFirmDialog from './components/CreateFirmDialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const FirmsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingFirm, setEditingFirm] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [firmToDelete, setFirmToDelete] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch firms
  const { data: firmsResponse, isLoading, refetch } = useQuery({
    queryKey: ['firms'],
    queryFn: getFirms,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const firms = firmsResponse?.data || [];

  const handleRefresh = () => {
    refetch();
  };

  // Create firm mutation
  const createFirmMutation = useMutation({
    mutationFn: createFirm,
    onSuccess: () => {
      toast.success('Firm created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['firms']);
    },
    onError: (error) => {
      toast.error('Failed to create firm. Please try again.');
      console.error('Create firm error:', error);
    }
  });

  // Update firm mutation
  const updateFirmMutation = useMutation({
    mutationFn: ({ firmId, firmData }) => updateFirm(firmId, firmData),
    onSuccess: () => {
      toast.success('Firm updated successfully!');
      setEditDialogOpen(false);
      setEditingFirm(null);
      queryClient.invalidateQueries(['firms']);
    },
    onError: (error) => {
      toast.error('Failed to update firm. Please try again.');
      console.error('Update firm error:', error);
    }
  });

  // Delete firm mutation
  const deleteFirmMutation = useMutation({
    mutationFn: deleteFirm,
    onSuccess: () => {
      toast.success('Firm deleted successfully!');
      setAnchorEl(null);
      setSelectedFirm(null);
      queryClient.invalidateQueries(['firms']);
    },
    onError: (error) => {
      toast.error('Failed to delete firm. Please try again.');
      console.error('Delete firm error:', error);
    }
  });

  const handleCreateFirm = (firmData) => {
    createFirmMutation.mutate(firmData);
  };

  const handleUpdateFirm = (firmData) => {
    const { id, ...updateData } = firmData;
    updateFirmMutation.mutate({ firmId: id, firmData: updateData });
  };

  const confirmDeleteFirm = (firm) => {
    setFirmToDelete(firm);
    setDeleteConfirmOpen(true);
    setAnchorEl(null);
    setSelectedFirm(null);
  };

  const executeDeleteFirm = () => {
    if (firmToDelete) {
      deleteFirmMutation.mutate(firmToDelete.id);
      setDeleteConfirmOpen(false);
      setFirmToDelete(null);
    }
  };

  const handleFirmClick = (firm) => {
    navigate(`/dashboard/inbox/finance/${firm.id}?slug=${firm.id}&tab=firms`);
  };

  const filteredFirms = firms.filter(firm => 
    firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (firm.firm_type_id && firm.firm_type_id.toString().includes(searchTerm.toLowerCase())) ||
    firm.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
      case 'Active':
        return { bgcolor: '#d1fae5', color: '#065f46' };
      case 'Pending':
        return { bgcolor: '#fef3c7', color: '#92400e' };
      case 'Declined':
        return { bgcolor: '#fee2e2', color: '#991b1b' };
      default:
        return { bgcolor: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div className="p-4">
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <h2 className="text-xl font-semibold text-gray-900">Firms Management</h2>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search firms..."
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
            
            <button 
              onClick={() => setCreateDialogOpen(true)}
              className="px-4 py-2 bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Firm
            </button>
          </Stack>
        </Stack>
        
        {/* Firms List */}
        <div className="flex items-center justify-center">
          {isLoading ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#7367F0] rounded-full animate-spin mx-auto mb-4"></div>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Loading firms...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we fetch your firms data
              </Typography>
            </div>
          ) : filteredFirms.length === 0 ? (
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="w-12 h-12 text-blue-500" />
              </div>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#374151', mb: 2 }}>
                No firms yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                {searchTerm ? 
                  `No firms found matching "${searchTerm}". Try adjusting your search terms.` :
                  "Start managing your firm relationships by adding your first firm partner or vendor."
                }
              </Typography>
              {!searchTerm && (
                                 <button 
                   onClick={() => setCreateDialogOpen(true)}
                   className="px-6 py-3 bg-gradient-to-r from-[#7367F0] to-[#453E90] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                 >
                   <Plus size={18} className="mr-2 inline" />
                   Add First Firm
                 </button>
              )}
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredFirms.map((firm) => (
                <div
                  key={firm.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300 cursor-pointer"
                  onClick={() => handleFirmClick(firm)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-blue-600" />
                      </div>
                                             <div>
                         <h3 className="font-semibold text-gray-900 text-sm mb-1">
                           {firm.name}
                         </h3>
                         <p className="text-xs text-gray-500">
                           Firm Type ID: {firm.firm_type_id}
                         </p>
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                       <Chip
                         label={firm.is_active ? 'Active' : 'Inactive'}
                         size="small"
                         sx={{
                           ...getStatusColor(firm.is_active ? 'Active' : 'Inactive'),
                           fontSize: '0.75rem',
                           fontWeight: 500
                         }}
                       />
                       
                       {/* Three-dot menu */}
                       <IconButton
                         size="small"
                         onClick={(e) => {
                           setAnchorEl(e.currentTarget);
                           setSelectedFirm(firm);
                         }}
                         className="text-gray-400 hover:text-gray-600"
                       >
                         <MoreVertical size={16} />
                       </IconButton>
                     </div>
                  </div>

                                     {/* Contact Info */}
                   <div className="space-y-2 mb-4">
                     <div className="flex items-center gap-2 text-sm text-gray-600">
                       <Mail className="w-4 h-4 text-gray-400" />
                       <span className="truncate">{firm.email}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-gray-600">
                       <Phone className="w-4 h-4 text-gray-400" />
                       <span>{firm.phone}</span>
                     </div>
                     <div className="flex items-start gap-2 text-sm text-gray-600">
                       <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                       <span className="text-xs leading-relaxed">
                         {[firm.address1, firm.address2, firm.city, firm.state, firm.zip_code]
                           .filter(Boolean)
                           .join(', ')}
                       </span>
                     </div>
                   </div>

                   {/* Additional Info */}
                   <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                     <div className="flex items-center justify-between text-xs">
                       <span className="text-gray-500">EIN:</span>
                       <span className="font-medium">{firm.ein}</span>
                     </div>
                     <div className="flex items-center justify-between text-xs">
                       <span className="text-gray-500">Firm %:</span>
                       <span className="font-medium text-green-600">{firm.firm_percent}</span>
                     </div>
                     <div className="flex items-center justify-between text-xs">
                       <span className="text-gray-500">Flat Fee:</span>
                       <span className="font-medium text-blue-600">${firm.firm_flat_fee}</span>
                     </div>
                   </div>

                   {/* Footer */}
                   <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                     <div className="text-xs text-gray-500">
                       Contact: {firm.contact_name}
                     </div>
                     <div className="text-xs text-gray-400">
                       Added {new Date(firm.created_at).toLocaleDateString()}
                     </div>
                   </div>
                </div>
              ))}
            </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="w-full space-y-4">
                  {filteredFirms.map((firm) => (
                    <div
                      key={firm.id}
                      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300 cursor-pointer"
                      onClick={() => handleFirmClick(firm)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                              {firm.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Firm Type ID: {firm.firm_type_id}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Chip
                            label={firm.is_active ? 'Active' : 'Inactive'}
                            size="small"
                            sx={{
                              ...getStatusColor(firm.is_active ? 'Active' : 'Inactive'),
                              fontSize: '0.75rem',
                              fontWeight: 500
                            }}
                          />
                          
                          {/* Three-dot menu */}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              setAnchorEl(e.currentTarget);
                              setSelectedFirm(firm);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <MoreVertical size={16} />
                          </IconButton>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{firm.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{firm.phone}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">EIN:</span>
                            <span className="font-medium">{firm.ein}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Firm %:</span>
                            <span className="font-medium text-green-600">{firm.firm_percent}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Flat Fee:</span>
                            <span className="font-medium text-blue-600">${firm.firm_flat_fee}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Contact:</span>
                            <span className="font-medium">{firm.contact_name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Create Firm Dialog */}
        <CreateFirmDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateFirm}
          isLoading={createFirmMutation.isPending}
        />

        {/* Edit Firm Dialog */}
        <CreateFirmDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingFirm(null);
          }}
          onSubmit={handleUpdateFirm}
          isLoading={updateFirmMutation.isPending}
          editMode={true}
          editingFirm={editingFirm}
        />

        {/* Three-dot Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => {
            setAnchorEl(null);
            setSelectedFirm(null);
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
          <MenuItem
            onClick={() => {
              if (selectedFirm) {
                handleFirmClick(selectedFirm);
                setAnchorEl(null);
                setSelectedFirm(null);
              }
            }}
          >
            <ListItemIcon>
              <Eye size={16} />
            </ListItemIcon>
            View Details
          </MenuItem>
          <MenuItem
            onClick={() => {
              setEditingFirm(selectedFirm);
              setEditDialogOpen(true);
              setAnchorEl(null);
              setSelectedFirm(null);
            }}
          >
            <ListItemIcon>
              <Edit size={16} />
            </ListItemIcon>
            Edit Firm
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedFirm) {
                confirmDeleteFirm(selectedFirm);
              }
            }}
            sx={{ color: '#dc2626' }}
          >
            <ListItemIcon>
              <Trash2 size={16} style={{ color: '#dc2626' }} />
            </ListItemIcon>
            Delete Firm
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              overflow: 'hidden'
            }
          }}
        >
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Firm
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete <strong>"{firmToDelete?.name}"</strong>? 
                This will permanently remove the firm and all associated data.
              </p>
            </div>
            
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteFirm}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete Firm
              </button>
            </div>
          </div>
        </Dialog>
      </Stack>
    </div>
  );
};

export default FirmsTab; 