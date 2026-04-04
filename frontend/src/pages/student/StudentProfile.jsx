import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ImageUpload from '../../components/ui/ImageUpload';
import { KeyRound, User } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const StudentProfile = () => {
  const { user, updateProfile } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    setValue
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setProfilePhoto(user.profilePhoto || null);
    }
  }, [user, setValue]);

  const onProfileSubmit = async (data) => {
    setIsUpdatingProfile(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (profilePhoto instanceof File) {
        formData.append('profilePhoto', profilePhoto);
      }

      const res = await authService.updateProfile(formData);
      updateProfile(res.user);
      setProfilePhoto(res.user.profilePhoto);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setIsUpdatingPassword(true);
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      toast.success('Password changed successfully');
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-dark-900">Account Settings</h1>
        <p className="mt-2 text-sm text-dark-500">Manage your profile and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-dark-900 flex items-center gap-2">
            <User className="h-5 w-5 text-primary-500" />
            Profile Details
          </h3>
          <p className="mt-1 text-sm text-dark-500">
            Update your public facing information.
          </p>
        </div>
        
        <div className="md:col-span-2">
          <form className="card p-6 shadow-sm" onSubmit={handleSubmitProfile(onProfileSubmit)}>
            <div className="mb-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div className="w-full sm:w-1/3">
                <ImageUpload
                  value={profilePhoto}
                  onChange={setProfilePhoto}
                  maxSizeMB={2}
                  className="mb-0"
                />
              </div>
              <div className="w-full sm:w-2/3 space-y-4">
                <div>
                  <label className="label-text">Student ID</label>
                  <input type="text" className="input-field bg-dark-50 text-dark-500 cursor-not-allowed" value={user?.studentId} disabled />
                </div>
                <div>
                  <label className="label-text">Email</label>
                  <input type="text" className="input-field bg-dark-50 text-dark-500 cursor-not-allowed" value={user?.email} disabled />
                </div>
                <Input
                  id="name"
                  label="Full Name *"
                  type="text"
                  {...registerProfile('name')}
                  error={profileErrors.name?.message}
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-dark-100">
              <Button type="submit" isLoading={isUpdatingProfile}>Save Profile</Button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true"><div className="py-2"><div className="border-t border-dark-200" /></div></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-dark-900 flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary-500" />
            Security
          </h3>
          <p className="mt-1 text-sm text-dark-500">
            Ensure your account is using a long, random password to stay secure.
          </p>
        </div>
        
        <div className="md:col-span-2">
          <form className="card p-6 shadow-sm space-y-4" onSubmit={handleSubmitPassword(onPasswordSubmit)}>
            <Input
              id="currentPassword"
              label="Current Password"
              type="password"
              {...registerPassword('currentPassword')}
              error={passwordErrors.currentPassword?.message}
            />
            <Input
              id="newPassword"
              label="New Password"
              type="password"
              {...registerPassword('newPassword')}
              error={passwordErrors.newPassword?.message}
            />
            <Input
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              {...registerPassword('confirmPassword')}
              error={passwordErrors.confirmPassword?.message}
            />
            
            <div className="flex justify-end pt-4 border-t border-dark-100">
              <Button type="submit" variant="secondary" isLoading={isUpdatingPassword}>Update Password</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
