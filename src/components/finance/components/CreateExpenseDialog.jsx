import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Dialog,
    Stack,
    Divider,
    IconButton,
} from '@mui/material';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getFinanceMeta, getVendors, getFirms } from '@/api/api_services/finance';

const CreateExpenseDialog = ({
    open,
    onClose,
    onSubmit,
    isLoading,
    editMode = false,
    editingExpense = null
}) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm({
        defaultValues: {
            cost_type_id: '',
            vendor_id: '',
            subfirm_id: '',
            amount: '',
            billable_client: false,
            is_taxable: false,
            description: '',
            date_issued: '',
            invoice_number: '',
            qty: '',
            category_id: '',
            folder_id: ''
        }
    });

    // Search states for dropdowns
    const [costTypeSearch, setCostTypeSearch] = React.useState('');
    const [vendorSearch, setVendorSearch] = React.useState('');
    const [firmSearch, setFirmSearch] = React.useState('');
    const [categorySearch, setCategorySearch] = React.useState('');

    // Fetch meta data
    const { data: metaData } = useQuery({
        queryKey: ['financeMeta'],
        queryFn: getFinanceMeta,
        enabled: open
    });

    // Fetch vendors for dropdown
    const { data: vendorsResponse } = useQuery({
        queryKey: ['vendors'],
        queryFn: getVendors,
        enabled: open
    });

    // Fetch firms for dropdown
    const { data: firmsResponse } = useQuery({
        queryKey: ['firms'],
        queryFn: getFirms,
        enabled: open
    });

    const costTypes = metaData?.cost_type || [];
    const categories = metaData?.category || [];
    const vendors = vendorsResponse?.data || [];
    const firms = Array.isArray(firmsResponse?.data) ? firmsResponse.data : [];

    // Filtered data based on search terms
    const filteredCostTypes = costTypes.filter(type =>
        type.name?.toLowerCase().includes(costTypeSearch.toLowerCase())
    );
    const filteredVendors = vendors.filter(vendor =>
        vendor.name?.toLowerCase().includes(vendorSearch.toLowerCase())
    );
    const filteredFirms = firms.filter(firm =>
        firm.name?.toLowerCase().includes(firmSearch.toLowerCase())
    );
    const filteredCategories = categories.filter(category =>
        category.name?.toLowerCase().includes(categorySearch.toLowerCase())
    );

    // Set form values when editing
    useEffect(() => {
        if (editMode && editingExpense) {
            setValue('cost_type_id', editingExpense.cost_type_id?.toString() || '');
            setValue('vendor_id', editingExpense.vendor_id?.toString() || '');
            setValue('subfirm_id', editingExpense.subfirm_id?.toString() || '');
            setValue('amount', editingExpense.amount || '');
            setValue('billable_client', editingExpense.billable_client || false);
            setValue('is_taxable', editingExpense.is_taxable || false);
            setValue('description', editingExpense.description || '');
            setValue('date_issued', editingExpense.date_issued || '');
            setValue('invoice_number', editingExpense.invoice_number || '');
            setValue('qty', editingExpense.qty || '');
            setValue('category_id', editingExpense.category_id?.toString() || '');
            setValue('folder_id', editingExpense.folder_id?.toString() || '');
        }
    }, [editMode, editingExpense, setValue]);

    const onFormSubmit = (data) => {
        // Add ID if editing
        const submitData = editMode ? { ...data, id: editingExpense.id } : data;
        onSubmit(submitData);
    };

    const resetSearchTerms = () => {
        setCostTypeSearch('');
        setVendorSearch('');
        setFirmSearch('');
        setCategorySearch('');
    };

    const handleClose = () => {
        reset();
        resetSearchTerms();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth sx={{ zIndex: 9998 }}>
            <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-3">
                    <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
                        {editMode ? 'Edit Expense' : 'Create New Expense'}
                    </h1>
                    <IconButton onClick={handleClose}>
                        <X className="text-black" />
                    </IconButton>
                </div>

                <Divider />

                {/* Scrollable Content Area */}
                <div className="space-y-6 flex-1 overflow-auto p-6">
                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" noValidate>
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Cost Type */}
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Cost Type *
                                </Label>
                                <Controller
                                    control={control}
                                    name="cost_type_id"
                                    rules={{ required: 'Cost type is required' }}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ''}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className={`h-12 w-full ${errors.cost_type_id ? 'border-red-500' : 'border-gray-300'}`}>
                                                <SelectValue placeholder="Select Cost Type" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[9999]">
                                                {/* Search Input */}
                                                <div className="p-2 border-b border-gray-200">
                                                    <div className="relative">
                                                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                                                        <Input
                                                            placeholder="Search cost types..."
                                                            value={costTypeSearch}
                                                            onChange={(e) => setCostTypeSearch(e.target.value)}
                                                            className="pl-6 h-8 text-sm border-0 focus:ring-0 focus:border-0"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                {/* Cost Type List */}
                                                {filteredCostTypes.length === 0 ? (
                                                    <div className="p-2 text-sm text-gray-500 text-center">
                                                        No cost types found
                                                    </div>
                                                ) : (
                                                    filteredCostTypes.map((type) => (
                                                        <SelectItem key={type.id} value={type.id.toString()}>
                                                            {type.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.cost_type_id && (
                                    <p className="text-xs text-red-500 mt-1">{errors.cost_type_id.message}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Category *
                                </Label>
                                <Controller
                                    control={control}
                                    name="category_id"
                                    rules={{ required: 'Category is required' }}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ''}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className={`h-12 w-full ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[9999]">
                                                {/* Search Input */}
                                                <div className="p-2 border-b border-gray-200">
                                                    <div className="relative">
                                                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                                                        <Input
                                                            placeholder="Search categories..."
                                                            value={categorySearch}
                                                            onChange={(e) => setCategorySearch(e.target.value)}
                                                            className="pl-6 h-8 text-sm border-0 focus:ring-0 focus:border-0"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                {/* Category List */}
                                                {filteredCategories.length === 0 ? (
                                                    <div className="p-2 text-sm text-gray-500 text-center">
                                                        No categories found
                                                    </div>
                                                ) : (
                                                    filteredCategories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id.toString()}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.category_id && (
                                    <p className="text-xs text-red-500 mt-1">{errors.category_id.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Financial Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Amount *
                                </Label>
                                <Controller
                                    control={control}
                                    name="amount"
                                    rules={{ required: 'Amount is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            step="0.01"
                                            placeholder="Enter amount"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.amount && (
                                    <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
                                )}
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Quantity
                                </Label>
                                <Controller
                                    control={control}
                                    name="qty"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="Enter quantity"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.qty ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.qty && (
                                    <p className="text-xs text-red-500 mt-1">{errors.qty.message}</p>
                                )}
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Date Issued *
                                </Label>
                                <Controller
                                    control={control}
                                    name="date_issued"
                                    rules={{ required: 'Date is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="date"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.date_issued ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.date_issued && (
                                    <p className="text-xs text-red-500 mt-1">{errors.date_issued.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Vendor
                                </Label>
                                <Controller
                                    control={control}
                                    name="vendor_id"
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ''}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className={`h-12 w-full ${errors.vendor_id ? 'border-red-500' : 'border-gray-300'}`}>
                                                <SelectValue placeholder="Select Vendor" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[9999]">
                                                {/* Search Input */}
                                                <div className="p-2 border-b border-gray-200">
                                                    <div className="relative">
                                                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                                                        <Input
                                                            placeholder="Search vendors..."
                                                            value={vendorSearch}
                                                            onChange={(e) => setVendorSearch(e.target.value)}
                                                            className="pl-6 h-8 text-sm border-0 focus:ring-0 focus:border-0"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                {/* Vendor List */}
                                                {filteredVendors.length === 0 ? (
                                                    <div className="p-2 text-sm text-gray-500 text-center">
                                                        No vendors found
                                                    </div>
                                                ) : (
                                                    filteredVendors.map((vendor) => (
                                                        <SelectItem key={vendor.id} value={vendor.id.toString()}>
                                                            {vendor.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.vendor_id && (
                                    <p className="text-xs text-red-500 mt-1">{errors.vendor_id.message}</p>
                                )}
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Firm 
                                </Label>
                                <Controller
                                    control={control}
                                    name="subfirm_id"
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ''}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className={`h-12 w-full ${errors.subfirm_id ? 'border-red-500' : 'border-gray-300'}`}>
                                                <SelectValue placeholder="Select Firm" />
                                            </SelectTrigger>
                                                                                    <SelectContent className="z-[9999]">
                                                {/* Search Input */}
                                                <div className="p-2 border-b border-gray-200">
                                                    <div className="relative">
                                                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                                                        <Input
                                                            placeholder="Search firms..."
                                                            value={firmSearch}
                                                            onChange={(e) => setFirmSearch(e.target.value)}
                                                            className="pl-6 h-8 text-sm border-0 focus:ring-0 focus:border-0"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                {/* Firm List */}
                                                {filteredFirms.length === 0 ? (
                                                    <div className="p-2 text-sm text-gray-500 text-center">
                                                        No firms found
                                                    </div>
                                                ) : (
                                                    filteredFirms.map((firm) => (
                                                        <SelectItem key={firm.id} value={firm.id.toString()}>
                                                            {firm.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.subfirm_id && (
                                    <p className="text-xs text-red-500 mt-1">{errors.subfirm_id.message}</p>
                                )}
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Invoice Number
                                </Label>
                                <Controller
                                    control={control}
                                    name="invoice_number"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter invoice number"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.invoice_number ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.invoice_number && (
                                    <p className="text-xs text-red-500 mt-1">{errors.invoice_number.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="w-full">
                            <Label className="text-[#40444D] font-semibold mb-2 block">
                                Description *
                            </Label>
                            <Controller
                                control={control}
                                name="description"
                                rules={{ required: 'Description is required' }}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        placeholder="Enter expense description"
                                        disabled={isLoading}
                                        className={`h-24 resize-none px-4 rounded-md border shadow-[0px_4px_4px_0px_#0000000D] bg-white text-sm placeholder:text-[#667085] py-1 w-full ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                )}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Billable to Client */}
                        <div className="flex items-center space-x-2">
                            <Controller
                                control={control}
                                name="billable_client"
                                render={({ field }) => (
                                    <Checkbox
                                        id="billable_client"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                            <Label htmlFor="billable_client" className="text-sm text-gray-700">
                                Billable to Client
                            </Label>
                        </div>

                        {/* Taxable */}
                        <div className="flex items-center space-x-2">
                            <Controller
                                control={control}
                                name="is_taxable"
                                render={({ field }) => (
                                    <Checkbox
                                        id="is_taxable"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                            <Label htmlFor="is_taxable" className="text-sm text-gray-700">
                                Taxable
                            </Label>
                        </div>

                        {/* Calculated Amount Display */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="text-sm font-semibold text-[#40444D] mb-3">Amount Summary</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Base Amount:</span>
                                    <span className="font-medium">
                                        ${watch('amount') || '0.00'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Quantity:</span>
                                    <span className="font-medium">
                                        {watch('qty') || '1'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium">
                                        ${((parseFloat(watch('amount') || 0) * parseFloat(watch('qty') || 1)).toFixed(2))}
                                    </span>
                                </div>
                                {watch('is_taxable') && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">GST (18%):</span>
                                        <span className="font-medium text-green-600">
                                            ${((parseFloat(watch('amount') || 0) * parseFloat(watch('qty') || 1) * 0.18)).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="border-t border-gray-200 pt-2">
                                    <div className="flex justify-between">
                                        <span className="text-[#40444D] font-semibold">Total Amount:</span>
                                        <span className="text-[#40444D] font-bold text-lg">
                                            ${(() => {
                                                const amount = parseFloat(watch('amount') || 0);
                                                const qty = parseFloat(watch('qty') || 1);
                                                const subtotal = amount * qty;
                                                return watch('is_taxable') 
                                                    ? (subtotal * 1.18).toFixed(2)
                                                    : subtotal.toFixed(2);
                                            })()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Folder ID */}
                        {/* <div className="w-full">
                            <Label className="text-[#40444D] font-semibold mb-2 block">
                                Folder ID
                            </Label>
                            <Controller
                                control={control}
                                name="folder_id"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Enter folder ID"
                                        disabled={isLoading}
                                        className="h-12 w-full border-gray-300"
                                    />
                                )}
                            />
                        </div> */}
                    </form>
                </div>

                <Divider />

                {/* Footer */}
                <div className="flex items-center justify-end px-6 py-4 gap-4">
                    <Button
                        type="button"
                        className="bg-gray-300 text-black hover:bg-gray-400"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit(onFormSubmit)}
                        disabled={isLoading}
                        className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
                    >
                        {isLoading ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Expense' : 'Create Expense')}
                    </Button>
                </div>
            </Stack>
        </Dialog>
    );
};

export default CreateExpenseDialog; 