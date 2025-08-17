import React, { useState } from 'react';
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
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import FileUpload from '@/components/FileUpload';
import { Plus, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getFinanceMeta } from '@/api/api_services/finance';

const CreateExpenseDialog = ({
    open,
    onClose,
    onSubmit,
    isLoading,
    matterId
}) => {
    const [attachments, setAttachments] = useState([]);
    
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            cost_type_id: '',
            vendor_id: '',
            subfirm_id: '',
            amount: '',
            billable_client: false,
            description: '',
            date_issued: '',
            invoice_number: '',
            qty: '',
            category_id: '',
            folder_id: ''
        }
    });

    // Fetch meta data
    const { data: metaData } = useQuery({
        queryKey: ['financeMeta'],
        queryFn: getFinanceMeta,
        enabled: open
    });

    const costTypes = metaData?.cost_type || [];
    const categories = metaData?.category || [];

    const onFormSubmit = (data) => {
        const formData = {
            ...data,
            attachments: attachments.filter(att => !att.isExisting) // Only send new attachments
        };
        onSubmit(formData);
    };

    const handleClose = () => {
        reset();
        setAttachments([]);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth sx={{ zIndex: 9998 }}>
            <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-3">
                    <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
                        Create New Expense
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
                                                {costTypes.map((type) => (
                                                    <SelectItem key={type.id} value={type.id.toString()}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
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
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
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
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
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
                                    Vendor ID
                                </Label>
                                <Controller
                                    control={control}
                                    name="vendor_id"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="Enter vendor ID"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    SubFirm ID
                                </Label>
                                <Controller
                                    control={control}
                                    name="subfirm_id"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="Enter subfirm ID"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
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
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
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

                        {/* Attachments */}
                        <div className="w-full">
                            <FileUpload
                                files={attachments}
                                onChange={setAttachments}
                                multiple={true}
                                disabled={isLoading}
                                accept="*/*"
                                maxSize={50 * 1024 * 1024}
                            />
                        </div>
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
                        {isLoading ? 'Creating...' : 'Create Expense'}
                    </Button>
                </div>
            </Stack>
        </Dialog>
    );
};

export default CreateExpenseDialog; 