import React from 'react';
import { Stack, Typography, Chip, Box, IconButton, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Mail, Phone, MapPin, Edit, Trash2 } from 'lucide-react';
import { getFirm } from '@/api/api_services/finance';

const FirmDetail = ({ firmId }) => {
  const navigate = useNavigate();

  // Fetch firm details
  const { data: firmResponse, isLoading, error } = useQuery({
    queryKey: ['firm', firmId],
    queryFn: () => getFirm(firmId),
    enabled: !!firmId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const firm = firmResponse?.data;

  const handleBack = () => {
    navigate('/dashboard/inbox/finance?tab=firms');
  };

  const handleEdit = () => {
    // Navigate to edit mode or open edit dialog
    navigate(`/dashboard/inbox/finance?tab=firms&edit=${firmId}`);
  };

  const handleDelete = () => {
    // TODO: Implement delete confirmation dialog
    console.log('Delete firm:', firmId);
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
    <div className="px-4">
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
        <Box sx={{ px: 4, py: 2 }}>
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

            {/* Permissions */}
            {firm.closing_statement !== undefined && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600 }}>
                  Permissions
                </Typography>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(firm).map(([key, value]) => {
                    if (typeof value === 'boolean' && key !== 'is_active') {
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <Chip
                            label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            size="small"
                            sx={{
                              bgcolor: value ? '#dcfce7' : '#fef2f2',
                              color: value ? '#166534' : '#dc2626',
                              fontSize: '0.75rem'
                            }}
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default FirmDetail; 