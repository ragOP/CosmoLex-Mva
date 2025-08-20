import React, { useState } from 'react';
import { Stack, Typography, Chip, Box, IconButton, Skeleton, Dialog } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Receipt, DollarSign, Calendar, FileText, Edit, Trash2, Paperclip } from 'lucide-react';
import { getExpense, deleteExpense } from '@/api/api_services/finance';
import { toast } from 'sonner';
import CreateExpenseDialog from './components/CreateExpenseDialog';
import { Button } from '@/components/ui/button';

const ExpenseDetail = ({ expenseId }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const slugId = searchParams.get('slugId');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch expense details
  const { data: expenseResponse, isLoading, error } = useQuery({
    queryKey: ['expense', expenseId],
    queryFn: () => getExpense(expenseId),
    enabled: !!expenseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const expense = expenseResponse?.data;
  
  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      toast.success('Expense deleted successfully!');
      queryClient.invalidateQueries(['expenses']);
      handleBack();
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to delete expense';
      toast.error(errorMessage);
    },
  });
  
  const handleBack = () => {
    navigate(`/dashboard/inbox/finance?slugId=${slugId}&tab=expenses`);
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteExpenseMutation.mutate(expenseId);
    setDeleteDialogOpen(false);
  };

  const handleEditSubmit = (expenseData) => {
    // Handle edit submission
    console.log('Edit expense data:', expenseData);
    // Always close the dialog regardless of validation state
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
            Error loading expense details. Please try again.
          </Typography>
        </Box>
      </div>
    );
  }

  if (!expense) {
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
            Expense not found
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
              Expense Details
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={handleEdit}
              sx={{ 
                color: '#7367F0',
                '&:hover': { 
                  bgcolor: 'rgba(115, 103, 240, 0.1)' 
                }
              }}
              title="Edit expense"
            >
              <Edit size={18} />
            </IconButton>
            <IconButton 
              onClick={handleDelete}
              sx={{ 
                color: '#dc2626',
                '&:hover': { 
                  bgcolor: 'rgba(220, 38, 38, 0.1)' 
                }
              }}
                            title="Delete expense"
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
            {/* Case Information */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600 }}>
                Expense Information
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {expense.description || 'N/A'}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Invoice Number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {expense.invoice_number || 'N/A'}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Status
                    </Typography>
                    <Chip
                      label={expense.billable_client ? 'Billable' : 'Non-Billable'}
                      size="small"
                      sx={{
                        bgcolor: expense.billable_client ? '#dcfce7' : '#fef2f2',
                        color: expense.billable_client ? '#166534' : '#dc2626',
                        fontWeight: 500
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Cost Type
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#2563eb' }}>
                      {expense.cost_type || 'N/A'}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Vendor
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#059669' }}>
                      {expense.vendor || 'N/A'}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Firm
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#7c3aed' }}>
                      {expense.firm || 'N/A'}
                    </Typography>
                  </div>
                </div>
              </div>
            </Box>

            {/* Financial Information */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600 }}>
                Financial Information
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <Typography variant="body2" color="text.secondary">
                        Amount
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#059669' }}>
                        ${expense.amount || '0'}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <Typography variant="body2" color="text.secondary">
                        Invoice Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {expense.invoice_number || 'N/A'}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Receipt className="w-5 h-5 text-gray-400" />
                    <div>
                      <Typography variant="body2" color="text.secondary">
                        Quantity
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {expense.qty || '1'}
                      </Typography>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <Typography variant="body2" color="text.secondary">
                        Date Issued
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {expense.date_issued ? new Date(expense.date_issued).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </div>
                  </div>
                  
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Vendor ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {expense.vendor_id || 'N/A'}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Firm ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {expense.subfirm_id || 'N/A'}
                    </Typography>
                  </div>
                </div>
              </div>
            </Box>

            {/* Description */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600 }}>
                Description
              </Typography>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  {expense.description || 'No description provided'}
                </Typography>
              </div>
            </Box>

            {/* Additional Information */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600 }}>
                Additional Information
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Quantity
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {expense.qty || '1'}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Total Amount
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#059669' }}>
                      ${expense.total || expense.amount || '0'}
                    </Typography>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Billable to Client
                    </Typography>
                    <Chip
                      label={expense.billable_client ? 'Yes' : 'No'}
                      size="small"
                      sx={{
                        bgcolor: expense.billable_client ? '#dcfce7' : '#fef2f2',
                        color: expense.billable_client ? '#166534' : '#dc2626',
                        fontWeight: 500
                      }}
                    />
                  </div>
                  
                  {expense.file_name && (
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-5 h-5 text-blue-500" />
                      <Typography variant="body2" sx={{ color: '#2563eb', fontWeight: 500 }}>
                        File: {expense.file_name}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Edit Expense Dialog */}
      <CreateExpenseDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleEditSubmit}
        isLoading={false}
        editMode={true}
        editingExpense={expense}
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
            Delete Expense
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Are you sure you want to delete "{expense?.description || expense?.invoice_number}"? This action cannot be undone.
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
              disabled={deleteExpenseMutation.isPending}
            >
              {deleteExpenseMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default ExpenseDetail; 