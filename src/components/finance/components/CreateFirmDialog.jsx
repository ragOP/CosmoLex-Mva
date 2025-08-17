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

const CreateFirmDialog = ({
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
            api_files: false,
            case_export_file: false,
            closing_statement: false,
            communications_client: false,
            email_attachment: false,
            intake: false,
            intake_form_doc: false,
            intake_form_pdf: false,
            invoice: false,
            lien_subrogation: false,
            mailed_document: false,
            medical_authorization: false,
            medical_billing: false,
            medical_records: false,
            notes: false,
            photographs: false,
            police_records: false,
            release: false,
            service_bills: false,
            shipping_label: false,
            signed_contracts: false,
            vendor: false,
            voice_memo: false,
            // Referral status
            sent_to_referral_firm: false,
            referral_accepted: false,
            referral_declined: false,
            is_active: true
        }
    });

    // Fetch meta data
    const { data: metaData } = useQuery({
        queryKey: ['financeMeta'],
        queryFn: getFinanceMeta,
        enabled: open
    });

    const firmTypes = metaData?.firm_type || [];

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
                        Create New Firm
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
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ''}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className={`h-12 w-full ${errors.firm_type_id ? 'border-red-500' : 'border-gray-300'}`}>
                                                <SelectValue placeholder="Select Firm Type" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[9999]">
                                                {firmTypes.map((type) => (
                                                    <SelectItem key={type.id} value={type.id.toString()}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
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
                                    Phone
                                </Label>
                                <Controller
                                    control={control}
                                    name="phone"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter phone number"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
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
                                            className="h-12 w-full border-gray-300"
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
                                            className="h-12 w-full border-gray-300"
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
                                            className="h-12 w-full border-gray-300"
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
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    ZIP Code
                                </Label>
                                <Controller
                                    control={control}
                                    name="zip_code"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter ZIP code"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
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
                                            className="h-12 w-full border-gray-300"
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
                                            className="h-12 w-full border-gray-300"
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
                                            className="h-12 w-full border-gray-300"
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
                                            className="h-12 w-full border-gray-300"
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
                                    { key: 'communications_client', label: 'Client Communications' },
                                    { key: 'intake', label: 'Intake' },
                                    { key: 'intake_form_pdf', label: 'Intake Form PDF' },
                                    { key: 'invoice', label: 'Invoice' },
                                    { key: 'mailed_document', label: 'Mailed Document' },
                                    { key: 'medical_authorization', label: 'Medical Authorization' },
                                    { key: 'medical_billing', label: 'Medical Billing' },
                                    { key: 'notes', label: 'Notes' },
                                    { key: 'police_records', label: 'Police Records' },
                                    { key: 'service_bills', label: 'Service Bills' },
                                    { key: 'signed_contracts', label: 'Signed Contracts' },
                                    { key: 'voice_memo', label: 'Voice Memo' },
                                    { key: 'referral_accepted', label: 'Referral Accepted' },
                                    { key: 'is_active', label: 'Active Status' }
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center space-x-2">
                                        <Controller
                                            control={control}
                                            name={item.key}
                                            render={({ field }) => (
                                                <Checkbox
                                                    id={item.key}
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={isLoading}
                                                />
                                            )}
                                        />
                                        <Label htmlFor={item.key} className="text-sm text-gray-700">
                                            {item.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
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
                        {isLoading ? 'Creating...' : 'Create Firm'}
                    </Button>
                </div>
            </Stack>
        </Dialog>
    );
};

export default CreateFirmDialog; 