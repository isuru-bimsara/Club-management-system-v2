import React, { useState, useEffect } from 'react';
import { Users, Mail, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import clubService from '../../services/clubService';
import notificationService from '../../services/notificationService';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { formatDateTime } from '../../utils/formatDate';

const ManageMembers = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const init = async () => {
      try {
        const queryParams = (user.role === 'admin' || user.role === 'superadmin') ? { limit: 100 } : { presidentId: user._id };
        const clubsRes = await clubService.getClubs(queryParams);
        if (clubsRes.data && clubsRes.data.length > 0) {
          setClubs(clubsRes.data);
          const activeClub = clubsRes.data[0];
          setClubId(activeClub._id);
          fetchMembers(activeClub._id, page);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    if (user) init();
  }, [user, page]);

  const fetchMembers = async (cId, currentPage = 1) => {
    setIsLoading(true);
    try {
      const response = await clubService.getClubMembers(cId, { page: currentPage, limit: 20 });
      setMembers(response.data);
      setTotalPages(response.totalPages);
      setPage(response.page);
    } catch (error) {
      toast.error('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBroadcastSubmit = async (data) => {
    if (!clubId) return;
    
    setIsBroadcasting(true);
    try {
      await notificationService.broadcastMessage({
        clubId,
        title: data.title,
        message: data.message
      });
      toast.success('Message broadcasted to all members successfully');
      setBroadcastModalOpen(false);
      reset();
    } catch (error) {
      toast.error('Failed to broadcast message');
    } finally {
      setIsBroadcasting(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (!clubId) {
    return <div className="p-8 text-center text-dark-500">No club assigned to this account.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Manage Members</h1>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm text-dark-500">View your club members and send announcements</p>
            {(user.role === 'admin' || user.role === 'superadmin') && clubs.length > 0 && (
              <select
                className="ml-2 text-sm border-dark-200 rounded-md bg-white py-1 px-2 text-dark-900 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={clubId}
                onChange={(e) => {
                  setClubId(e.target.value);
                  setPage(1);
                  fetchMembers(e.target.value, 1);
                }}
              >
                {clubs.map(c => (
                  <option key={c._id} value={c._id}>{c.clubName}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        <Button onClick={() => setBroadcastModalOpen(true)} className="flex items-center gap-2 shrink-0">
          <Bell className="h-4 w-4" />
          Broadcast Message
        </Button>
      </div>

      {members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members yet"
          description="Students can join your club from the club directory."
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-dark-200 bg-white shadow-sm">
            <table className="w-full whitespace-nowrap text-left text-sm text-dark-600">
              <thead className="bg-dark-50 text-dark-900 border-b border-dark-200">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Student Name</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Student ID</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Contact</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Joined At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200">
                {members.map((member) => (
                  <tr key={member._id} className="hover:bg-dark-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-dark-900 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center">
                        {member.name.charAt(0)}
                      </div>
                      {member.name}
                      {member._id === user._id && <span className="text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full ml-2">President</span>}
                    </td>
                    <td className="px-6 py-4">{member.studentId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-dark-400" />
                        <a href={`mailto:${member.email}`} className="text-primary-600 hover:underline">{member.email}</a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {/* Typically we'd want the joined date of the club-member relationship. 
                          Since it's an array of ObjectIds in the model, we don't have join date.
                          We'll just show the user's system join date or N/A. */}
                      {formatDateTime(member.createdAt, 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-white p-4 border border-dark-200 rounded-xl shadow-sm mt-4">
              <p className="text-sm text-dark-600">
                Page <span className="font-medium text-dark-900">{page}</span> of <span className="font-medium text-dark-900">{totalPages}</span>
              </p>
              <div className="space-x-2">
                <Button variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                <Button variant="secondary" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Broadcast Modal */}
      <Modal isOpen={broadcastModalOpen} onClose={() => setBroadcastModalOpen(false)} title="Broadcast Message">
        <form onSubmit={handleSubmit(handleBroadcastSubmit)} className="space-y-4">
          <p className="text-sm text-dark-600 mb-4">
            Send a notification banner to all {members.length} members of your club.
          </p>
          
          <div>
            <label className="label-text">Title</label>
            <input
              type="text"
              className={`input-field ${errors.title ? 'ring-red-500 focus:ring-red-500' : ''}`}
              placeholder="e.g. Next Meeting Re-scheduled"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>
          
          <div>
            <label className="label-text">Message Details</label>
            <textarea
              className={`input-field ${errors.message ? 'ring-red-500 focus:ring-red-500' : ''}`}
              rows={4}
              placeholder="Provide more details..."
              {...register('message', { required: 'Message is required' })}
            />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-dark-100">
            <Button type="button" variant="secondary" onClick={() => setBroadcastModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isBroadcasting}>Send Broadcast</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageMembers;
