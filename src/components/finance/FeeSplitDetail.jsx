import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Stack, IconButton, Typography, Chip, Dialog, Box } from '@mui/material';
import { 
    ArrowLeft, 
    Edit, 
    Trash2, 
    Calculator, 
    FileText, 
    DollarSign, 
    TrendingUp,
    Building,
    Calendar,
    FileText as FileTextIcon
} from 'lucide-react';
import { getFeeSplit, updateFeeSplit, deleteFeeSplit } from '@/api/api_services/finance';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useQuery as useReactQuery } from '@tanstack/react-query';
import { getFinanceMeta } from '@/api/api_services/finance';
import CreateFeeSplitDialog from './components/CreateFeeSplitDialog';

const FeeSplitDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const slugId = searchParams.get('slugId');



    // Fetch fee split details
    const { data: feeSplitResponse, isLoading, error } = useQuery({
        queryKey: ['feeSplit', id],
        queryFn: () => getFeeSplit(id),
        enabled: !!id,
    });

    const feeSplit = feeSplitResponse?.data;

    // Fetch meta data for ID-to-name mapping
    const { data: metaData } = useReactQuery({
        queryKey: ['financeMeta'],
        queryFn: getFinanceMeta,
        enabled: true
    });

    // Helper function to get name by ID from metadata
    const getNameById = (id, metadataType) => {
        if (!metaData || !metaData[metadataType]) return id || 'N/A';
        const item = metaData[metadataType].find(item => item.id === id);
        return item ? item.name : (id || 'N/A');
    };



    // Delete fee split mutation
    const deleteFeeSplitMutation = useMutation({
        mutationFn: () => deleteFeeSplit(id),
        onSuccess: () => {
            toast.success('Fee split deleted successfully!');
            navigate(`/dashboard/inbox/finance?slugId=${slugId || ''}&tab=fee-splits`);
            queryClient.invalidateQueries(['feeSplits', slugId]);
        },
        onError: (error) => {
            toast.error('Failed to delete fee split. Please try again.');
            console.error('Delete fee split error:', error);
        }
    });

    const handleBack = () => {
        navigate(`/dashboard/inbox/finance?slugId=${slugId || ''}&tab=fee-splits`);
    };

    const handleEdit = () => {
        setEditDialogOpen(true);
    };

    const handleDelete = () => {
        deleteFeeSplitMutation.mutate();
        setDeleteDialogOpen(false);
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
                        <Typography variant="h6" color="text.secondary">
                            Loading fee split details...
                        </Typography>
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
                        Failed to load fee split details. Please try again.
                    </Typography>
                </Box>
            </div>
        );
    }

    if (!feeSplit) {
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
                        Fee split not found
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
                            Fee Split Details
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
                            onClick={() => setDeleteDialogOpen(true)}
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
                                Fee Split Information
                            </Typography>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Fee Split ID
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {feeSplit.id || 'N/A'}
                                        </Typography>
                                    </div>
                                    
                                    <div>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Referral Status
                                        </Typography>
                                        <Chip
                                            label={getNameById(feeSplit.referral_status_id, 'referral_status') || 'Active'}
                                            size="small"
                                            sx={{
                                                bgcolor: getNameById(feeSplit.referral_status_id, 'referral_status') === 'Settled' ? '#dcfce7' : 
                                                         getNameById(feeSplit.referral_status_id, 'referral_status') === 'Pending' ? '#fef3c7' : '#dbeafe',
                                                color: getNameById(feeSplit.referral_status_id, 'referral_status') === 'Settled' ? '#166534' : 
                                                        getNameById(feeSplit.referral_status_id, 'referral_status') ? '#92400e' : '#1e40af',
                                                fontWeight: 500
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Override Type
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {getNameById(feeSplit.override_type_id, 'override_type') || 'N/A'}
                                        </Typography>
                                    </div>
                                    
                                    <div>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Created By
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {feeSplit.created_by || 'N/A'}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </Box>

                                                {/* Override Information */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600 }}>
                                Override Information
                            </Typography>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Override Type
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#059669' }}>
                                        {getNameById(feeSplit.override_type_id, 'override_type') || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        ID: {feeSplit.override_type_id || 'N/A'}
                                    </Typography>
                                </div>
                                
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Override Value
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2563eb' }}>
                                        {feeSplit.override || 'N/A'}
                                    </Typography>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Referral Status
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#dc2626' }}>
                                        {getNameById(feeSplit.referral_status_id, 'referral_status') || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        ID: {feeSplit.referral_status_id || 'N/A'}
                                    </Typography>
                                </div>
                            </div>
                        </Box>

                                                {/* Fee Split Details */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600 }}>
                                Fee Split Details
                            </Typography>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Building className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <Typography variant="body2" color="text.secondary">
                                                Subfirm ID
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {feeSplit.subfirm_id || 'N/A'}
                                            </Typography>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <FileTextIcon className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <Typography variant="body2" color="text.secondary">
                                                Firm Agreement
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {getNameById(feeSplit.firm_agreement_id, 'firm_agreement_in_place')}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Calculator className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <Typography variant="body2" color="text.secondary">
                                                Override Type
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {getNameById(feeSplit.override_type_id, 'override_type')}
                                            </Typography>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <Typography variant="body2" color="text.secondary">
                                                Override Value
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {feeSplit.override || 'N/A'}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Box>

                                                {/* Additional Details */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600 }}>
                                Additional Details
                            </Typography>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Subfirm ID
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {feeSplit.subfirm_id || 'N/A'}
                                        </Typography>
                                    </div>
                                    
                                    <div>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Override Type ID
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {feeSplit.override_type_id || 'N/A'} ({getNameById(feeSplit.override_type_id, 'override_type')})
                                        </Typography>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Referral Status
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {getNameById(feeSplit.referral_status_id, 'referral_status')}
                                        </Typography>
                                    </div>
                                    
                                    <div>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Firm Agreement ID
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {feeSplit.firm_agreement_id || 'N/A'} ({getNameById(feeSplit.firm_agreement_id, 'firm_agreement_in_place')})
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </Box>



                        {/* Timestamps */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600 }}>
                                Timestamps
                            </Typography>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <Typography variant="body2" color="text.secondary">
                                                Created
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {feeSplit.created_at ? new Date(feeSplit.created_at).toLocaleDateString() : 'N/A'}
                                            </Typography>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <FileTextIcon className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <Typography variant="body2" color="text.secondary">
                                                Created By
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {feeSplit.created_by || 'N/A'}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </Box>
                    </Stack>
                </Box>
            </Box>

            {/* Edit Fee Split Dialog */}
            <CreateFeeSplitDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                onSubmit={async (data) => {
                    try {
                        const result = await updateFeeSplit(id, data, slugId);
                        if (result && result.Apistatus === true) {
                            toast.success('Fee split updated successfully!');
                            setEditDialogOpen(false);
                            queryClient.invalidateQueries(['feeSplit', id]);
                            queryClient.invalidateQueries(['feeSplits', slugId]);
                        } else {
                            toast.error(result?.message || 'Failed to update fee split');
                        }
                    } catch (error) {
                        console.error('Update fee split error:', error);
                        toast.error('Failed to update fee split. Please try again.');
                    }
                }}
                isLoading={false}
                editMode={true}
                editingFeeSplit={feeSplit}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <div className="p-6">
                    <Typography variant="h6" className="font-semibold text-gray-900 mb-4">
                        Delete Fee Split
                    </Typography>
                    <Typography variant="body1" className="text-gray-600 mb-6">
                        Are you sure you want to delete this fee split? This action cannot be undone.
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
                            onClick={handleDelete}
                            disabled={deleteFeeSplitMutation.isPending}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            {deleteFeeSplitMutation.isPending ? 'Deleting...' : 'Delete Fee Split'}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default FeeSplitDetail; 