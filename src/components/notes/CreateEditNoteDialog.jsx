import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    Dialog,
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
import FileUpload from '@/components/FileUpload';
import { Plus, Edit, X } from 'lucide-react';
import {
    Stack,
    Divider,
    IconButton,
} from '@mui/material';



// Quill modules configuration
const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['link'],
        [{ 'align': [] }],
        ['clean']
    ],
};

const CreateEditNoteDialog = ({
    open,
    onClose,
    onSubmit,
    isLoading,
    note = null,
    isEdit = false,
    categories = []
}) => {
    const [attachments, setAttachments] = useState([]);
    
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        defaultValues: {
            title: '',
            body: '',
            category_id: '',
        }
    });

    // Load note data for editing
    useEffect(() => {
        if (isEdit && note) {
            setValue('title', note.title || '');
            setValue('body', note.body || '');
            setValue('category_id', note.category_id || '');

            // Convert existing attachments to the format expected by FileUpload
            if (note.attachments) {
                const existingAttachments = note.attachments.map((attachment, index) => ({
                    id: `existing-${index}`,
                    name: attachment.name || `Attachment ${index + 1}`,
                    size: attachment.size || 0,
                    type: attachment.type || 'application/octet-stream',
                    url: attachment.url,
                    isExisting: true
                }));
                setAttachments(existingAttachments);
            }
        } else {
            reset();
            setAttachments([]);
        }
    }, [isEdit, note, setValue, reset]);

    const onFormSubmit = (data) => {
        console.log("Form submitted with data:", data);
        const formData = {
            ...data,
            attachments: attachments.filter(att => !att.isExisting) // Only send new attachments
        };
        console.log("Processed form data:", formData);
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
                        {isEdit ? 'Edit Note' : 'Create New Note'}
                    </h1>
                    <IconButton onClick={handleClose}>
                        <X className="text-black" />
                    </IconButton>
                </div>

                <Divider />

                {/* Scrollable Content Area */}
                <div className="space-y-6 flex-1 overflow-auto p-6 no-scrollbar">
                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" noValidate>
                        {/* Note Title - Full Width */}
                        <div className="w-full">
                            <Label className="text-[#40444D] font-semibold mb-2 block">
                                Note Title
                            </Label>
                            <Controller
                                control={control}
                                name="title"
                                rules={{ required: 'Title is required' }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter note title"
                                        disabled={isLoading}
                                        className={`h-12 w-full ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                )}
                            />
                            {errors.title && (
                                <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Category - Full Width */}
                        <div className="w-full">
                            <Label className="text-[#40444D] font-semibold mb-2 block">
                                Category
                            </Label>
                            <Controller
                                control={control}
                                name="category_id"
                                rules={{ required: 'Category is required' }}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => {
                                            console.log("Category selected:", value);
                                            field.onChange(value);
                                        }}
                                        value={field.value || ''}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className={`h-12 w-full ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[9999]">
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
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

                        {/* Content - Full Width */}
                        <div className="w-full">
                            <Label className="text-[#40444D] font-semibold mb-2 block">
                                Content
                            </Label>
                            <Controller
                                control={control}
                                name="body"
                                rules={{ required: 'Content is required' }}
                                render={({ field }) => (
                                    <div className={`border rounded-md ${errors.body ? 'border-red-500' : 'border-gray-300'}`}>
                                        <ReactQuill
                                            theme="snow"
                                            value={field.value}
                                            onChange={field.onChange}
                                            modules={quillModules}
                                            placeholder="Write your note content here..."
                                            style={{
                                                height: '400px',
                                                width: '100%'
                                            }}
                                            className="bg-white w-full"
                                        />
                                    </div>
                                )}
                            />
                            {errors.body && (
                                <p className="text-xs text-red-500 mt-1">{errors.body.message}</p>
                            )}
                        </div>

                        {/* Attachments - Full Width */}
                        <div className="w-full mt-20">
                            {/* <Label className="text-[#40444D] font-semibold mb-2 block">
                                Attachments
                            </Label> */}
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
                        {isEdit ? (
                            <>
                                {isLoading ? 'Updating...' : 'Update Note'}
                            </>
                        ) : (
                            <>
                                {isLoading ? 'Creating...' : 'Create Note'}
                            </>
                        )}
                    </Button>
                </div>
            </Stack>
        </Dialog>
    );
};

export default CreateEditNoteDialog; 