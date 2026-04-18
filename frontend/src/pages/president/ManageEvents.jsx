import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar as CalendarIcon, Edit2, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import eventService from '../../services/eventService';
import clubService from '../../services/clubService';
import merchService from '../../services/merchService';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatDate';

const ManageEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [merchStats, setMerchStats] = useState({}); // eventId => { items, sold, total }

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const fetchMerchStats = async (list) => {
    const stats = {};
    await Promise.all(
      list.map(async (ev) => {
        try {
          const merch = await merchService.getEventMerch(ev._id);
          const items = merch.length;
          const sold = merch.reduce((s, m) => s + (m.soldQuantity || 0), 0);
          const total = merch.reduce((s, m) => s + (m.totalQuantity || 0), 0);
          stats[ev._id] = { items, sold, total };
        } catch {
          stats[ev._id] = { items: 0, sold: 0, total: 0 };
        }
      })
    );
    setMerchStats(stats);
  };

  const fetchEvents = async (cId, currentPage = 1) => {
    setIsLoading(true);
    try {
      const response = await eventService.getEvents({ clubId: cId, page: currentPage, limit: 10 });
      setEvents(response.data);
      setTotalPages(response.totalPages);
      setPage(response.page);
      await fetchMerchStats(response.data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const queryParams = (user.role === 'admin' || user.role === 'superadmin') ? { limit: 100 } : { presidentId: user?._id };
        const clubsRes = await clubService.getClubs(queryParams);
        if (clubsRes.data && clubsRes.data.length > 0) {
          setClubs(clubsRes.data);
          const myClub = clubsRes.data[0];
          setClubId(myClub._id);
          fetchEvents(myClub._id, page);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    if (user) init();
  }, [user, page]);

  const confirmDelete = (event) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    try {
      await eventService.deleteEvent(eventToDelete._id);
      toast.success('Event deleted successfully');
      setDeleteModalOpen(false);
      setEventToDelete(null);
      if (events.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchEvents(clubId, page);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    } finally {
      setIsDeleting(false);
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
          <h1 className="text-2xl font-bold text-dark-900">Manage Events</h1>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm text-dark-500">Create and oversee your club's events</p>
            {(user.role === 'admin' || user.role === 'superadmin') && clubs.length > 0 && (
              <select
                className="ml-2 text-sm border-dark-200 rounded-md bg-white py-1 px-2 text-dark-900 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={clubId}
                onChange={(e) => {
                  setClubId(e.target.value);
                  fetchEvents(e.target.value, 1);
                }}
              >
                {clubs.map(c => (
                  <option key={c._id} value={c._id}>{c.clubName}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        <Button onClick={() => navigate((user.role === 'admin' || user.role === 'superadmin') && clubId ? `/president/events/add?clubId=${clubId}` : '/president/events/add')} className="shrink-0 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={CalendarIcon}
          title="No events yet"
          description="Get started by creating your first club event."
          action={
            <Button onClick={() => navigate((user.role === 'admin' || user.role === 'superadmin') && clubId ? `/president/events/add?clubId=${clubId}` : '/president/events/add')}>
              Create Event
            </Button>
          }
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-dark-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm text-dark-600">
              <thead className="bg-dark-50 text-dark-900 border-b border-dark-200">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Event Details</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Date & Time</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Merchandise</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Status</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200">
                {events.map((event) => {
                  const stats = merchStats[event._id] || { items: 0, sold: 0, total: 0 };
                  const pct = stats.total ? Math.min(100, (stats.sold / stats.total) * 100) : 0;
                  return (
                    <tr key={event._id} className="hover:bg-dark-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-dark-100 flex items-center justify-center">
                            {event.bannerImage ? (
                              <img className="h-full w-full object-cover" src={event.bannerImage} alt="" />
                            ) : (
                              <CalendarIcon className="h-5 w-5 text-dark-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-dark-900 line-clamp-1">{event.title}</div>
                            <div className="text-xs text-dark-500 flex items-center gap-1 mt-0.5">
                              <span className="font-semibold text-primary-600">{event.venue}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-dark-900">{formatDate(event.date)}</div>
                        <div className="text-xs text-dark-500">{event.time}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-dark-900 font-medium">
                          <Package className="h-4 w-4 text-primary-600" />
                          {stats.items} items
                        </div>
                        <div className="text-xs text-dark-500 mt-0.5">Sold {stats.sold} / {stats.total}</div>
                        <div className="w-full bg-dark-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div 
                            className="bg-primary-500 h-1.5 rounded-full" 
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge status={event.status}>{event.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/president/events/edit/${event._id}`)}
                            className="rounded-md p-2 text-primary-600 hover:bg-primary-50 transition-colors"
                            title="Edit Event"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(event)}
                            className="rounded-md p-2 text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Event">
        <div className="space-y-4">
          <p className="text-sm text-dark-600">
            Are you sure you want to delete <span className="font-bold text-dark-900">{eventToDelete?.title}</span>? 
            This will remove the event and its related merchandise and data.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-100">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>Confirm Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageEvents;