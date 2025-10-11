import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/store/slices/authSlice';
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
} from '@/api/api_services/profile';
import { toast } from 'sonner';

export const useProfile = () => {
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const currentUser = user;

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: (profileData) => updateProfile(profileData),
    onSuccess: (updatedData) => {
      dispatch(setUser(updatedData));

   
      toast.success('Profile updated successfully!');

      setSelectedProfileFile(null);
      if (profilePreviewUrl) {
        URL.revokeObjectURL(profilePreviewUrl);
        setProfilePreviewUrl(null);
      }
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast.error(
        error.message ||
          'An error occurred while updating your profile. Please try again.'
      );
    },
  });

  // Mutation for changing password
  const changePasswordMutation = useMutation({
    mutationFn: (passwordData) => changePassword(passwordData),
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error) => {
      console.error('Password change error:', error);
      toast.error(
        error.message ||
          'An error occurred while changing your password. Please try again.'
      );
    },
  });

  // Mutation for uploading profile picture
  const uploadProfilePictureMutation = useMutation({
    mutationFn: (fileData) => uploadProfilePicture(fileData),
    onSuccess: (uploadData) => {
      // Update user in Redux store
      const updatedUser = {
        ...currentUser,
        profile_picture: uploadData.profile_picture,
      };
      dispatch(setUser(updatedUser));

      toast.success('Profile picture updated successfully!');
    },
    onError: (error) => {
      console.error('Profile picture upload error:', error);
      toast.error(
        error.message ||
          'An error occurred while uploading your profile picture. Please try again.'
      );
    },
  });

  // Helper functions
  const handleFileSelection = (file) => {
    if (file) {
      setSelectedProfileFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProfilePreviewUrl(previewUrl);
    }
  };

  const clearFileSelection = () => {
    setSelectedProfileFile(null);
    if (profilePreviewUrl) {
      URL.revokeObjectURL(profilePreviewUrl);
      setProfilePreviewUrl(null);
    }
  };

  const updateProfileWithFile = async (formData, userId) => {
    let payload;
    if (selectedProfileFile) {
      const fd = new FormData();
      Object.entries({ ...formData, user_id: userId }).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (typeof v === 'boolean') {
          fd.append(k, v ? '1' : '0');
          return;
        }
        fd.append(k, v);
      });
      fd.append('profile_picture', selectedProfileFile);
      payload = fd;
    } else {
      payload = { ...formData, user_id: userId };
    }

    return updateProfileMutation.mutateAsync(payload);
  };

  return {
    // Data
    profileData: currentUser,
    selectedProfileFile,
    profilePreviewUrl,

    // Mutations
    updateProfileMutation,
    changePasswordMutation,
    uploadProfilePictureMutation,

    // Helper functions
    handleFileSelection,
    clearFileSelection,
    updateProfileWithFile,

    // Loading states
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isUploadingPicture: uploadProfilePictureMutation.isPending,
  };
};
