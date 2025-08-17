import React, { useState } from 'react';
import { Stack, IconButton, Typography, Chip } from '@mui/material';
import { Search, RotateCcw, Plus, Receipt, FileText, DollarSign, Calendar, Paperclip } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExpenses, createExpense } from '@/api/api_services/finance';
import { Input } from '@/components/ui/input';
import CreateExpenseDialog from './components/CreateExpenseDialog';
import { toast } from 'sonner';

const ExpensesTab = ({ slugId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch expenses
  const { data: expensesResponse, isLoading, refetch } = useQuery({
    queryKey: ['expenses', slugId],
    queryFn: () => getExpenses(slugId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!slugId
  });

  const expenses = expensesResponse?.data || [];
  
  // Debug: Log the expenses data structure
  console.log('Expenses data:', expenses);
  console.log('First expense structure:', expenses[0]);

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

  const handleCreateExpense = (expenseData) => {
    createExpenseMutation.mutate({ ...expenseData, slugId });
  };

  const filteredExpenses = expenses.filter(expense => {
    if (!expense) return false;
    
    const searchLower = searchTerm.toLowerCase();
    
    return (
      (expense.case_name && expense.case_name.toLowerCase().includes(searchLower)) ||
      (expense.case_number && expense.case_number.toLowerCase().includes(searchLower)) ||
      (expense.description && expense.description.toLowerCase().includes(searchLower)) ||
      (expense.vendor && expense.vendor.toLowerCase().includes(searchLower)) ||
      (expense.contact_name && expense.contact_name.toLowerCase().includes(searchLower))
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
            <div className="w-full grid gap-4">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
                >
                  <div className="grid grid-cols-12 gap-6 items-start">
                    {/* Case & Category Info */}
                    <div className="col-span-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Receipt className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">
                            {expense.case_name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2">
                            {expense.case_number}
                          </p>
                          <Chip
                            label={expense.category}
                            size="small"
                            sx={{
                              bgcolor: '#f0f9ff',
                              color: '#0369a1',
                              fontSize: '0.7rem'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description & Vendor */}
                    <div className="col-span-4">
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {expense.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            Vendor: {expense.vendor}
                          </p>
                        </div>
                        <Chip
                          label={expense.cost_type}
                          size="small"
                          sx={{
                            ...getCostTypeColor(expense.cost_type),
                            fontSize: '0.7rem'
                          }}
                        />
                      </div>
                    </div>

                    {/* Amount & Status */}
                    <div className="col-span-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-bold text-green-600 text-lg">
                              {expense.amount}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {new Date(expense.date).toLocaleDateString()}
                            </span>
                          </div>
                          {expense.receipt_attached && (
                            <div className="flex items-center gap-1">
                              <Paperclip className="w-3 h-3 text-blue-500" />
                              <span className="text-xs text-blue-600">Receipt attached</span>
                            </div>
                          )}
                        </div>
                        <Chip
                          label={expense.status}
                          size="small"
                          sx={{
                            ...getStatusColor(expense.status),
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Expense Dialog */}
        <CreateExpenseDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateExpense}
          isLoading={createExpenseMutation.isPending}
        />
      </Stack>
    </div>
  );
};

export default ExpensesTab; 