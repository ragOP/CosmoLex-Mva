import React, { useState } from 'react';
import { Stack, Typography, Chip, Box, IconButton, Skeleton, Dialog } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Building, Mail, Phone, MapPin, Edit, Trash2 } from 'lucide-react';
import { getFirm, deleteFirm } from '@/api/api_services/finance';
import { toast } from 'sonner';
import CreateFirmDialog from './components/CreateFirmDialog';
import { Button } from '@/components/ui/button';

const FirmDetail = ({ firmId }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const slugId = searchParams.get('slugId');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch firm details
  const { data: firmResponse, isLoading, error } = useQuery({
    queryKey: ['firm', firmId],
    queryFn: () => getFirm(firmId),
    enabled: !!firmId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const firm = firmResponse?.data;
  
  // Debug: Log firm data to see what permissions are available
  console.log('Firm data:', firm);
  console.log('Boolean permissions:', Object.entries(firm || {}).filter(([key, value]) => typeof value === 'boolean' && key !== 'is_active'));

  // Delete firm mutation
  const deleteFirmMutation = useMutation({
    mutationFn: deleteFirm,
    onSuccess: () => {
      toast.success('Firm deleted successfully!');
      queryClient.invalidateQueries(['firms']);
      handleBack();
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to delete firm';
      toast.error(errorMessage);
    },
  });

  const handleBack = () => {
    navigate(`/dashboard/inbox/finance?slugId=${slugId}&tab=firms`);
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteFirmMutation.mutate(firmId);
    setDeleteDialogOpen(false);
  };

  const handleEditSubmit = (firmData) => {
    // Handle edit submission
    console.log('Edit firm data:', firmData);
    setEditDialogOpen(false);
    // TODO: Implement update mutation
  };

  if (isLoading) {
    return (
      <div className="px-4">
        <Box sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.5)', 
          backdropFilter: 'blur(8px)',
          borderRadius: 3, 
          boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          p: 4
        }}>
          <Stack spacing={3}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="70%" />
          </Stack>
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4">
        <Box sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.5)', 
          backdropFilter: 'blur(8px)',
          borderRadius: 3, 
          boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          p: 4
        }}>
          <Typography variant="h6" color="error" align="center">
            Error loading firm details. Please try again.
          </Typography>
        </Box>
      </div>
    );
  }

  if (!firm) {
    return (
      <div className="px-4">
        <Box sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.5)', 
          backdropFilter: 'blur(8px)',
          borderRadius: 3, 
          boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          p: 4
        }}>
          <Typography variant="h6" color="text.secondary" align="center">
            Firm not found
          </Typography>
        </Box>
      </div>
    );
  }

  return (
    <div className="px-2">
      <Box sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.5)', 
        backdropFilter: 'blur(8px)',
        borderRadius: 3, 
        boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{ 
          px: 3, 
          py: 2,
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handleBack} size="small">
              <ArrowLeft size={20} />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#374151' }}>
              Firm Details
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={handleEdit}
              sx={{ 
                color: '#7367F0',
                '&:hover': { bgcolor: 'rgba(115, 103, 240, 0.1)' }
              }}
            >
              <Edit size={18} />
            </IconButton>
            <IconButton 
              onClick={handleDelete}
              sx={{ 
                color: '#dc2626',
                '&:hover': { bgcolor: 'rgba(220, 38, 38, 0.1)' }
              }}
            >
              <Trash2 size={18} />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ 
          px: 4, 
          py: 2, 
          maxHeight: '70vh', 
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f5f9',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: '4px',
            '&:hover': {
              background: '#94a3b8',
            },
          },
        }}>
          <Stack spacing={4}>
            {/* Basic Information */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600 }}>
                Basic Information
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Firm Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {firm.name || 'N/A'}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Firm Type
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {firm.firm_type_id || 'N/A'}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Status
                    </Typography>
                    <Chip
                      label={firm.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        bgcolor: firm.is_active ? '#dcfce7' : '#fef2f2',
                        color: firm.is_active ? '#166534' : '#dc2626',
                        fontWeight: 500
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      EIN
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {firm.ein || 'N/A'}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Firm Percentage
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#059669' }}>
                      {firm.firm_percent || 'N/A'}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Flat Fee
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#2563eb' }}>
                      ${firm.firm_flat_fee || '0'}
                    </Typography>
                  </div>
                </div>
              </div>
            </Box>

            {/* Contact Information */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600 }}>
                Contact Information
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {firm.email || 'N/A'}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <Typography variant="body2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {firm.phone || 'N/A'}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <Typography variant="body2" color="text.secondary">
                        Contact Person
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {firm.contact_name || 'N/A'}
                      </Typography>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Address
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
                        {[
                          firm.address1,
                          firm.address2,
                          firm.city,
                          firm.state,
                          firm.zip_code
                        ].filter(Boolean).join(', ') || 'N/A'}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </Box>

            {/* Permissions - Always show this section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600 }}>
                  Permissions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Object.entries(firm || {}).filter(([key, value]) => typeof value === 'boolean' && key !== 'is_active').length} permissions
                </Typography>
              </Box>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(firm || {}).map(([key, value]) => {
                  if (typeof value === 'boolean' && key !== 'is_active') {
                    return (
                      <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Chip
                          label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          size="small"
                          sx={{
                            bgcolor: value ? '#dcfce7' : '#fef2f2',
                            color: value ? '#166534' : '#dc2626',
                            fontSize: '0.75rem',
                            maxWidth: '100%',
                            fontWeight: 500,
                            '& .MuiChip-label': {
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {value ? '✓' : '✗'}
                        </Typography>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              
              {/* Show message if no permissions found */}
              {Object.entries(firm).filter(([key, value]) => typeof value === 'boolean' && key !== 'is_active').length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No permission data available
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Edit Firm Dialog */}
      <CreateFirmDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleEditSubmit}
        isLoading={false}
        editMode={true}
        editingFirm={firm}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Delete Firm
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Are you sure you want to delete "{firm?.name}"? This action cannot be undone.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteFirmMutation.isPending}
            >
              {deleteFirmMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default FirmDetail; 