import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import eventService from '../../services/eventService';
import clubService from '../../services/clubService';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ImageUpload from '../../components/ui/ImageUpload';
import Spinner from '../../components/ui/Spinner';
import { format } from 'date-fns';

const eventSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().min(1, 'Date is required').refine((val) => {
    const selectedDate = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, {
    message: "Event date cannot be in the past"
  }),
  time: z.string().min(1, 'Time is required'),
  venue: z.string().min(2, 'Venue is required'),
  totalTickets: z.coerce.number().min(1, 'Must have at least 1 ticket'),
  ticketPrice: z.coerce.number().min(0, 'Price cannot be negative'),
  reminderMinutes: z.coerce.number().int().min(0, 'Reminder cannot be negative').max(40320, 'Reminder must be within 4 weeks'),
});

const AddEditEvent = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const { user } = useAuth();
  
  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      totalTickets: 100,
      ticketPrice: 0,
      reminderMinutes: 30,
    }
  });

  useEffect(() => {
    const init = async () => {
      try {
        const queryOptions = (user?.role === 'admin' || user?.role === 'superadmin') ? { limit: 100 } : { presidentId: user?._id };
        const clubsRes = await clubService.getClubs(queryOptions);
        
        if (clubsRes.data) {
          setClubs(clubsRes.data);
          let initialClubId = null;
          const urlParams = new URLSearchParams(window.location.search);
          const specifiedClubId = urlParams.get('clubId');

          if (specifiedClubId) {
             initialClubId = specifiedClubId;
          } else if (clubsRes.data.length > 0) {
             initialClubId = clubsRes.data[0]._id;
          }
          setClubId(initialClubId);
        }

        if (isEditMode) {
          const eventData = await eventService.getEventById(id);
          setValue('title', eventData.title);
          setValue('description', eventData.description);
          setValue('date', format(new Date(eventData.date), 'yyyy-MM-dd'));
          setValue('time', eventData.time);
          setValue('venue', eventData.venue);
          setValue('totalTickets', eventData.totalTickets);
          setValue('ticketPrice', eventData.ticketPrice);
          setValue('reminderMinutes', eventData.reminderMinutes ?? 30);
          setBannerFile(eventData.bannerImage || null);
        }
      } catch (error) {
        toast.error('Failed to load data');
        if (isEditMode) navigate('/president/events');
      } finally {
        setIsLoading(false);
      }
    };
    if (user) init();
  }, [id, isEditMode, user, setValue, navigate]);

  const onSubmit = async (data) => {
    if (!clubId) {
      toast.error('You must be assigned to a club to create events.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('date', data.date);
      formData.append('time', data.time);
      formData.append('venue', data.venue);
      formData.append('totalTickets', data.totalTickets);
      formData.append('ticketPrice', data.ticketPrice);
      formData.append('reminderMinutes', data.reminderMinutes);
      
      if (!isEditMode) {
        formData.append('clubId', clubId);
      }
      
      if (bannerFile instanceof File) {
        formData.append('bannerImage', bannerFile);
      }

      await toast.promise(
        isEditMode 
          ? eventService.updateEvent(id, formData)
          : eventService.createEvent(formData),
        {
          loading: isEditMode ? 'Updating event...' : 'Creating event...',
          success: isEditMode ? 'Event updated successfully!' : 'Event created successfully!',
          error: (err) => err.response?.data?.message || 'Failed to save event'
        }
      );
      
      navigate('/president/events');
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
          onClick={() => navigate('/president/events')}
          className="rounded-full p-2 text-dark-400 hover:bg-dark-100 hover:text-dark-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-dark-900">{isEditMode ? 'Edit Event' : 'Create New Event'}</h1>
          <p className="text-sm text-dark-500">{isEditMode ? 'Update event details' : 'Publish a new event for your club'}</p>
        </div>
      </div>

      {(!isEditMode && (user?.role === 'admin' || user?.role === 'superadmin')) && (
        <div className="card p-6 sm:p-8 mb-4">
          <label className="label-text block mb-2">Select Club for Event *</label>
          <select
            className="w-full input-field"
            value={clubId || ''}
            onChange={(e) => setClubId(e.target.value)}
          >
            <option value="" disabled>Select a Club</option>
            {clubs.map(c => <option key={c._id} value={c._id}>{c.clubName}</option>)}
          </select>
        </div>
      )}

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="title"
            label="Event Title *"
            type="text"
            placeholder="e.g. Annual Tech Symposium"
            {...register('title')}
            error={errors.title?.message}
          />

          <div className="mb-4 w-full">
            <label htmlFor="description" className="label-text">
              Description *
            </label>
            <textarea
              id="description"
              rows={5}
              className={`input-field ${errors.description ? 'ring-red-500 focus:ring-red-500' : ''}`}
              placeholder="Provide all the details about your event..."
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
            <Input
              id="date"
              label="Date *"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              {...register('date')}
              error={errors.date?.message}
            />
            <Input
              id="time"
              label="Time *"
              type="time"
              {...register('time')}
              error={errors.time?.message}
            />
          </div>

          <Input
            id="venue"
            label="Venue *"
            type="text"
            placeholder="e.g. Main Auditorium"
            {...register('venue')}
            error={errors.venue?.message}
          />

          <Input
            id="reminderMinutes"
            label="Google Calendar Reminder (minutes)"
            type="number"
            min="0"
            max="40320"
            placeholder="30"
            {...register('reminderMinutes', { valueAsNumber: true })}
            error={errors.reminderMinutes?.message}
          />

          <div className="pt-4">
            <ImageUpload
              label="Event Banner Image"
              value={bannerFile}
              onChange={setBannerFile}
              maxSizeMB={5}
            />
          </div>

          <div className="pt-6 border-t border-dark-100 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate('/president/events')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditMode ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditEvent;
