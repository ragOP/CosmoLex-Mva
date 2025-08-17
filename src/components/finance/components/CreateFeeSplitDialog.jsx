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

const CreateFeeSplitDialog = ({
    open,
    onClose,
    onSubmit,
    isLoading
}) => {
    const [attachments, setAttachments] = useState([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            case_name: '',
            case_number: '',
            firm_id: '',
            split_type: '',
            our_percentage: '',
            their_percentage: '',
            total_settlement: '',
            our_share: '',
            their_share: '',
            settlement_date: '',
            payment_terms: '',
            notes: '',
            is_active: true,
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
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth PaperProps={{
            sx: {
                borderRadius: '16px',
                overflow: 'hidden'
            }
        }}>
            <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] shadow-[0px_4px_24px_0px_#000000]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-3">
                    <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
                        Create New Fee Split
                    </h1>
                    <IconButton onClick={handleClose}>
                        <X className="text-black" />
                    </IconButton>
                </div>

                <Divider />

                {/* Scrollable Content Area */}
                <div className="space-y-6 flex-1 overflow-auto p-6">
                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" noValidate>
                        {/* Case Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Case Name */}
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Case Name *
                                </Label>
                                <Controller
                                    control={control}
                                    name="case_name"
                                    rules={{ required: 'Case name is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter case name"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.case_name ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.case_name && (
                                    <p className="text-xs text-red-500 mt-1">{errors.case_name.message}</p>
                                )}
                            </div>

                            {/* Case Number */}
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Case Number *
                                </Label>
                                <Controller
                                    control={control}
                                    name="case_number"
                                    rules={{ required: 'Case number is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter case number"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.case_number ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.case_number && (
                                    <p className="text-xs text-red-500 mt-1">{errors.case_number.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Partner Firm Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Partner Firm ID
                                </Label>
                                <Controller
                                    control={control}
                                    name="firm_id"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter partner firm ID"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Split Type *
                                </Label>
                                <Controller
                                    control={control}
                                    name="split_type"
                                    rules={{ required: 'Split type is required' }}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ''}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className={`h-12 w-full ${errors.split_type ? 'border-red-500' : 'border-gray-300'}`}>
                                                <SelectValue placeholder="Select Split Type" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[9999]">
                                                <SelectItem value="Fee Share %">Fee Share %</SelectItem>
                                                <SelectItem value="Firm Flat Fee %">Firm Flat Fee %</SelectItem>
                                                <SelectItem value="Referral Fee">Referral Fee</SelectItem>
                                                <SelectItem value="Co-Counsel">Co-Counsel</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.split_type && (
                                    <p className="text-xs text-red-500 mt-1">{errors.split_type.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Split Percentages */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Our Percentage *
                                </Label>
                                <Controller
                                    control={control}
                                    name="our_percentage"
                                    rules={{ required: 'Our percentage is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="e.g., 60%"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.our_percentage ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.our_percentage && (
                                    <p className="text-xs text-red-500 mt-1">{errors.our_percentage.message}</p>
                                )}
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Their Percentage *
                                </Label>
                                <Controller
                                    control={control}
                                    name="their_percentage"
                                    rules={{ required: 'Their percentage is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="e.g., 40%"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.their_percentage ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.their_percentage && (
                                    <p className="text-xs text-red-500 mt-1">{errors.their_percentage.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Financial Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Total Settlement *
                                </Label>
                                <Controller
                                    control={control}
                                    name="total_settlement"
                                    rules={{ required: 'Total settlement is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="e.g., $250,000.00"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.total_settlement ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.total_settlement && (
                                    <p className="text-xs text-red-500 mt-1">{errors.total_settlement.message}</p>
                                )}
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Our Share
                                </Label>
                                <Controller
                                    control={control}
                                    name="our_share"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="e.g., $150,000.00"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Their Share
                                </Label>
                                <Controller
                                    control={control}
                                    name="their_share"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="e.g., $100,000.00"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Date and Terms */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Settlement Date
                                </Label>
                                <Controller
                                    control={control}
                                    name="settlement_date"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="date"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Payment Terms
                                </Label>
                                <Controller
                                    control={control}
                                    name="payment_terms"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="e.g., Net 30 days"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="w-full">
                            <Label className="text-[#40444D] font-semibold mb-2 block">
                                Category
                            </Label>
                            <Controller
                                control={control}
                                name="category_id"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value || ''}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="h-12 w-full border-gray-300">
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
                        </div>

                        {/* Notes */}
                        <div className="w-full">
                            <Label className="text-[#40444D] font-semibold mb-2 block">
                                Notes
                            </Label>
                            <Controller
                                control={control}
                                name="notes"
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        placeholder="Enter any additional notes about the fee split arrangement"
                                        disabled={isLoading}
                                        className="h-24 resize-none px-4 rounded-md border shadow-[0px_4px_4px_0px_#0000000D] bg-white text-sm placeholder:text-[#667085] py-1 w-full mt-2"
                                    />
                                )}
                            />
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center space-x-2">
                            <Controller
                                control={control}
                                name="is_active"
                                render={({ field }) => (
                                    <Checkbox
                                        id="is_active"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                            <Label htmlFor="is_active" className="text-sm text-gray-700">
                                Active Fee Split Agreement
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
                        {isLoading ? 'Creating...' : 'Create Fee Split'}
                    </Button>
                </div>
            </Stack>
        </Dialog>
    );
};

export default CreateFeeSplitDialog; 