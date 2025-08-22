import React, { useState, useEffect } from 'react';
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
import { Plus, X, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getFinanceMeta } from '@/api/api_services/finance';
import { toast } from 'sonner';

const CreateFirmDialog = ({
    open,
    onClose,
    onSubmit,
    isLoading,
    editMode = false,
    editingFirm = null
}) => {
    const [apiErrors, setApiErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm({
        defaultValues: {
            firm_type_id: '',
            name: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            zip_code: '',
            ein: '',
            contact_name: '',
            phone: '',
            fax: '',
            email: '',
            firm_percent: '',
            firm_flat_fee: '',
            category_id: '',
            folder_id: '',
            // Document permissions
            api_files: 0,
            case_export_file: 0,
            closing_statement: 0,
            communications_client: 0,
            email_attachment: 0,
            intake: 0,
            intake_form_doc: 0,
            intake_form_pdf: 0,
            invoice: 0,
            lien_subrogation: 0,
            mailed_document: 0,
            medical_authorization: 0,
            medical_billing: 0,
            medical_records: 0,
            notes: 0,
            photographs: 0,
            police_records: 0,
            release: 0,
            service_bills: 0,
            shipping_label: 0,
            signed_contracts: 0,
            vendor: 0,
            voice_memo: 0,
            // Referral status
            sent_to_referral_firm: 0,
            referral_accepted: 0,
            referral_declined: 0,
            is_active: 1
        }
    });

    // Fetch meta data
    const { data: metaData } = useQuery({
        queryKey: ['financeMeta'],
        queryFn: getFinanceMeta,
        enabled: open
    });

    const firmTypes = metaData?.firm_type || [];

    // Search states for dropdowns
    const [firmTypeSearch, setFirmTypeSearch] = useState('');

    // Filtered data based on search terms
    const filteredFirmTypes = firmTypes.filter(type =>
        type.name?.toLowerCase().includes(firmTypeSearch.toLowerCase())
    );

    // Reset all states when dialog opens or populate with editing data
    useEffect(() => {
        if (open) {
            if (editMode && editingFirm) {
                // Populate form with editing data
                console.log('Editing firm data:', editingFirm);
                console.log('Firm type ID:', editingFirm.firm_type_id);
                console.log('Available firm types:', firmTypes);
                reset(editingFirm);
            } else {
                // Reset to default values
                resetAllStates();
            }
        }
    }, [open, editMode, editingFirm, reset, firmTypes]);

    // Handle case where firmTypes loads after form is populated
    useEffect(() => {
        if (editMode && editingFirm && firmTypes.length > 0 && open) {
            console.log('Firm types loaded, re-populating form');
            reset(editingFirm);
        }
    }, [firmTypes, editMode, editingFirm, open, reset]);

    // Debug: Watch form values to see what's happening
    useEffect(() => {
        if (open) {
            const subscription = watch((value, { name, type }) => {
                if (type === 'change' && name && name.includes('_')) {
                    console.log(`Field ${name} changed to:`, value[name]);
                }
            });
            return () => subscription.unsubscribe();
        }
    }, [watch, open]);

    const onFormSubmit = async (data) => {
        // Prevent multiple submissions
        if (isLoading || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Data is already in 0/1 format, no transformation needed
            const submitData = data;
            
            // Debug: Log the submit data
            console.log('Submit data:', submitData);

            const result = await onSubmit(editMode ? { ...submitData, id: editingFirm.id } : submitData);

            if (result && result.errors) {
                setApiErrors(result.errors);
                toast.error('Validation failed. Please fix the errors below.');
            } else if (result && result.Apistatus === true) {
                toast.success("Firm created successfully!");
                resetAllStates();
                handleClose();
            } else if (result && result.Apistatus === false) {
                toast.error(result?.message || 'Failed to create firm. Please try again.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        // If there are validation errors, show a warning toast
        if (Object.keys(apiErrors).length > 0) {
            toast.warning('Form has validation errors. Changes will be lost.');
        }
        resetAllStates();
        onClose();
    };

    const resetSearchTerms = () => {
        setFirmTypeSearch('');
    };

    const resetAllStates = () => {
        console.log('Resetting form to default values');
        reset(); // Reset form data
        setApiErrors({}); // Clear API errors
        setIsSubmitting(false); // Reset submission state
        resetSearchTerms(); // Reset search terms
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
                        {editMode ? 'Edit Firm' : 'Create New Firm'}
                    </h1>
                    <IconButton onClick={handleClose}>
                        <X className="text-black" />
                    </IconButton>
                </div>

                <Divider />

                {/* Scrollable Content Area */}
                <div className="space-y-6 flex-1 overflow-auto p-6">
                    {/* API Error Display */}
                    {Object.keys(apiErrors).length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        API Validation Failed
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>Please fix the validation errors below:</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <form id="create-firm-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" noValidate>
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Firm Name */}
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Firm Name *
                                </Label>
                                <Controller
                                    control={control}
                                    name="name"
                                    rules={{ required: 'Firm name is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter firm name"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Firm Type */}
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Firm Type *
                                </Label>
                                <Controller
                                    control={control}
                                    name="firm_type_id"
                                    rules={{ required: 'Firm type is required' }}
                                    render={({ field }) => {
                                        console.log('Controller field:', field);
                                        return (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ? field.value.toString() : ''}
                                            disabled={isLoading}
                                        >
                                            {/* Debug: Log the field value */}
                                            {console.log('Select field value:', field.value, 'Type:', typeof field.value)}
                                            <SelectTrigger className={`h-12 w-full border ${errors.firm_type_id ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}>
                                                <SelectValue placeholder="Select Firm Type">
                                                    {firmTypes.find(type => type.id.toString() === field.value?.toString())?.name || 'Select Firm Type'}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className="z-[9999]">
                                                {/* Search Input */}
                                                <div className="p-2 border-b border-gray-200">
                                                    <div className="relative">
                                                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                                                        <Input
                                                            placeholder="Search firm types..."
                                                            value={firmTypeSearch}
                                                            onChange={(e) => setFirmTypeSearch(e.target.value)}
                                                            className="pl-6 h-8 text-sm border-0 focus:ring-0 focus:border-0"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                {/* Firm Type List */}
                                                {filteredFirmTypes.length === 0 ? (
                                                    <div className="p-2 text-sm text-gray-500 text-center">
                                                        No firm types found
                                                    </div>
                                                ) : (
                                                    filteredFirmTypes.map((type) => (
                                                        <SelectItem key={type.id} value={type.id.toString()}>
                                                            {type.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    );
                                    }}
                                />
                                {errors.firm_type_id && (
                                    <p className="text-xs text-red-500 mt-1">{errors.firm_type_id.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Contact Name *
                                </Label>
                                <Controller
                                    control={control}
                                    name="contact_name"
                                    rules={{ required: 'Contact name is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter contact name"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.contact_name ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.contact_name && (
                                    <p className="text-xs text-red-500 mt-1">{errors.contact_name.message}</p>
                                )}
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Email *
                                </Label>
                                <Controller
                                    control={control}
                                    name="email"
                                    rules={{
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="Enter email address"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Phone *
                                </Label>
                                <Controller
                                    control={control}
                                    name="phone"
                                    rules={{ required: 'Phone number is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter phone number"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.phone && (
                                    <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Address Line 1
                                </Label>
                                <Controller
                                    control={control}
                                    name="address1"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter address"
                                            disabled={isLoading}
                                            className="h-12 w-full border border-gray-300"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Address Line 2
                                </Label>
                                <Controller
                                    control={control}
                                    name="address2"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter address line 2"
                                            disabled={isLoading}
                                            className="h-12 w-full border border-gray-300"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    City
                                </Label>
                                <Controller
                                    control={control}
                                    name="city"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter city"
                                            disabled={isLoading}
                                            className="h-12 w-full border border-gray-300"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    State
                                </Label>
                                <Controller
                                    control={control}
                                    name="state"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter state"
                                            disabled={isLoading}
                                            className="h-12 w-full border border-gray-300"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    ZIP Code *
                                </Label>
                                <Controller
                                    control={control}
                                    name="zip_code"
                                    rules={{ required: 'ZIP code is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter ZIP code"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.zip_code ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.zip_code && (
                                    <p className="text-xs text-red-500 mt-1">{errors.zip_code.message}</p>
                                )}
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    EIN
                                </Label>
                                <Controller
                                    control={control}
                                    name="ein"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter EIN"
                                            disabled={isLoading}
                                            className="h-12 w-full border border-gray-300"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Financial Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Firm Percentage
                                </Label>
                                <Controller
                                    control={control}
                                    name="firm_percent"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="e.g., 10%"
                                            disabled={isLoading}
                                            className="h-12 w-full border border-gray-300"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Firm Flat Fee
                                </Label>
                                <Controller
                                    control={control}
                                    name="firm_flat_fee"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter flat fee amount"
                                            disabled={isLoading}
                                            className="h-12 w-full border border-gray-300"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Fax
                                </Label>
                                <Controller
                                    control={control}
                                    name="fax"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter fax number"
                                            disabled={isLoading}
                                            className="h-12 w-full border border-gray-300"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Document Permissions */}
                        <div className="w-full">
                            <Label className="text-[#40444D] font-semibold mb-4 block">
                                Document Permissions
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { key: 'api_files', label: 'API Files' },
                                    { key: 'case_export_file', label: 'Case Export File' },
                                    { key: 'closing_statement', label: 'Closing Statement' },
                                    { key: 'communications_client', label: 'Client Communications' },
                                    { key: 'email_attachment', label: 'Email Attachment' },
                                    { key: 'intake', label: 'Intake' },
                                    { key: 'intake_form_doc', label: 'Intake Form Doc' },
                                    { key: 'intake_form_pdf', label: 'Intake Form PDF' },
                                    { key: 'invoice', label: 'Invoice' },
                                    { key: 'lien_subrogation', label: 'Lien Subrogation' },
                                    { key: 'mailed_document', label: 'Mailed Document' },
                                    { key: 'medical_authorization', label: 'Medical Authorization' },
                                    { key: 'medical_billing', label: 'Medical Billing' },
                                    { key: 'medical_records', label: 'Medical Records' },
                                    { key: 'notes', label: 'Notes' },
                                    { key: 'photographs', label: 'Photographs' },
                                    { key: 'police_records', label: 'Police Records' },
                                    { key: 'release', label: 'Release' },
                                    { key: 'service_bills', label: 'Service Bills' },
                                    { key: 'shipping_label', label: 'Shipping Label' },
                                    { key: 'signed_contracts', label: 'Signed Contracts' },
                                    { key: 'vendor', label: 'Vendor' },
                                    { key: 'voice_memo', label: 'Voice Memo' },
                                    { key: 'sent_to_referral_firm', label: 'Sent to Referral Firm' },
                                    { key: 'referral_accepted', label: 'Referral Accepted' },
                                    { key: 'referral_declined', label: 'Referral Declined' },
                                    { key: 'is_active', label: 'Active Status' }
                                ].map((item) => (
                                    <div key={item.key} className="flex flex-col space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <Controller
                                                control={control}
                                                name={item.key}
                                                render={({ field }) => (
                                                    <Checkbox
                                                        id={item.key}
                                                        checked={field.value === 1}
                                                        onCheckedChange={(checked) => {
                                                            field.onChange(checked ? 1 : 0);
                                                        }}
                                                        disabled={isLoading}
                                                        className={apiErrors[item.key] ? 'border-red-500' : ''}
                                                    />
                                                )}
                                            />
                                            <Label htmlFor={item.key} className="text-sm text-gray-700">
                                                {item.label}
                                            </Label>
                                        </div>
                                        {apiErrors[item.key] && (
                                            <p className="text-xs text-red-500 ml-6">{apiErrors[item.key][0]}</p>
                                        )}
                                    </div>
                                ))}
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
                        form="create-firm-form"
                        disabled={isLoading || isSubmitting}
                        className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
                    >
                        {isLoading || isSubmitting ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Firm' : 'Create Firm')}
                    </Button>
                </div>
            </Stack>
        </Dialog>
    );
};

export default CreateFirmDialog; 