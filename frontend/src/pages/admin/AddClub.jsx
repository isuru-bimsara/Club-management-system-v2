import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import clubService from '../../services/clubService';
import adminService from '../../services/adminService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ImageUpload from '../../components/ui/ImageUpload';

const addClubSchema = z.object({
  clubName: z
    .string()
    .min(2, 'Club name is required')
    .regex(/^[a-zA-Z\s]+$/, 'Club name can only contain letters and spaces'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  presidentId: z.string().min(1, 'Please select a president'),
});

const AddClub = () => {
  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addClubSchema),
  });

  useEffect(() => {
    const fetchEligibleStudents = async () => {
      try {
        const response = await adminService.getUsers({ role: 'student', status: 'active', limit: 1000 });
        setStudents(response.data);
      } catch (error) {
        toast.error('Failed to load eligible students for president role');
      } finally {
        setIsLoadingStudents(false);
      }
    };
    fetchEligibleStudents();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('clubName', data.clubName);
      formData.append('description', data.description);
      formData.append('president', data.presidentId);
      
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      
      if (coverFile) {
        formData.append('coverPhoto', coverFile);
      }

      await toast.promise(
        clubService.createClub(formData),
        {
          loading: 'Creating club...',
          success: 'Club created successfully!',
          error: (err) => err.response?.data?.message || 'Failed to create club'
        }
      );
      
      navigate('/admin/clubs');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/clubs')}
          className="rounded-full p-2 text-dark-400 hover:bg-dark-100 hover:text-dark-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Add New Club</h1>
          <p className="text-sm text-dark-500">Create a new student organization</p>
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="clubName"
            label="Club Name *"
            type="text"
            placeholder="e.g. FOSS SLIIT"
            {...register('clubName')}
            error={errors.clubName?.message}
          />

          <div className="mb-4 w-full">
            <label htmlFor="description" className="label-text">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              className={`input-field ${errors.description ? 'ring-red-500 focus:ring-red-500' : ''}`}
              placeholder="Tell us about the club..."
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="mb-4 w-full">
            <label htmlFor="presidentId" className="label-text">
              Assign President *
            </label>
            <select
              id="presidentId"
              className={`input-field ${errors.presidentId ? 'ring-red-500 focus:ring-red-500' : ''}`}
              disabled={isLoadingStudents}
              {...register('presidentId')}
            >
              <option value="">Select a student...</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.studentId})
                </option>
              ))}
            </select>
            {errors.presidentId && (
              <p className="mt-1 text-sm text-red-600">{errors.presidentId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-4">
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

          <div className="pt-6 border-t border-dark-100 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate('/admin/clubs')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Club
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClub;
