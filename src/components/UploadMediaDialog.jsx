import React, { useState, useCallback, useRef } from 'react';
import { Dialog, Stack, Divider, IconButton } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from '@/components/ui/select';
import { Upload, FileText, Trash2, CloudUpload, X } from 'lucide-react';
import { useDocuments } from '@/components/inbox/documents/hooks/useDocuments';
import isArrayWithValues from '@/utils/isArrayWithValues';

const UploadMediaDialog = ({ open, onClose, onSubmit, isLoading }) => {
  const [payload, setPayload] = useState({
    category_id: '',
    folder_id: '',
    description: '',
    files: [],
  });

  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Allowed file types
  const allowedFileTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];

  const allowedFileExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'];

  const { documentsMeta, folders } = useDocuments();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const validateFile = (file) => {
    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      // Also check file extension as fallback
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedFileExtensions.includes(fileExtension)) {
        return `File "${file.name}" is not allowed. Only JPG, PNG, PDF, DOC, DOCX, XLS, XLSX, TXT files are allowed.`;
      }
    }
    return null;
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    let validFiles = [];
    let validationErrors = [];

    newFiles.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        validationErrors.push(validationError);
      } else {
        const fileWithId = {
          file,
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
        };
        validFiles.push(fileWithId);
      }
    });

    if (validationErrors.length > 0) {
      setErrors((prev) => ({ ...prev, files: validationErrors.join(' ') }));
    } else {
      setErrors((prev) => ({ ...prev, files: null }));
    }

    if (validFiles.length > 0) {
      setPayload((prev) => ({ ...prev, files: [...prev.files, ...validFiles] }));
    }
  };

  const removeFile = (fileId) => {
    setPayload((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.id !== fileId),
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!payload.category_id)
      newErrors.category_id = 'Please select a category';
    if (!payload.folder_id) newErrors.folder_id = 'Please select a folder';
    if (!payload.description.trim())
      newErrors.description = 'Description is required';
    if (payload.files.length === 0)
      newErrors.files = 'Please select at least one file';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Upload the payload directly since onSubmit expects the full payload
      await onSubmit(payload);
      // Only close dialog and reset on successful upload
      setPayload({
        category_id: '',
        folder_id: '',
        description: '',
        files: [],
      });
      setErrors({});
      onClose();
    } catch (error) {
      // Show specific error message from API if available
      const errorMessage = error?.message || 'Error uploading files. Please try again.';
      setErrors({ global: errorMessage });
      // Don't close dialog on error - let user see the error and decide what to do
    }
  };

  const handleClose = () => {
    setPayload({ category_id: '', folder_id: '', description: '', files: [] });
    setErrors({});
    setDragActive(false);
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 9998 }}
    >
      <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] min-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3">
          <h1 className="text-xl text-[#40444D] text-center font-bold font-sans flex items-center gap-2">
            <Upload className="text-[#6366F1]" />
            Upload Media
          </h1>
          <IconButton onClick={handleClose}>
            <X className="text-black" />
          </IconButton>
        </div>

        <Divider />

        {/* Scrollable Content Area */}
        <div className="space-y-6 flex-1 overflow-auto p-6 no-scrollbar">
          {/* Category */}
          <div className="w-full">
            <Label className="text-[#40444D] font-semibold mb-2 block">
              Category
            </Label>
            <Select
              value={payload.category_id}
              onValueChange={(val) =>
                setPayload((prev) => ({ ...prev, category_id: val }))
              }
            >
              <SelectTrigger
                className={`w-full ${
                  errors.category_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                portal={false}
                className="z-[9999]"
              >
                <SelectGroup>
                  {isArrayWithValues(documentsMeta) &&
                    documentsMeta.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>
            )}
          </div>

          {/* Drag & Drop Area */}
          <div className="w-full">
            <Label className="text-[#40444D] font-semibold mb-2 block">
              Drag & Drop Files
            </Label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
                ${
                  dragActive
                    ? 'border-[#6366F1] bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-[#6366F1] hover:bg-gray-50'
                }
              `}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUpload className="text-[#6366F1] mb-4 mx-auto" size={48} />
              <h3 className="text-lg font-semibold text-[#40444D] mb-2">
                Drop files here or click to browse
              </h3>
                          <p className="text-sm text-gray-600">
              Support for multiple files
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Allowed file types: JPG, PNG, PDF, DOC, DOCX, XLS, XLSX, TXT
            </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              style={{ display: 'none' }}
              onChange={(e) => handleFiles(e.target.files)}
            />

            {/* File List */}
            {payload.files.length > 0 && (
              <div className="mt-2 space-y-2 overflow-y-auto">
                {payload.files.map((fileItem) => (
                  <div
                    key={fileItem.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="text-gray-600" />
                      <div>
                        <p className="font-medium text-[#40444D]">
                          {fileItem.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(fileItem.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeFile(fileItem.id)}
                      disabled={isLoading}
                      className="bg-red-100 text-red-600 hover:bg-red-200 p-2 h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {errors.files && (
              <p className="text-xs text-red-500 mt-1">{errors.files}</p>
            )}

            {isLoading && (
              <div className="space-y-2">
                <p className="text-sm text-[#40444D] font-medium">
                  Uploading files...
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#6366F1] h-2 rounded-full animate-pulse"
                    style={{ width: '70%' }}
                  ></div>
                </div>
              </div>
            )}

            {errors.global && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.global}</p>
              </div>
            )}
          </div>

          {/* Folder */}
          <div className="w-full">
            <Label className="text-[#40444D] font-semibold mb-2 block">
              Folder
            </Label>
            <Select
              value={payload.folder_id}
              onValueChange={(val) =>
                setPayload((prev) => ({ ...prev, folder_id: val }))
              }
            >
              <SelectTrigger
                className={`w-full ${
                  errors.folder_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <SelectValue placeholder="Select a folder" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                portal={false}
                className="z-[9999]"
              >
                {isArrayWithValues(folders) &&
                  folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.folder_id && (
              <p className="text-xs text-red-500 mt-1">{errors.folder_id}</p>
            )}
          </div>

          {/* Description */}
          <div className="w-full">
            <Label className="text-[#40444D] font-semibold mb-2 block">
              Description
            </Label>
            <Input
              placeholder="Enter description"
              disabled={isLoading}
              value={payload.description}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, description: e.target.value }))
              }
              className={`w-full ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>
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
            onClick={handleSubmit}
            className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
            disabled={isLoading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isLoading
              ? 'Uploading...'
              : `Upload ${payload.files.length} File${
                  payload.files.length !== 1 ? 's' : ''
                }`}
          </Button>
        </div>
      </Stack>
    </Dialog>
  );
};

export default UploadMediaDialog;
