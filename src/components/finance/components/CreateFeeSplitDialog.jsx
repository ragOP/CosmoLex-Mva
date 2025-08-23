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
import { Plus, X, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getFinanceMeta, getFirms } from '@/api/api_services/finance';
import { toast } from 'sonner';

const CreateFeeSplitDialog = ({
    open,
    onClose,
    onSubmit,
    isLoading,
    editMode = false,
    editingFeeSplit = null
}) => {
    const [apiErrors, setApiErrors] = useState({});

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            subfirm_id: '',
            override_type_id: '',
            override: '',
            firm_agreement_id: '',
            referral_status_id: ''
        }
    });

    // Fetch meta data
    const { data: metaData } = useQuery({
        queryKey: ['financeMeta'],
        queryFn: getFinanceMeta,
        enabled: open
    });

    // Fetch firms for dropdown
    const { data: firmsResponse } = useQuery({
        queryKey: ['firms'],
        queryFn: getFirms,
        enabled: open
    });

    const firms = Array.isArray(firmsResponse?.data) ? firmsResponse.data : [];
    const overrideTypes = metaData?.override_type || [];
    const firmAgreements = metaData?.firm_agreement_in_place || [];
    const referralStatuses = metaData?.referral_status || [];

    // Search states for dropdowns
    const [firmSearch, setFirmSearch] = useState('');
    const [overrideTypeSearch, setOverrideTypeSearch] = useState('');
    const [firmAgreementSearch, setFirmAgreementSearch] = useState('');
    const [referralStatusSearch, setReferralStatusSearch] = useState('');

    // Filtered data based on search terms
    const filteredFirms = firms.filter(firm =>
        firm.name?.toLowerCase().includes(firmSearch.toLowerCase())
    );
    const filteredOverrideTypes = overrideTypes.filter(type =>
        type.name?.toLowerCase().includes(overrideTypeSearch.toLowerCase())
    );
    const filteredFirmAgreements = firmAgreements.filter(agreement =>
        agreement.name?.toLowerCase().includes(firmAgreementSearch.toLowerCase())
    );
    const filteredReferralStatuses = referralStatuses.filter(status =>
        status.name?.toLowerCase().includes(referralStatusSearch.toLowerCase())
    );

    // Reset form when dialog opens or populate with editing data
    React.useEffect(() => {
        if (!open) return;
        if (editMode && editingFeeSplit) {
            reset(editingFeeSplit);
        } else {
            reset();
        }
        setApiErrors({}); // Clear API errors when dialog opens
    }, [open, editMode, editingFeeSplit, reset]);

    const resetSearchTerms = () => {
        setFirmSearch('');
        setOverrideTypeSearch('');
        setFirmAgreementSearch('');
        setReferralStatusSearch('');
    };

    const onFormSubmit = async (data) => {
        try {
            const result = await onSubmit(data, setApiErrors);

            // Check if the submission was successful
            if (result && result.Apistatus === true) {
                // Success - show success toast and close dialog
                toast.success(editMode ? 'Fee split updated successfully!' : 'Fee split created successfully!');
                // Close dialog with success flag
                onClose(true); // true indicates success
            } else if (result && result.Apistatus === false) {
                // API returned validation errors
                if (result.errors) {
                    setApiErrors(result.errors);
                    toast.error(result.message || 'Validation failed. Please fix the errors below.');
                } else {
                    toast.error(result.message || 'Failed to save fee split. Please try again.');
                }
                // Don't close dialog on validation errors
            }
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error('Network error. Please check your connection and try again.');
            // Don't close dialog on network errors
        }
    };

    const handleClose = () => {
        // Always allow closing the dialog regardless of validation errors
        reset();
        resetSearchTerms();
        setApiErrors({}); // Clear any existing API errors
        onClose(false); // false indicates normal close (not success)
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{
            sx: {
                borderRadius: '16px',
                overflow: 'hidden'
            }
        }}>
            <Stack className="bg-[#F5F5FA] rounded-lg min-w-[50%] max-h-[80vh] shadow-[0px_4px_24px_0px_#000000]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-3">
                    <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
                        {editMode ? 'Edit Fee Split' : 'Create New Fee Split'}
                    </h1>
                    <IconButton onClick={handleClose}>
                        <X className="text-black" />
                    </IconButton>
                </div>

                <Divider />

                {/* Form Content */}
                <div className="space-y-6 flex-1 overflow-auto p-6">
                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" noValidate>
                        {/* Subfirm Selection */}
                        <div className="w-full">
                            <Label className="text-[#40444D] font-semibold mb-2 block">
                                Firm *
                            </Label>
                            <Controller
                                control={control}
                                name="subfirm_id"
                                rules={{ required: 'Subfirm is required' }}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ? field.value.toString() : ''}
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
                            {apiErrors.subfirm_id && (
                                <p className="text-xs text-red-500 mt-1">{apiErrors.subfirm_id[0]}</p>
                            )}
                        </div>

                        {/* Override Type and Value */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Override Type *
                                </Label>
                                <Controller
                                    control={control}
                                    name="override_type_id"
                                    rules={{ required: 'Override type is required' }}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ? field.value.toString() : ''}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className={`h-12 w-full ${errors.override_type_id ? 'border-red-500' : 'border-gray-300'}`}>
                                                <SelectValue placeholder="Select Override Type" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[9999]">
                                                {/* Search Input */}
                                                <div className="p-2 border-b border-gray-200">
                                                    <div className="relative">
                                                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                                                        <Input
                                                            placeholder="Search override types..."
                                                            value={overrideTypeSearch}
                                                            onChange={(e) => setOverrideTypeSearch(e.target.value)}
                                                            className="pl-6 h-8 text-sm border-0 focus:ring-0 focus:border-0"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Override Type List */}
                                                {filteredOverrideTypes.length === 0 ? (
                                                    <div className="p-2 text-sm text-gray-500 text-center">
                                                        No override types found
                                                    </div>
                                                ) : (
                                                    filteredOverrideTypes.map((type) => (
                                                        <SelectItem key={type.id} value={type.id.toString()}>
                                                            {type.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.override_type_id && (
                                    <p className="text-xs text-red-500 mt-1">{errors.override_type_id.message}</p>
                                )}
                                {apiErrors.override_type_id && (
                                    <p className="text-xs text-red-500 mt-1">{apiErrors.override_type_id[0]}</p>
                                )}
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Override Value *
                                </Label>
                                <Controller
                                    control={control}
                                    name="override"
                                    rules={{ required: 'Override value is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="e.g., 10"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.override ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.override && (
                                    <p className="text-xs text-red-500 mt-1">{errors.override.message}</p>
                                )}
                                {apiErrors.override && (
                                    <p className="text-xs text-red-500 mt-1">{apiErrors.override[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* Firm Agreement and Referral Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Firm Agreement *
                                </Label>
                                <Controller
                                    control={control}
                                    name="firm_agreement_id"
                                    rules={{ required: 'Firm agreement is required' }}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ? field.value.toString() : ''}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className={`h-12 w-full ${errors.firm_agreement_id ? 'border-red-500' : 'border-gray-300'}`}>
                                                <SelectValue placeholder="Select Firm Agreement" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[9999]">
                                                {/* Search Input */}
                                                <div className="p-2 border-b border-gray-200">
                                                    <div className="relative">
                                                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                                                        <Input
                                                            placeholder="Search firm agreements..."
                                                            value={firmAgreementSearch}
                                                            onChange={(e) => setFirmAgreementSearch(e.target.value)}
                                                            className="pl-6 h-8 text-sm border-0 focus:ring-0 focus:border-0"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Firm Agreement List */}
                                                {filteredFirmAgreements.length === 0 ? (
                                                    <div className="p-2 text-sm text-gray-500 text-center">
                                                        No firm agreements found
                                                    </div>
                                                ) : (
                                                    filteredFirmAgreements.map((agreement) => (
                                                        <SelectItem key={agreement.id} value={agreement.id.toString()}>
                                                            {agreement.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.firm_agreement_id && (
                                    <p className="text-xs text-red-500 mt-1">{errors.firm_agreement_id.message}</p>
                                )}
                                {apiErrors.firm_agreement_id && (
                                    <p className="text-xs text-red-500 mt-1">{apiErrors.firm_agreement_id[0]}</p>
                                )}
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Referral Status *
                                </Label>
                                <Controller
                                    control={control}
                                    name="referral_status_id"
                                    rules={{ required: 'Referral status is required' }}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ? field.value.toString() : ''}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className={`h-12 w-full ${errors.referral_status_id ? 'border-red-500' : 'border-gray-300'}`}>
                                                <SelectValue placeholder="Select Referral Status" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[9999]">
                                                {/* Search Input */}
                                                <div className="p-2 border-b border-gray-200">
                                                    <div className="relative">
                                                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                                                        <Input
                                                            placeholder="Search referral statuses..."
                                                            value={referralStatusSearch}
                                                            onChange={(e) => setReferralStatusSearch(e.target.value)}
                                                            className="pl-6 h-8 text-sm border-0 focus:ring-0 focus:border-0"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Referral Status List */}
                                                {filteredReferralStatuses.length === 0 ? (
                                                    <div className="p-2 text-sm text-gray-500 text-center">
                                                        No referral statuses found
                                                    </div>
                                                ) : (
                                                    filteredReferralStatuses.map((status) => (
                                                        <SelectItem key={status.id} value={status.id.toString()}>
                                                            {status.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.referral_status_id && (
                                    <p className="text-xs text-red-500 mt-1">{errors.referral_status_id.message}</p>
                                )}
                                {apiErrors.referral_status_id && (
                                    <p className="text-xs text-red-500 mt-1">{apiErrors.referral_status_id[0]}</p>
                                )}
                            </div>
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
                        {isLoading ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Fee Split' : 'Create Fee Split')}
                    </Button>
                </div>
            </Stack>
        </Dialog>
    );
};

export default CreateFeeSplitDialog; 