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
import { Checkbox } from '@/components/ui/checkbox';
import FileUpload from '@/components/FileUpload';
import { Plus, X } from 'lucide-react';

const CreateVendorDialog = ({
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
            name: '',
            write_to: '',
            net_terms: 'Net 30',
            days: '30',
            prefix: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            primary_phone: '',
            phone2: '',
            fax: '',
            primary_email: '',
            email: '',
            website: '',
            account_number: '',
            tax_id: '',
            w9_on_file: false,
            track_1099: false,
            description: '',
            category_id: '',
            folder_id: ''
        }
    });

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
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    overflow: 'hidden'
                }
            }}
        >
            <div className="bg-[#F5F5FA]  min-w-[60%] flex flex-col overflow-auto min-h-[90vh] max-h-[90vh] shadow-[0px_4px_24px_0px_#000000]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-3">
                    <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
                        Create New Vendor
                    </h1>
                    <IconButton onClick={handleClose}>
                        <X className="text-black" />
                    </IconButton>
                </div>

                <Divider />

                {/* Scrollable Content Area */}
                <div className="space-y-6 flex-1 overflow-auto p-6 no-scrollbar">

                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" noValidate>
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Vendor Name */}
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Vendor Name *
                                </Label>
                                <Controller
                                    control={control}
                                    name="name"
                                    rules={{ required: 'Vendor name is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter vendor name"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Write To */}
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Write To
                                </Label>
                                <Controller
                                    control={control}
                                    name="write_to"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter write to name"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Contact Person Details */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Prefix
                                </Label>
                                <Controller
                                    control={control}
                                    name="prefix"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Mr/Ms/Dr"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    First Name *
                                </Label>
                                <Controller
                                    control={control}
                                    name="first_name"
                                    rules={{ required: 'First name is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter first name"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.first_name && (
                                    <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>
                                )}
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Middle Name
                                </Label>
                                <Controller
                                    control={control}
                                    name="middle_name"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter middle name"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Last Name *
                                </Label>
                                <Controller
                                    control={control}
                                    name="last_name"
                                    rules={{ required: 'Last name is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter last name"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.last_name && (
                                    <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>
                                )}
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Suffix
                                </Label>
                                <Controller
                                    control={control}
                                    name="suffix"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Jr/Sr/III"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Primary Email *
                                </Label>
                                <Controller
                                    control={control}
                                    name="primary_email"
                                    rules={{
                                        required: 'Primary email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="Enter primary email"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.primary_email ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.primary_email && (
                                    <p className="text-xs text-red-500 mt-1">{errors.primary_email.message}</p>
                                )}
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Secondary Email
                                </Label>
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="Enter secondary email"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Website
                                </Label>
                                <Controller
                                    control={control}
                                    name="website"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter website URL"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Phone Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Primary Phone *
                                </Label>
                                <Controller
                                    control={control}
                                    name="primary_phone"
                                    rules={{ required: 'Primary phone is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter primary phone"
                                            disabled={isLoading}
                                            className={`h-12 w-full ${errors.primary_phone ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                />
                                {errors.primary_phone && (
                                    <p className="text-xs text-red-500 mt-1">{errors.primary_phone.message}</p>
                                )}
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Secondary Phone
                                </Label>
                                <Controller
                                    control={control}
                                    name="phone2"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter secondary phone"
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
                                    name="zip"
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
                                    Country
                                </Label>
                                <Controller
                                    control={control}
                                    name="country"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter country"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Financial Information */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Net Terms
                                </Label>
                                <Controller
                                    control={control}
                                    name="net_terms"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="e.g., Net 30"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Days
                                </Label>
                                <Controller
                                    control={control}
                                    name="days"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="Enter days"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Account Number
                                </Label>
                                <Controller
                                    control={control}
                                    name="account_number"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter account number"
                                            disabled={isLoading}
                                            className="h-12 w-full border-gray-300"
                                        />
                                    )}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-[#40444D] font-semibold mb-2 block">
                                    Tax ID
                                </Label>
                                <Controller
                                    control={control}
                                    name="tax_id"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter tax ID"
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
                                Description
                            </Label>
                            <Controller
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        placeholder="Enter vendor description"
                                        disabled={isLoading}
                                        className="h-24 resize-none px-4 rounded-md border shadow-[0px_4px_4px_0px_#0000000D] backdrop-blur-[20px] bg-gradient-to-t from-[#E9E9E980]/50 to-[#FFFFFF0D]/5 text-sm placeholder:text-[#667085] py-1 w-full"
                                    />
                                )}
                            />
                        </div>

                        {/* Checkboxes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center space-x-2">
                                <Controller
                                    control={control}
                                    name="w9_on_file"
                                    render={({ field }) => (
                                        <Checkbox
                                            id="w9_on_file"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isLoading}
                                        />
                                    )}
                                />
                                <Label htmlFor="w9_on_file" className="text-sm text-gray-700">
                                    W9 On File
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Controller
                                    control={control}
                                    name="track_1099"
                                    render={({ field }) => (
                                        <Checkbox
                                            id="track_1099"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isLoading}
                                        />
                                    )}
                                />
                                <Label htmlFor="track_1099" className="text-sm text-gray-700">
                                    Track 1099
                                </Label>
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
                        {isLoading ? 'Creating...' : 'Create Vendor'}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default CreateVendorDialog; 