import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  UploadFile, 
  InsertDriveFile, 
  Delete,
  CloudUpload
} from '@mui/icons-material';

const UploadFileDialog = ({ open, onClose, onSubmit, isLoading, currentFolderName }) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

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

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    setError('');
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }
    
    try {
      for (const fileItem of files) {
        await onSubmit(fileItem.file);
      }
      setFiles([]);
      onClose();
    } catch {
      setError('Error uploading files. Please try again.');
    }
  };

  const handleClose = () => {
    setFiles([]);
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#F5F5FA] rounded-lg w-full max-w-2xl p-6 space-y-6 shadow-[0px_4px_24px_0px_#000000] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#40444D] text-center font-bold font-sans flex items-center justify-center gap-2">
            <UploadFile className="text-[#6366F1]" />
            Upload Files
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {currentFolderName && (
            <div className="text-sm text-[#40444D] bg-white p-3 rounded-lg border">
              <span className="font-semibold">Uploading to: </span>
              <span className="text-[#6366F1] font-medium">{currentFolderName}</span>
            </div>
          )}
          
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
            <CloudUpload className="text-[#6366F1] mb-4" style={{ fontSize: 48 }} />
            <h3 className="text-lg font-semibold text-[#40444D] mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-sm text-gray-600">
              Support for multiple files
            </p>
          </div>
          
          <input
            id="file-input"
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFiles(e.target.files)}
          />
          
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
                      <InsertDriveFile className="text-gray-600" />
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
                      <Delete className="h-4 w-4" />
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

        <DialogFooter className="pt-4 flex justify-end gap-4">
          <DialogClose asChild>
            <Button
              type="button"
              className="bg-gray-300 text-black hover:bg-gray-400 cursor-pointer"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={handleSubmit}
            className="bg-[#6366F1] text-white hover:bg-[#4e5564] cursor-pointer"
            disabled={isLoading || files.length === 0}
          >
            <UploadFile className="mr-2 h-4 w-4" />
            {isLoading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileDialog; 