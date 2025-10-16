/**
 * User Profile Page
 *
 * This page allows users to view and edit their profile information.
 * Features include:
 * - View profile information
 * - Edit personal details
 * - Change password
 * - Update profile picture
 * - View account activity
 * - Security settings
 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Key,
  Camera,
  Save,
  Edit3,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BACKEND_URL } from '@/api/endpoint';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { isMobile } from '@/utils/isMobile';
import formatDate from '@/utils/formatDate';
import { useProfile } from '@/hooks/useProfile';
import { getProfilePictureUrl, getUserInitials } from '@/utils/profilePicture';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Use the custom profile hook
  const {
    profileData,
    updateProfileMutation,
    changePasswordMutation,
    selectedProfileFile,
    profilePreviewUrl,
    handleFileSelection,
    clearFileSelection,
    updateProfileWithFile,
    isUpdatingProfile,
    isChangingPassword,
  } = useProfile();

  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [showPassword, setShowPassword] = useState(false); // current password toggle (commented out)

  // Form data
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    street_number: '',
    street_name: '',
    unit_number: '',
    city: '',
    province: '',
    postal_code: '',
    country: '',
    country_code: '',
    two_factor_enabled: false,
  });

  // Password change form
  const [passwordData, setPasswordData] = useState({
    // current_password: '', // commented out, keeping only new + confirm
    new_password: '',
    confirm_password: '',
  });

  // Initialize form data with profile data
  useEffect(() => {
    if (profileData) {
      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        email: profileData.email || '',
        phone_number: profileData.phone_number || '',
        street_number: profileData.street_number || '',
        street_name: profileData.street_name || '',
        unit_number: profileData.unit_number || '',
        city: profileData.city || '',
        province: profileData.province || '',
        postal_code: profileData.postal_code || '',
        country: profileData.country || '',
        country_code: profileData.country_code || '',
        two_factor_enabled: profileData.two_factor_enabled || false,
      });
    }
  }, [profileData]);

  // Clear messages after timeout
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 7000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Cleanup preview URL on component unmount
  useEffect(() => {
    return () => {
      if (profilePreviewUrl) {
        URL.revokeObjectURL(profilePreviewUrl);
      }
    };
  }, [profilePreviewUrl]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setError('');
    setMessage('');

    try {
      await updateProfileWithFile(formData, profileData.id);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      setError(
        error.message ||
          'An error occurred while updating your profile. Please try again.'
      );
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    setError('');

    try {
      await changePasswordMutation.mutateAsync({
        // current_password: passwordData.current_password, // commented out
        password: passwordData.new_password,
        password_confirmation: passwordData.confirm_password,
        user_id: profileData.id,
      });

      setPasswordData({
        // current_password: '', // commented out
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      console.error('Password change error:', error);
      setError(
        error.message ||
          'An error occurred while changing your password. Please try again.'
      );
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      first_name: profileData.first_name || '',
      last_name: profileData.last_name || '',
      email: profileData.email || '',
      phone_number: profileData.phone_number || '',
      street_number: profileData.street_number || '',
      street_name: profileData.street_name || '',
      unit_number: profileData.unit_number || '',
      city: profileData.city || '',
      province: profileData.province || '',
      postal_code: profileData.postal_code || '',
      country: profileData.country || '',
      country_code: profileData.country_code || '',
      two_factor_enabled: profileData.two_factor_enabled || false,
    });
    setError('');
    setMessage('');
    // Clean up file selection and preview
    clearFileSelection();
  };

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            User Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            Please log in to view your profile.
          </p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const fullName = `${profileData.first_name || ''} ${
    profileData.last_name || ''
  }`.trim();
  const profilePictureSrc = getProfilePictureUrl(profileData.profile_picture);
  const fullAddress = [
    profileData.street_number,
    profileData.street_name,
    profileData.unit_number,
    profileData.city,
    profileData.province,
    profileData.postal_code,
    profileData.country,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="flex flex-col space-y-6 overflow-y-auto overflow-x-hidden no-scrollbar p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[32px] text-[#1E293B] font-bold font-sans">
          My Profile
        </h2>
        <div className="flex items-center space-x-4">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
              icon={Edit3}
              iconPosition="left"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex items-center gap-2"
                icon={X}
                iconPosition="left"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={isUpdatingProfile}
                className="flex items-center gap-2"
                icon={Save}
                iconPosition="left"
              >
                {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Alert Messages */}
      {(error || message) && (
        <div className="flex justify-center w-full">
          <div className="flex flex-col items-center">
            {error && (
              <Alert
                color="error"
                className="w-fit rounded-xl md:rounded-2xl max-w-md"
              >
                {error}
              </Alert>
            )}
            {message && (
              <Alert
                color="success"
                className="w-fit rounded-xl md:rounded-2xl max-w-md"
              >
                {message}
              </Alert>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <div className="lg:col-span-1">
          <Card className="bg-white/30 backdrop-blur-sm border border-gray-100 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24 text-2xl font-semibold">
                    {(profilePreviewUrl || profileData.profile_picture) && (
                      <AvatarImage
                        src={
                          profilePreviewUrl ||
                          profilePictureSrc ||
                          profileData.profile_picture
                        }
                        alt={fullName}
                      />
                    )}
                    <AvatarFallback>
                      {getUserInitials(
                        profileData.first_name,
                        profileData.last_name
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <>
                      <input
                        id="profile_picture_input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (file) {
                            handleFileSelection(file);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        aria-label="Change profile picture"
                        className="absolute -bottom-2 -right-2 rounded-full z-10"
                        onClick={() =>
                          document
                            .getElementById('profile_picture_input')
                            ?.click()
                        }
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {fullName}
                  </h3>
                  <p className="text-gray-600">{profileData.email}</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge
                    variant={profileData.is_active ? 'default' : 'secondary'}
                  >
                    {profileData.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge
                    variant={
                      profileData.email_verified_at ? 'default' : 'outline'
                    }
                  >
                    {profileData.email_verified_at ? 'Verified' : 'Unverified'}
                  </Badge>
                  <Badge
                    variant={
                      profileData.two_factor_enabled ? 'default' : 'outline'
                    }
                  >
                    {profileData.two_factor_enabled ? '2FA On' : '2FA Off'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>
                    <strong>Member since:</strong>{' '}
                    {formatDate(profileData.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>
                    <strong>Last login:</strong>{' '}
                    {profileData.last_login_at
                      ? formatDate(profileData.last_login_at)
                      : 'Never'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-white/30 backdrop-blur-sm border border-gray-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) =>
                      handleInputChange('first_name', e.target.value)
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) =>
                      handleInputChange('last_name', e.target.value)
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) =>
                    handleInputChange('phone_number', e.target.value)
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="bg-white/30 backdrop-blur-sm border border-gray-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="street_number">Street Number</Label>
                  <Input
                    id="street_number"
                    value={formData.street_number}
                    onChange={(e) =>
                      handleInputChange('street_number', e.target.value)
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="street_name">Street Name</Label>
                  <Input
                    id="street_name"
                    value={formData.street_name}
                    onChange={(e) =>
                      handleInputChange('street_name', e.target.value)
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="unit_number">Unit Number</Label>
                  <Input
                    id="unit_number"
                    value={formData.unit_number}
                    onChange={(e) =>
                      handleInputChange('unit_number', e.target.value)
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="province">Province/State</Label>
                  <Input
                    id="province"
                    value={formData.province}
                    onChange={(e) =>
                      handleInputChange('province', e.target.value)
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) =>
                      handleInputChange('postal_code', e.target.value)
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange('country', e.target.value)
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-white/30 backdrop-blur-sm border border-gray-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two_factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="two_factor"
                    checked={!!formData.two_factor_enabled}
                    onCheckedChange={(checked) =>
                      handleInputChange('two_factor_enabled', Boolean(checked))
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor="two_factor" className="text-sm text-gray-700">
                    {formData.two_factor_enabled ? 'Enabled' : 'Disabled'}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="bg-white/30 backdrop-blur-sm border border-gray-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div>
                <Label htmlFor="current_password">Current Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="current_password"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.current_password}
                    onChange={(e) =>
                      handlePasswordChange('current_password', e.target.value)
                    }
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div> */}
              <div>
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="new_password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.new_password}
                    onChange={(e) =>
                      handlePasswordChange('new_password', e.target.value)
                    }
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirm_password}
                    onChange={(e) =>
                      handlePasswordChange('confirm_password', e.target.value)
                    }
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleChangePassword}
                disabled={
                  isChangingPassword ||
                  !passwordData.new_password ||
                  !passwordData.confirm_password
                }
                className="w-full"
                icon={Key}
                iconPosition="left"
              >
                {isChangingPassword
                  ? 'Changing Password...'
                  : 'Change Password'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
