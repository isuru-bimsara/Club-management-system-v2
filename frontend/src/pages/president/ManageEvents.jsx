import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Calendar as CalendarIcon, Search, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import eventService from '../../services/eventService';
import merchService from '../../services/merchService';
import clubService from '../../services/clubService';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatDate';

function resolveEventClubName(event, clubsList) {
  const c = event?.club;
  if (c && typeof c === 'object' && c.clubName) return c.clubName;
  const id = c && typeof c === 'object' ? c._id : c;
  if (id && Array.isArray(clubsList)) {
    const match = clubsList.find((x) => String(x._id) === String(id));
    if (match?.clubName) return match.clubName;
  }
  return null;
}

const ManageEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  /** Admin: which club’s events to list. */
  const [adminClubId, setAdminClubId] = useState(null);
  /** President: `all-clubs` or a specific `<clubId>`. */
  const [presidentScope, setPresidentScope] = useState('all-clubs');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');

  const [merchStats, setMerchStats] = useState({}); // eventId => { items, sold, total }

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [searchDebounced, presidentScope, adminClubId]);

  const fetchMerchStats = async (list) => {
    const stats = {};
    await Promise.all(
      list.map(async (ev) => {
        try {
          const merch = await merchService.getEventMerch(ev._id);
          const items = merch.length;
          const sold = merch.reduce((s, m) => s + (m.soldQuantity || 0), 0);
          const totalQty = merch.reduce((s, m) => s + (m.totalQuantity || 0), 0);
          stats[ev._id] = { items, sold, total: totalQty };
        } catch {
          stats[ev._id] = { items: 0, sold: 0, total: 0 };
        }
      })
    );
    setMerchStats(stats);
  };

  const loadEvents = useCallback(async () => {
    if (!user) return;
    if (isAdmin && !adminClubId) {
      setEvents([]);
      setTotalPages(1);
      setTotal(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const params = { page, limit: 20 };
      if (searchDebounced) params.search = searchDebounced;
      if (isAdmin) {
        params.clubId = adminClubId;
      } else if (presidentScope !== 'all-clubs') {
        params.clubId = presidentScope;
      }
      const response = await eventService.getEvents(params);
      setEvents(response.data || []);
      setTotalPages(response.totalPages ?? 1);
      setTotal(response.total ?? 0);
      await fetchMerchStats(response.data || []);
    } catch (error) {
      toast.error('Failed to load events');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, isAdmin, adminClubId, presidentScope, page, searchDebounced]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        if (isAdmin) {
          const clubsRes = await clubService.getClubs({ limit: 100 });
          const list = clubsRes.data || [];
          if (cancelled) return;
          setClubs(list);
          setAdminClubId((prev) => {
            if (prev && list.some((c) => String(c._id) === String(prev))) return prev;
            return list[0]?._id ?? null;
          });
        } else {
          let p = 1;
          let totalPg = 1;
          const all = [];
          while (p <= totalPg) {
            const clubsRes = await clubService.getClubs({ page: p, limit: 100 });
            const batch = clubsRes.data || [];
            all.push(...batch);
            totalPg = Math.max(1, parseInt(clubsRes?.totalPages, 10) || 1);
            p += 1;
            if (batch.length === 0) break;
          }
          if (cancelled) return;
          all.sort((a, b) => (a.clubName || '').localeCompare(b.clubName || '', undefined, { sensitivity: 'base' }));
          setClubs(all);
        }
      } catch {
        if (!cancelled) setClubs([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, isAdmin]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

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
        loadEvents();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  const createEventPath =
    isAdmin && adminClubId
      ? `/president/events/add?clubId=${adminClubId}`
      : '/president/events/add';

  if (isLoading && events.length === 0 && (isAdmin ? !!adminClubId : true)) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAdmin && !adminClubId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-dark-900">Manage Events</h1>
        <p className="text-dark-500">No clubs available. Create a club first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-dark-900">Manage Events</h1>
          <p className="mt-1 text-sm text-dark-500">
            Create, search, and update events
            {!isAdmin && total > 0 && (
              <span className="text-dark-400"> · {total} total</span>
            )}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {isAdmin && clubs.length > 0 && (
              <select
                className="text-sm border border-dark-200 rounded-lg bg-white py-2 px-3 text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                value={String(adminClubId || '')}
                onChange={(e) => setAdminClubId(e.target.value || null)}
              >
                {clubs.map((c) => (
                  <option key={c._id} value={String(c._id)}>
                    {c.clubName}
                  </option>
                ))}
              </select>
            )}
            {!isAdmin && (
              <select
                className="text-sm border border-dark-200 rounded-lg bg-white py-2 px-3 text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                value={presidentScope}
                onChange={(e) => setPresidentScope(e.target.value)}
              >
                <option value="all-clubs">All my events</option>
                {clubs.map((c) => (
                  <option key={c._id} value={String(c._id)}>
                    {c.clubName} only
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto lg:shrink-0">
          <div className="relative w-full min-w-0 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" />
            <input
              type="search"
              placeholder="Search title, venue…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-full border border-dark-200 bg-white py-2.5 pl-10 pr-4 text-sm text-dark-900 placeholder:text-dark-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              aria-label="Search events"
            />
          </div>
          <Button onClick={() => navigate(createEventPath)} className="shrink-0 flex items-center justify-center gap-2 whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </div>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={CalendarIcon}
          title={searchDebounced ? 'No matching events' : 'No events yet'}
          description={
            searchDebounced
              ? 'Try a different search or clear the search box.'
              : 'Get started by creating your first club event.'
          }
          action={
            <Button onClick={() => navigate(createEventPath)}>
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
                  <th scope="col" className="px-6 py-4 font-semibold">Club</th>
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
                  const clubLabel = resolveEventClubName(event, clubs) || '—';
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
                        <span className="font-semibold text-dark-800">{clubLabel}</span>
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
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            className="!px-3 !py-1.5 text-xs"
                            onClick={() => navigate(`/president/events/edit/${event._id}`)}
                          >
                            <Edit2 className="mr-1 inline h-3.5 w-3.5" />
                            Edit / Update
                          </Button>
                          <button
                            type="button"
                            onClick={() => confirmDelete(event)}
                            className="rounded-md p-2 text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete event"
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
            This will remove the event and all associated tickets.
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
