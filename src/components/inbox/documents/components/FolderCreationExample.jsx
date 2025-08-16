import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDocuments } from '../hooks/useDocuments';

/**
 * Example component demonstrating folder creation at different levels
 * This is for demonstration purposes - you can use these patterns in your actual components
 */
const FolderCreationExample = () => {
  const { handleCreateFolder } = useDocuments();
  const [folderName, setFolderName] = useState('');
  const [message, setMessage] = useState('');

  const createInCurrentContext = async () => {
    if (!folderName.trim()) {
      setMessage('Please enter a folder name');
      return;
    }
    
    try {
      await handleCreateFolder(folderName.trim());
      setMessage(`Created folder "${folderName}" successfully`);
      setFolderName('');
    } catch (error) {
      setMessage(`Error creating folder: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Folder Creation Example</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="folderName">Folder Name</Label>
          <Input
            id="folderName"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={createInCurrentContext}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create Folder
        </Button>
      </div>

      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.includes('Error') 
            ? 'bg-red-100 text-red-700 border border-red-200' 
            : 'bg-green-100 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      <div className="text-xs text-gray-600 space-y-2">
        <p><strong>How it works:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Creates folder in current navigation context</li>
          <li>At root level: Creates main folder</li>
          <li>Inside folder: Creates subfolder automatically</li>
        </ul>
        
        <div className="mt-3 p-2 bg-gray-50 rounded">
          <p className="font-semibold">Simplified API:</p>
          <code className="text-xs">
            handleCreateFolder("New Folder Name")
          </code>
        </div>
      </div>
    </div>
  );
};

export default FolderCreationExample; 