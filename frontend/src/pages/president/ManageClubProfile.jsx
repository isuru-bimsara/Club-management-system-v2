import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import clubService from '../../services/clubService';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ImageUpload from '../../components/ui/ImageUpload';
import Spinner from '../../components/ui/Spinner';

const updateClubSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

const ManageClubProfile = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [club, setClub] = useState(null);
  const [clubId, setClubId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(updateClubSchema),
  });

  useEffect(() => {
    const fetchClubInfo = async () => {
      try {
        const queryParams = (user.role === 'admin' || user.role === 'superadmin') ? { limit: 100 } : { presidentId: user._id };
        const response = await clubService.getClubs(queryParams);
        if (response.data && response.data.length > 0) {
          setClubs(response.data);
          let myClub = response.data[0];
          if (clubId) {
             myClub = response.data.find(c => c._id === clubId) || myClub;
          } else {
             setClubId(myClub._id);
          }
          setClub(myClub);
          setValue('description', myClub.description);
          setLogoFile(myClub.logo || null);
          setCoverFile(myClub.coverPhoto || null);
        }
      } catch (error) {
        toast.error('Failed to load club details');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchClubInfo();
    }
  }, [user, clubId, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('description', data.description);
      
      if (logoFile instanceof File) {
        formData.append('logo', logoFile);
      }
      
      if (coverFile instanceof File) {
        formData.append('coverPhoto', coverFile);
      }

      await toast.promise(
        clubService.updateClub(club._id, formData),
        {
          loading: 'Updating profile...',
          success: 'Club profile updated successfully!',
          error: (err) => err.response?.data?.message || 'Failed to update profile'
        }
      );
      
      // Refresh club data
      const updatedResponse = await clubService.getClubById(club._id);
      setClub(updatedResponse);
      setLogoFile(updatedResponse.logo || null);
      setCoverFile(updatedResponse.coverPhoto || null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (!club) {
    return <div className="p-8 text-center text-dark-500">No club assigned.</div>;
  }

  const hasFilesChanged = logoFile instanceof File || coverFile instanceof File;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Manage Club Profile</h1>
        <div className="mt-1 flex items-center gap-2">
            <p className="text-sm text-dark-500">Update your club's public information and images.</p>
            {(user.role === 'admin' || user.role === 'superadmin') && clubs.length > 0 && (
              <select
                className="ml-2 text-sm border-dark-200 rounded-md bg-white py-1 px-2 text-dark-900 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={clubId || ''}
                onChange={(e) => setClubId(e.target.value)}
              >
                {clubs.map(c => (
                  <option key={c._id} value={c._id}>{c.clubName}</option>
                ))}
              </select>
            )}
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-4">
            <label className="label-text">Club Name</label>
            <div className="p-3 bg-dark-50 border border-dark-200 rounded-lg text-dark-900 font-medium">
              {club.clubName}
            </div>
            <p className="text-xs text-dark-500 mt-1">Club name can only be changed by system administrators.</p>
          </div>

          <div className="mb-4 w-full">
            <label htmlFor="description" className="label-text">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              className={`input-field ${errors.description ? 'ring-red-500 focus:ring-red-500' : ''}`}
              placeholder="Tell students what your club is about..."
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-4 border-t border-dark-100">
            <div>
              <ImageUpload
                label="Club Logo"
                value={logoFile}
                onChange={setLogoFile}
                maxSizeMB={2}
              />
            </div>
            <div>
              <ImageUpload
                label="Cover Photo"
                value={coverFile}
                onChange={setCoverFile}
                maxSizeMB={5}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-dark-100 flex justify-end">
            <Button 
              type="submit" 
              isLoading={isSubmitting}
              disabled={!isDirty && !hasFilesChanged}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageClubProfile;
