import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Dialog,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Upload,
  FileText,
  Trash2,
  CloudUpload,
  X,
  Search
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const UploadFileDialog = ({ open, onClose, onSubmit, isLoading, categories = [] }) => {
  const [files, setFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [selectOpen, setSelectOpen] = useState(false);
  const searchInputRef = useRef(null);

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

  // Set first category as default when categories change or component mounts
  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0].id?.toString() || '');
    }
  }, [categories]);

  // Auto-focus search input when Select opens
  useEffect(() => {
    if (selectOpen && searchInputRef.current) {
      // Longer delay to ensure the SelectContent is fully rendered and stable
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          // Prevent any default Select behavior
          searchInputRef.current.select();
        }
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [selectOpen]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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
          type: file.type
        };
        validFiles.push(fileWithId);
      }
    });

    if (validationErrors.length > 0) {
      setError(validationErrors.join(' '));
    } else {
      setError('');
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    if (!selectedCategory) {
      setError('Please select a document category');
      return;
    }

    try {
      for (const fileItem of files) {
        await onSubmit(fileItem.file, selectedCategory);
      }
      // Only close dialog and reset on successful upload
      setFiles([]);
      // Reset to first category
      setSelectedCategory(categories.length > 0 ? categories[0].id?.toString() || '' : '');
      setError('');
      onClose();
    } catch (error) {
      // Show specific error message from API if available
      const errorMessage = error?.message || 'Error uploading files. Please try again.';
      setError(errorMessage);
      // Don't close dialog on error - let user see the error and decide what to do
    }
  };

  const handleClose = () => {
    setFiles([]);
    // Reset to first category
    setSelectedCategory(categories.length > 0 ? categories[0].id?.toString() || '' : '');
    setCategorySearchTerm('');
    setSelectOpen(false);
    setError('');
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

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth sx={{ zIndex: 9998 }}>
      <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3">
          <h1 className="text-xl text-[#40444D] text-center font-bold font-sans flex items-center gap-2">
            <Upload className="text-[#6366F1]" />
            Upload Files
          </h1>
          <IconButton onClick={handleClose}>
            <X className="text-black" />
          </IconButton>
        </div>

        <Divider />

        {/* Scrollable Content Area */}
        <div className="space-y-6 flex-1 overflow-auto p-6 no-scrollbar">
          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
              ${dragActive
                ? 'border-[#6366F1] bg-blue-50'
                : 'border-gray-300 bg-white hover:border-[#6366F1] hover:bg-gray-50'
              }
            `}
            onClick={() => document.getElementById('file-input').click()}
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
            id="file-input"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            style={{ display: 'none' }}
            onChange={(e) => handleFiles(e.target.files)}
          />

          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-[#40444D] font-semibold">
              Document Category *
            </Label>
            {categories.length === 0 ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  No categories available. Please contact your administrator.
                </p>
              </div>
            ) : (
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
                onOpenChange={setSelectOpen}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {/* Search Input Inside Dropdown */}
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                      <Input
                        ref={searchInputRef}
                        placeholder="Search categories..."
                        value={categorySearchTerm}
                        onChange={(e) => setCategorySearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          // Prevent Select from handling arrow keys and enter
                          if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
                            e.stopPropagation();
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.currentTarget.focus();
                        }}
                        className="pl-6 h-8 text-sm border-0 focus:ring-0 focus:border-0"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Category List */}
                  {filteredCategories.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500 text-center">
                      No categories found
                    </div>
                  ) : (
                    filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label className="text-[#40444D] font-semibold">
                Selected Files ({files.length})
              </Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((fileItem) => (
                  <div
                    key={fileItem.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="text-gray-600" />
                      <div>
                        <p className="font-medium text-[#40444D]">{fileItem.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(fileItem.size)}</p>
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
            </div>
          )}

          {isLoading && (
            <div className="space-y-2">
              <p className="text-sm text-[#40444D] font-medium">Uploading files...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#6366F1] h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
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
            disabled={isLoading || files.length === 0}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isLoading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </Stack>
    </Dialog>
  );
};

export default UploadFileDialog; 