import React, { useState, useEffect } from 'react';
import { Ticket as TicketIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import ticketService from '../../services/ticketService';
import clubService from '../../services/clubService';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ReceiptInbox from '../../components/tickets/ReceiptInbox';

const TicketInbox = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [clubId, setClubId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('pending'); // 'pending', 'approved', 'rejected'

  const fetchTickets = async (cId, currentPage = 1, currentStatus) => {
    setIsLoading(true);
    try {
      const response = await ticketService.getClubTickets(cId, { 
        page: currentPage, 
        limit: 15,
        status: currentStatus !== 'all' ? currentStatus : undefined
      });
      setTickets(response.data);
      setTotalPages(response.totalPages);
      setPage(response.page);
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const queryParams = (user.role === 'admin' || user.role === 'superadmin') ? { limit: 100 } : { presidentId: user._id };
        const clubsRes = await clubService.getClubs(queryParams);
        
        if (clubsRes.data && clubsRes.data.length > 0) {
          setClubs(clubsRes.data);
          const activeClub = clubsRes.data[0];
          setClubId(activeClub._id);
          fetchTickets(activeClub._id, 1, statusFilter);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    if (user) init();
  }, [user]);

  // Refetch when status filter changes
  useEffect(() => {
    if (clubId) {
      fetchTickets(clubId, 1, statusFilter);
    }
  }, [statusFilter, clubId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = async (ticketId) => {
    setIsProcessing(true);
    try {
      await ticketService.approveTicket(ticketId);
      toast.success('Ticket approved! Student notified.');
      fetchTickets(clubId, page, statusFilter);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve ticket');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (ticketId, reason) => {
    setIsProcessing(true);
    try {
      await ticketService.rejectTicket(ticketId, reason);
      toast.success('Ticket rejected. Student notified.');
      fetchTickets(clubId, page, statusFilter);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject ticket');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading && !tickets.length) {
    return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (!clubId) {
    return <div className="p-8 text-center text-dark-500">No club assigned to this account.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Ticket Requests</h1>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm text-dark-500">Verify receipts and approve e-tickets</p>
            {(user.role === 'admin' || user.role === 'superadmin') && clubs.length > 0 && (
              <select
                className="ml-2 text-sm border-dark-200 rounded-md bg-white py-1 px-2 text-dark-900 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={clubId}
                onChange={(e) => setClubId(e.target.value)}
              >
                {clubs.map(c => (
                  <option key={c._id} value={c._id}>{c.clubName}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        
        <div className="flex bg-dark-100 p-1 rounded-lg">
          <button 
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${statusFilter === 'pending' ? 'bg-white text-dark-900 shadow-sm' : 'text-dark-500 hover:text-dark-900'}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${statusFilter === 'approved' ? 'bg-white text-dark-900 shadow-sm' : 'text-dark-500 hover:text-dark-900'}`}
            onClick={() => setStatusFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${statusFilter === 'all' ? 'bg-white text-dark-900 shadow-sm' : 'text-dark-500 hover:text-dark-900'}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : tickets.length === 0 ? (
        <EmptyState
          icon={TicketIcon}
          title={`No ${statusFilter !== 'all' ? statusFilter : ''} tickets found`}
          description="When students purchase tickets for your events, they will appear here."
        />
      ) : (
        <>
          <ReceiptInbox 
            tickets={tickets} 
            onApprove={handleApprove} 
            onReject={handleReject} 
            isLoading={isProcessing} 
          />
          
          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-white p-4 border border-dark-200 rounded-xl shadow-sm mt-4">
              <p className="text-sm text-dark-600">
                Page <span className="font-medium text-dark-900">{page}</span> of <span className="font-medium text-dark-900">{totalPages}</span>
              </p>
              <div className="space-x-2">
                <Button variant="secondary" onClick={() => fetchTickets(clubId, Math.max(1, page - 1), statusFilter)} disabled={page === 1}>Previous</Button>
                <Button variant="secondary" onClick={() => fetchTickets(clubId, Math.min(totalPages, page + 1), statusFilter)} disabled={page === totalPages}>Next</Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TicketInbox;
