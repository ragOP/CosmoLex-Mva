import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Upload,
  FileText,
  Image,
  Video,
  FileText as PdfIcon,
  FileText as DocumentIcon,
  Trash2,
  Eye,
} from 'lucide-react';

const FileUpload = ({
  files = [],
  onChange,
  multiple = true,
  accept = '*/*',
  maxSize = 10 * 1024 * 1024, // 10MB default
  label = 'Upload Files',
  disabled = false,
  showPreview = true,
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

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
    if (file.size > maxSize) {
      return `File "${
        file.name
      }" is too large. Maximum size is ${formatFileSize(maxSize)}.`;
    }
    return null;
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    let validFiles = [];
    let errors = [];

    newFiles.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        const fileWithPreview = {
          file,
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : null,
        };
        validFiles.push(fileWithPreview);
      }
    });

    if (errors.length > 0) {
      setError(errors.join(' '));
    } else {
      setError('');
    }

    if (validFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
      onChange(updatedFiles);
    }
  };

  const removeFile = (fileId) => {
    const updatedFiles = files.filter((f) => f.id !== fileId);
    onChange(updatedFiles);

    // Revoke object URL to prevent memory leaks
    const fileToRemove = files.find((f) => f.id === fileId);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/'))
      return <Image className="text-blue-500 h-5 w-5" />;
    if (fileType.startsWith('video/'))
      return <Video className="text-purple-500 h-5 w-5" />;
    if (fileType === 'application/pdf')
      return <PdfIcon className="text-red-500 h-5 w-5" />;
    if (fileType.includes('document') || fileType.includes('text'))
      return <DocumentIcon className="text-green-500 h-5 w-5" />;
    return <FileText className="text-gray-500 h-5 w-5" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const previewFile = (file) => {
    if (file.preview) {
      window.open(file.preview, '_blank');
    } else if (file.file) {
      const url = URL.createObjectURL(file.file);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <Label className="text-[#40444D] font-semibold block">{label}</Label>
      )}

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer
          ${
            dragActive
              ? 'border-[#6366F1] bg-blue-50'
              : 'border-gray-300 bg-white hover:border-[#6366F1] hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="text-[#6366F1] mb-3 mx-auto h-10 w-10" />
        <h3 className="text-base font-medium text-[#40444D] mb-1">
          {dragActive
            ? 'Drop files here'
            : 'Drop files here or click to browse'}
        </h3>
        <p className="text-sm text-gray-600">
          {multiple ? 'Support for multiple files' : 'Single file upload'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Maximum file size: {formatFileSize(maxSize)}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-[#40444D] font-semibold">
              Selected Files ({files.length})
            </Label>
            {files.length > 1 && (
              <Button
                type="button"
                onClick={() => onChange([])}
                className="text-xs bg-red-100 text-red-600 hover:bg-red-200 h-6 px-2"
                disabled={disabled}
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow"
              >
                {/* File Icon/Preview */}
                <div className="flex-shrink-0">
                  {showPreview && fileItem.preview ? (
                    <img
                      src={fileItem.preview}
                      alt={fileItem.name}
                      className="w-10 h-10 object-cover rounded cursor-pointer"
                      onClick={() => previewFile(fileItem)}
                    />
                  ) : (
                    getFileIcon(fileItem.type)
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-medium text-[#40444D] truncate"
                    title={fileItem.name}
                  >
                    {fileItem.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(fileItem.size)} •{' '}
                    {fileItem.type || 'Unknown type'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {showPreview && (
                    <Button
                      type="button"
                      onClick={() => previewFile(fileItem)}
                      className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-1 h-7 w-7"
                      disabled={disabled}
                      title="Preview"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={() => removeFile(fileItem.id)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 p-1 h-7 w-7"
                    disabled={disabled}
                    title="Remove"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
