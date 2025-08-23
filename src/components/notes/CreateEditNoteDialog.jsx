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
import { Plus, Edit, X, Eye, Trash2 } from 'lucide-react';
import { Stack, Divider, IconButton, Tooltip } from '@mui/material';
import UploadMediaDialog from '@/components/UploadMediaDialog';
import { useDocuments } from '@/components/inbox/documents/hooks/useDocuments';
import { useMutation } from '@tanstack/react-query';
import { uploadNoteAttachment, deleteNoteAttachment } from '@/api/api_services/notes';
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
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const [uploadedAttachments, setUploadedAttachments] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);

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

      // Note: We're now using attachment_ids instead of attachments array
      // Existing attachments are handled through attachment_ids

      // Load existing attachments if available
      if (note.attachments && Array.isArray(note.attachments)) {
        const existingAttachments = note.attachments.map(att => ({
          id: att.id,
          name: att.file_name || att.name || `File ${att.id}`,
          file_name: att.file_name || att.name || `File ${att.id}`,
          url: att.file_path || att.url || '',
          file_path: att.file_path || att.url || '',
          file_type: att.file_type || 'application/octet-stream'
        }));
        setUploadedAttachments(existingAttachments);
      }
    } else {
      console.log('Resetting form - not in edit mode or no note data');
      setUploadedAttachments([]);
    }
  }, [isEdit, note]);

  const onFormSubmit = (data) => {
    console.log('Form submitted with data:', data);
    console.log('Current uploadedAttachments:', uploadedAttachments);

    // Validate required fields
    if (!data.title || !data.body || !data.category_id) {
      console.error('Missing required fields:', {
        title: !!data.title,
        body: !!data.body,
        category_id: !!data.category_id,
      });
      return;
    }

    // Create JSON payload (not FormData)
    const jsonPayload = {
      category_id: data.category_id,
      title: data.title,
      body: data.body,
      attachment_ids: uploadedAttachments.map(att => att.id), // Extract just the IDs
    };

    console.log('JSON payload being sent:', jsonPayload);
    console.log('Attachment IDs array:', jsonPayload.attachment_ids);
    console.log('Payload type:', typeof jsonPayload);
    console.log('uploadedAttachments length:', uploadedAttachments.length);
    console.log('uploadedAttachments content:', uploadedAttachments);

    // // Validate that we have attachment IDs
    // if (jsonPayload.attachment_ids.length === 0) {
    //   console.warn('No attachment IDs to send');
    // }

    // Send as JSON, not FormData
    onSubmit(jsonPayload);
  };

  const uploadAttachmentMutation = useMutation({
    mutationFn: uploadNoteAttachment,
    onSuccess: (response) => {
      toast.success('Attachment uploaded successfully');
      console.log('Upload success response:', response);
      // Extract attachment data from response and add to the list
      if (response && response.attachment_id) {
        const attachment = {
          id: response.attachment_id,
          name: response.file_name || `File ${response.attachment_id}`,
          file_name: response.file_name || `File ${response.attachment_id}`,
          url: response.file_path || '',
          file_path: response.file_path || '',
          file_type: response.file_type || 'application/octet-stream'
        };
        console.log('Adding attachment:', attachment);
        setUploadedAttachments(prev => {
          const newAttachments = [...prev, attachment];
          console.log('Updated uploadedAttachments:', newAttachments);
          return newAttachments;
        });
      } else {
        console.log('No attachment_id found in response:', response);
      }
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

  const handleDeleteAttachment = (attachment) => {
    setAttachmentToDelete(attachment);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteAttachment = async () => {
    if (attachmentToDelete) {
      try {
        const response = await deleteNoteAttachment(attachmentToDelete.id);
        
        if (response && response.Apistatus) {
          setUploadedAttachments(prev => prev.filter(att => att.id !== attachmentToDelete.id));
          toast.success('Attachment deleted successfully');
        } else {
          toast.error(response?.message || 'Failed to delete attachment');
          console.error('API returned false status:', response);
        }
      } catch (error) {
        toast.error(error.message || 'Failed to delete attachment');
        console.error('Error deleting attachment:', error);
      } finally {
        setAttachmentToDelete(null);
        setDeleteConfirmationOpen(false);
      }
    } else {
      setDeleteConfirmationOpen(false);
    }
  };

  const cancelDeleteAttachment = () => {
    setAttachmentToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  const handleClose = () => {
    console.log('Closing dialog, resetting form');
    reset({
      title: '',
      body: '',
      category_id: '',
    });
    setUploadedAttachments([]);
    setDeleteConfirmationOpen(false);
    setAttachmentToDelete(null);
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
                        className={`h-12 w-full ${errors.title ? 'border-red-500' : 'border-gray-300'
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
                          className={`h-12 w-full ${errors.category_id
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
                        className={`border rounded-md ${errors.body ? 'border-red-500' : 'border-gray-300'
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

                {/* Display uploaded files */}
                {uploadedAttachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label className="text-sm text-gray-600">Uploaded Files:</Label>
                    {uploadedAttachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                        <span
                          className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer underline"
                          onClick={() => {
                            // Open file in new window if it's an image
                            const fileName = attachment.file_name || attachment.name;
                            if (fileName && fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                              const fileUrl = attachment.file_path || attachment.url;
                              if (fileUrl) {
                                window.open(fileUrl, '_blank');
                              }
                            }
                          }}
                          title="Click to open file"
                        >
                          {attachment.file_name || attachment.name || `File ${attachment.id}`}
                        </span>
                        <div className="flex items-center gap-2">
                          <Tooltip title="Preview file" arrow placement="top">
                            <IconButton
                              size="small"
                              onClick={() => {
                                // Preview functionality - open in new window if image
                                const fileName = attachment.file_name || attachment.name;
                                if (fileName && fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                                  const fileUrl = attachment.file_path || attachment.url;
                                  if (fileUrl) {
                                    window.open(fileUrl, '_blank');
                                  }
                                }
                              }}
                              className="text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              <Eye size={16} className="text-blue-600 hover:text-blue-700 transition-colors"
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete file" arrow placement="top">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteAttachment(attachment)}
                            >
                              <Trash2 size={16} className="text-red-600 hover:text-red-700 transition-colors"
                              />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmationOpen}
        onClose={cancelDeleteAttachment}
        maxWidth="sm"
        fullWidth
        sx={{ zIndex: 9998 }}
      >
        <Stack className="bg-[#F5F5FA] rounded-lg min-w-[40%] max-h-[50vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3">
            <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
              Delete Attachment
            </h1>
            <IconButton onClick={cancelDeleteAttachment}>
              <X className="text-black" />
            </IconButton>
          </div>

          <Divider />

          {/* Content */}
          <div className="space-y-6 flex-1 overflow-auto p-6 no-scrollbar">
            <div className="text-center">
              <Trash2 className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#40444D] mb-3">
                Are you sure?
              </h3>
              <p className="text-gray-600 mb-6">
                You are about to delete "{attachmentToDelete?.file_name || attachmentToDelete?.name || 'this file'}". 
                This action cannot be undone.
              </p>
            </div>
          </div>

          <Divider />

          {/* Footer */}
          <div className="flex items-center justify-end px-6 py-4 gap-4">
            <Button
              onClick={cancelDeleteAttachment}
              className="bg-gray-300 text-black hover:bg-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteAttachment}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </Stack>
      </Dialog>
    </>
  );
};

export default CreateEditNoteDialog;
