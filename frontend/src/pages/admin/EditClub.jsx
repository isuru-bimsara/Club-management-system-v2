import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import Spinner from '../../components/ui/Spinner';

const editClubSchema = z.object({
  clubName: z
    .string()
    .min(2, 'Club name is required')
    .regex(/^[a-zA-Z\s]+$/, 'Club name can only contain letters and spaces'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  presidentId: z.string().min(1, 'Please select a president'),
});

const EditClub = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editClubSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clubRes, usersRes] = await Promise.all([
          clubService.getClubById(id),
          adminService.getUsers({ role: 'student', status: 'active', limit: 1000 })
        ]);
        
        const clubData = clubRes;
        setClub(clubData);
        
        let availableStudents = usersRes.data;
        // Ensure current president is in the list even if they were changed to 'president' role
        if (clubData.president && !availableStudents.find(s => s._id === clubData.president._id)) {
          availableStudents.push(clubData.president);
        }
        setStudents(availableStudents);

        setValue('clubName', clubData.clubName);
        setValue('description', clubData.description);
        setValue('presidentId', clubData.president?._id || '');
        
        setLogoFile(clubData.logo || null);
        setCoverFile(clubData.coverPhoto || null);

      } catch (error) {
        toast.error('Failed to load club data');
        navigate('/admin/clubs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, setValue, navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('clubName', data.clubName);
      formData.append('description', data.description);
      formData.append('president', data.presidentId);
      
      // Only append if it's a new file (not the existing string URL)
      if (logoFile instanceof File) {
        formData.append('logo', logoFile);
      }
      
      if (coverFile instanceof File) {
        formData.append('coverPhoto', coverFile);
      }

      await toast.promise(
        clubService.updateClub(id, formData),
        {
          loading: 'Updating club...',
          success: 'Club updated successfully!',
          error: (err) => err.response?.data?.message || 'Failed to update club'
        }
      );
      
      navigate('/admin/clubs');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
  }

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
          <h1 className="text-2xl font-bold text-dark-900">Edit Club</h1>
          <p className="text-sm text-dark-500">Update information for {club?.clubName}</p>
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
            <p className="text-xs text-dark-500 mt-1">Changing the president will update user roles automatically.</p>
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
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClub;
