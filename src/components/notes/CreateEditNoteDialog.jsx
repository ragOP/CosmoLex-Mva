import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Dialog } from '@mui/material';
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
// import FileUpload from '@/components/FileUpload';
import { Plus, Edit, X } from 'lucide-react';
import { Stack, Divider, IconButton } from '@mui/material';
import UploadMediaDialog from '@/components/UploadMediaDialog';
import { useDocuments } from '@/components/inbox/documents/hooks/useDocuments';
import { useMutation } from '@tanstack/react-query';
import { uploadNoteAttachment } from '@/api/api_services/notes';
import { toast } from 'sonner';

// Quill modules configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['link'],
    [{ align: [] }],
    ['clean'],
  ],
};

const CreateEditNoteDialog = ({
  open,
  onClose,
  onSubmit,
  isLoading,
  note = null,
  isEdit = false,
  categories = [],
}) => {
  const [attachments, setAttachments] = useState([]);
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);

  const { isUploadingFile } = useDocuments();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      title: '',
      body: '',
      category_id: '',
    },
  });

  // Watch form values for debugging
  const watchedValues = watch();
  useEffect(() => {
    console.log('Form values changed:', watchedValues);
    console.log('Current form state:', {
      title: watchedValues.title,
      body: watchedValues.body,
      category_id: watchedValues.category_id,
    });
  }, [watchedValues]);

  // Reset form when note changes
  useEffect(() => {
    console.log('Note prop changed in dialog:', note);
    console.log('isEdit value:', isEdit);
    if (note && isEdit) {
      console.log('Note prop changed, resetting form with:', note);
      console.log('Note title:', note.title);
      console.log('Note body:', note.body);
      console.log('Note category_id:', note.category_id);

      // Reset form immediately with the note data
      reset({
        title: note.title || '',
        body: note.body || '',
        category_id: note.category_id || '',
      });
      console.log('Form reset completed with values:', {
        title: note.title || '',
        body: note.body || '',
        category_id: note.category_id || '',
      });
    } else if (!note && !isEdit) {
      // Reset form for new note creation
      reset({
        title: '',
        body: '',
        category_id: '',
      });
    }
  }, [note, isEdit, reset]);

  // Load note data for editing - handle attachments
  useEffect(() => {
    console.log('useEffect triggered - isEdit:', isEdit, 'note:', note);

    if (isEdit && note) {
      console.log('Loading note data for editing:', note);

      // Convert existing attachments to the format expected by FileUpload
      if (note.attachments) {
        const existingAttachments = note.attachments.map(
          (attachment, index) => ({
            id: `existing-${index}`,
            name: attachment.name || `Attachment ${index + 1}`,
            size: attachment.size || 0,
            type: attachment.type || 'application/octet-stream',
            url: attachment.url,
            isExisting: true,
          })
        );
        setAttachments(existingAttachments);
      }
    } else {
      console.log('Resetting form - not in edit mode or no note data');
      setAttachments([]);
    }
  }, [isEdit, note]);

  const onFormSubmit = (data) => {
    console.log('Form submitted with data:', data);

    // Validate required fields
    if (!data.title || !data.body || !data.category_id) {
      console.error('Missing required fields:', {
        title: !!data.title,
        body: !!data.body,
        category_id: !!data.category_id,
      });
      return;
    }

    const formData = {
      ...data,
      attachments: attachments.filter((att) => !att.isExisting), // Only send new attachments
    };
    console.log('Processed form data:', formData);
    onSubmit(formData);
  };

  const uploadAttachmentMutation = useMutation({
    mutationFn: uploadNoteAttachment,
    onSuccess: () => {
      toast.success('Attachment uploaded successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upload attachment');
      console.error('Error uploading attachment:', error);
    },
  });

  const handleUploadAttachment = (payload) => {
    const files = payload.files;
    // const newPayload = {
    //   ...payload,
    //   slug: matterSlug,
    //   contact_id: matter?.contact_id,
    //   attachment: files,
    // };
    // delete newPayload.files;

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key !== 'files') {
        formData.append(key, value);
      }
    });
    files.forEach((fileItem) => {
      formData.append('attachment', fileItem.file);
    });

    console.log('newPayload >>>>', formData);
    uploadAttachmentMutation.mutate(formData);
  };

  const handleClose = () => {
    console.log('Closing dialog, resetting form');
    reset({
      title: '',
      body: '',
      category_id: '',
    });
    setAttachments([]);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        sx={{ zIndex: 9998 }}
      >
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
            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className="space-y-6"
              noValidate
              id="note-form"
              key={`note-form-${note?.id || 'new'}`}
            >
              {/* Note Title - Full Width */}
              <div className="w-full">
                <Label className="text-[#40444D] font-semibold mb-2 block">
                  Note Title
                </Label>
                <Controller
                  control={control}
                  name="title"
                  rules={{ required: 'Title is required' }}
                  render={({ field }) => {
                    console.log(
                      'Title field render - value:',
                      field.value,
                      'field props:',
                      field
                    );
                    console.log('Current note prop:', note);
                    return (
                      <Input
                        {...field}
                        placeholder="Enter note title"
                        disabled={isLoading}
                        className={`h-12 w-full ${
                          errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={field.value || ''}
                      />
                    );
                  }}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.title.message}
                  </p>
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
                  render={({ field }) => {
                    console.log(
                      'Category field render - value:',
                      field.value,
                      'Available categories:',
                      categories
                    );
                    console.log('Category field props:', field);
                    console.log('Category value type:', typeof field.value);
                    console.log(
                      'Categories data:',
                      categories.map((cat) => ({
                        id: cat.id,
                        type: typeof cat.id,
                        name: cat.name,
                      }))
                    );
                    return (
                      <Select
                        onValueChange={(value) => {
                          console.log('Category selected:', value);
                          field.onChange(value);
                        }}
                        value={field.value || ''}
                        disabled={isLoading}
                        key={`category-select-${field.value || 'empty'}`}
                      >
                        <SelectTrigger
                          className={`h-12 w-full ${
                            errors.category_id
                              ? 'border-red-500'
                              : 'border-gray-300'
                          }`}
                        >
                          <SelectValue placeholder="Select Category">
                            {field.value
                              ? categories.find(
                                  (cat) => cat.id === field.value.toString()
                                )?.name
                              : 'Select Category'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="z-[9999]">
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
                {errors.category_id && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.category_id.message}
                  </p>
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
                  render={({ field }) => {
                    console.log('Body field render - value:', field.value);
                    return (
                      <div
                        className={`border rounded-md ${
                          errors.body ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <ReactQuill
                          theme="snow"
                          value={field.value || ''}
                          onChange={field.onChange}
                          modules={quillModules}
                          placeholder="Write your note content here..."
                          style={{
                            height: '400px',
                            width: '100%',
                          }}
                          className="bg-white w-full"
                          key={`quill-${note?.id || 'new'}`}
                        />
                      </div>
                    );
                  }}
                />
                {errors.body && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.body.message}
                  </p>
                )}
              </div>

              {/* Attachments - Full Width */}
              <div className="w-full mt-20">
                <Label>Attachments</Label>
                <Button
                  type="button"
                  onClick={() => setAttachmentDialogOpen(true)}
                  variant="outline"
                  className="w-fit mt-2 bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Attachment
                </Button>
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
              form="note-form"
              disabled={isLoading}
              className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
            >
              {isEdit ? (
                <>{isLoading ? 'Updating...' : 'Update Note'}</>
              ) : (
                <>{isLoading ? 'Creating...' : 'Create Note'}</>
              )}
            </Button>
          </div>
        </Stack>
      </Dialog>

      <UploadMediaDialog
        open={attachmentDialogOpen}
        onClose={() => setAttachmentDialogOpen(false)}
        onSubmit={(payload) => handleUploadAttachment(payload)}
        isLoading={isUploadingFile}
      />
    </>
  );
};

export default CreateEditNoteDialog;
