import React, { useState } from 'react';
import { Stack, IconButton, Typography, Chip, Box, Menu, MenuItem, ListItemIcon, Dialog } from '@mui/material';
import { Search, RotateCcw, Plus, Receipt, FileText, DollarSign, Calendar, Paperclip, MoreVertical, Grid3X3, List, Edit, Trash2, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '@/api/api_services/finance';
import { Input } from '@/components/ui/input';
import CreateExpenseDialog from './components/CreateExpenseDialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ExpensesTab = ({ slugId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch expenses
  const { data: expensesResponse, isLoading, refetch } = useQuery({
    queryKey: ['expenses', slugId],
    queryFn: () => getExpenses(slugId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!slugId
  });

  const expenses = expensesResponse?.data || [];

  // Debug: Log the slugId to see what's being received
  console.log('ExpensesTab - slugId:', slugId);
  console.log('ExpensesTab - expenses:', expenses);

  const handleRefresh = () => {
    refetch();
  };

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: ({ slugId, ...expenseData }) => createExpense(expenseData, slugId),
    onSuccess: () => {
      toast.success('Expense created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['expenses', slugId]);
    },
    onError: (error) => {
      toast.error('Failed to create expense. Please try again.');
      console.error('Create expense error:', error);
    }
  });

  // Update expense mutation
  const updateExpenseMutation = useMutation({
    mutationFn: ({ expenseId, expenseData }) => updateExpense(expenseId, expenseData),
    onSuccess: () => {
      toast.success('Expense updated successfully!');
      setEditDialogOpen(false);
      setEditingExpense(null);
      queryClient.invalidateQueries(['expenses', slugId]);
    },
    onError: (error) => {
      toast.error('Failed to update expense. Please try again.');
      console.error('Update expense error:', error);
    }
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      toast.success('Expense deleted successfully!');
      setAnchorEl(null);
      setSelectedExpense(null);
      queryClient.invalidateQueries(['expenses', slugId]);
    },
    onError: (error) => {
      toast.error('Failed to delete expense. Please try again.');
      console.error('Delete expense error:', error);
    }
  });

  const handleCreateExpense = (expenseData) => {
    console.log('ExpensesTab - Creating expense with slugId:', slugId);
    console.log('ExpensesTab - Expense data:', expenseData);
    createExpenseMutation.mutate({ ...expenseData, slugId });
  };

  const handleUpdateExpense = (expenseData) => {
    const { id, ...updateData } = expenseData;
    updateExpenseMutation.mutate({ expenseId: id, expenseData: updateData });
  };

  const confirmDeleteExpense = (expense) => {
    setExpenseToDelete(expense);
    setDeleteConfirmOpen(true);
    setAnchorEl(null);
    setSelectedExpense(null);
  };

  const executeDeleteExpense = () => {
    if (expenseToDelete) {
      deleteExpenseMutation.mutate(expenseToDelete.id);
      setDeleteConfirmOpen(false);
      setExpenseToDelete(null);
    }
  };

  const handleExpenseClick = (expense) => {
    navigate(`/dashboard/inbox/finance/${expense.id}?slugId=${slugId}&tab=expenses`);
  };

  const filteredExpenses = expenses.filter(expense => {
    if (!expense) return false;
    
    const searchLower = searchTerm.toLowerCase();
    
    return (
      (expense.description && expense.description.toLowerCase().includes(searchLower)) ||
      (expense.invoice_number && expense.invoice_number.toLowerCase().includes(searchLower)) ||
      (expense.vendor && expense.vendor.toLowerCase().includes(searchLower)) ||
      (expense.firm && expense.firm.toLowerCase().includes(searchLower)) ||
      (expense.cost_type && expense.cost_type.toLowerCase().includes(searchLower))
    );
  });

  const getStatusColor = (status) => {
    if (!status) return { bgcolor: '#f3f4f6', color: '#374151' };
    
    switch (status) {
      case 'Paid':
        return { bgcolor: '#d1fae5', color: '#065f46' };
      case 'Pending':
        return { bgcolor: '#fef3c7', color: '#92400e' };
      case 'Overdue':
        return { bgcolor: '#fee2e2', color: '#991b1b' };
      default:
        return { bgcolor: '#f3f4f6', color: '#374151' };
    }
  };

  const getCostTypeColor = (costType) => {
    if (!costType) return { bgcolor: '#f3f4f6', color: '#374151' };
    
    if (costType.includes('Hard Cost')) {
      return { bgcolor: '#fef3c7', color: '#92400e' };
    } else if (costType.includes('Soft Cost')) {
      return { bgcolor: '#dbeafe', color: '#1e40af' };
    }
    return { bgcolor: '#f3f4f6', color: '#374151' };
  };

  // Helper function to get status based on available data
  const getExpenseStatus = (expense) => {
    // Since API doesn't provide status, we'll show a default or calculate based on other fields
    if (expense.billable_client) {
      return 'Billable';
    }
    return 'Active';
  };

  // Helper function to get display date
  const getDisplayDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  // Helper function to get created date (fallback to date_issued if created_at doesn't exist)
  const getCreatedDate = (expense) => {
    if (expense.created_at) {
      return getDisplayDate(expense.created_at);
    }
    if (expense.date_issued) {
      return getDisplayDate(expense.date_issued);
    }
    return 'N/A';
  };

  // Show message if no slugId is available
  if (!slugId) {
    return (
      <div className="p-4">
        <Stack spacing={3}>
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Receipt className="w-12 h-12 text-orange-500" />
            </div>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#374151', mb: 2 }}>
              No ID Present
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
              Please select a matter to view expenses.
            </Typography>
          </div>
        </Stack>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <h2 className="text-xl font-semibold text-gray-900">Expenses Management</h2>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search expenses..."
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
              Add Expense
            </button>
          </Stack>
        </Stack>
        
        {/* Expenses List */}
        <div className="flex items-center justify-center">
          {isLoading ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#7367F0] rounded-full animate-spin mx-auto mb-4"></div>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Loading expenses...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we fetch your expenses data
              </Typography>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Receipt className="w-12 h-12 text-orange-500" />
              </div>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#374151', mb: 2 }}>
                No expenses yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                {searchTerm ? 
                  `No expenses found matching "${searchTerm}". Try adjusting your search terms.` :
                  "Start tracking your case expenses by adding your first expense record."
                }
              </Typography>
              {!searchTerm && (
                <button 
                  onClick={() => setCreateDialogOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#7367F0] to-[#453E90] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Plus size={18} className="mr-2 inline" />
                  Add First Expense
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300 cursor-pointer"
                      onClick={() => handleExpenseClick(expense)}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-amber-100 rounded-lg flex items-center justify-center">
                            <Receipt className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                              {expense.description || 'No Description'}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {expense.invoice_number || 'No Invoice'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Chip
                            label={getExpenseStatus(expense)}
                            size="small"
                            sx={{
                              ...getStatusColor(getExpenseStatus(expense)),
                              fontSize: '0.75rem',
                              fontWeight: 500
                            }}
                          />
                          
                          {/* Three-dot menu */}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAnchorEl(e.currentTarget);
                              setSelectedExpense(expense);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <MoreVertical size={16} />
                          </IconButton>
                        </div>
                      </div>

                      {/* Description & Vendor */}
                      <div className="space-y-2 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {expense.description || 'No Description'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Vendor: {expense.vendor || 'N/A'}
                          </p>
                        </div>
                        <Chip
                          label={expense.cost_type || 'N/A'}
                          size="small"
                          sx={{
                            ...getCostTypeColor(expense.cost_type),
                            fontSize: '0.7rem'
                          }}
                        />
                      </div>

                      {/* Amount & Date */}
                      <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Amount:</span>
                          <span className="font-medium text-green-600">${expense.amount || '0'}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Date:</span>
                          <span className="font-medium">{getDisplayDate(expense.date_issued)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Firm:</span>
                          <span className="font-medium text-blue-600">{expense.firm || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          {expense.billable_client && (
                            <div className="flex items-center gap-1">
                              <span className="text-green-600">✓ Billable to Client</span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          Added {getCreatedDate(expense)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="w-full space-y-4">
                  {filteredExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300 cursor-pointer"
                      onClick={() => handleExpenseClick(expense)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-amber-100 rounded-lg flex items-center justify-center">
                            <Receipt className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                              {expense.description || 'No Description'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {expense.invoice_number || 'No Invoice'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Chip
                            label={getExpenseStatus(expense)}
                            size="small"
                            sx={{
                              ...getStatusColor(getExpenseStatus(expense)),
                              fontSize: '0.75rem',
                              fontWeight: 500
                            }}
                          />
                          
                          {/* Three-dot menu */}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAnchorEl(e.currentTarget);
                              setSelectedExpense(expense);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <MoreVertical size={16} />
                          </IconButton>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {expense.description || 'No Description'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Vendor: {expense.vendor || 'N/A'}
                            </p>
                          </div>
                          <Chip
                            label={expense.cost_type || 'N/A'}
                            size="small"
                            sx={{
                              ...getCostTypeColor(expense.cost_type),
                              fontSize: '0.7rem'
                            }}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Amount:</span>
                            <span className="font-medium text-green-600">${expense.amount || '0'}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Firm:</span>
                            <span className="font-medium text-blue-600">{expense.firm || 'N/A'}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Date:</span>
                            <span className="font-medium">{getDisplayDate(expense.date_issued)}</span>
                          </div>
                          {expense.billable_client && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-green-600">✓ Billable to Client</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Create Expense Dialog */}
        <CreateExpenseDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateExpense}
          isLoading={createExpenseMutation.isPending}
          matterId={slugId}
        />

        {/* Edit Expense Dialog */}
        <CreateExpenseDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingExpense(null);
          }}
          onSubmit={handleUpdateExpense}
          isLoading={updateExpenseMutation.isPending}
          matterId={slugId}
          editMode={true}
          editingExpense={editingExpense}
        />

        {/* Three-dot Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => {
            setAnchorEl(null);
            setSelectedExpense(null);
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
              if (selectedExpense) {
                handleExpenseClick(selectedExpense);
                setAnchorEl(null);
                setSelectedExpense(null);
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
              setEditingExpense(selectedExpense);
              setEditDialogOpen(true);
              setAnchorEl(null);
              setSelectedExpense(null);
            }}
          >
            <ListItemIcon>
              <Edit size={16} />
            </ListItemIcon>
            Edit Expense
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedExpense) {
                confirmDeleteExpense(selectedExpense);
              }
            }}
            sx={{ color: '#dc2626' }}
          >
            <ListItemIcon>
              <Trash2 size={16} style={{ color: '#dc2626' }} />
            </ListItemIcon>
            Delete Expense
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
                  Delete Expense
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete the expense for <strong>"{expenseToDelete?.description || 'Unknown'}"</strong>? 
                This will permanently remove the expense and all associated data.
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
                onClick={executeDeleteExpense}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete Expense
              </button>
            </div>
          </div>
        </Dialog>
      </Stack>
    </div>
  );
};

export default ExpensesTab; 