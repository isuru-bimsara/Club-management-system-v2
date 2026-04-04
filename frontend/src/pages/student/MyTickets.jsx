import React, { useState, useEffect } from 'react';
import ticketService from '../../services/ticketService';
import TicketCard from '../../components/tickets/TicketCard';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { Ticket as TicketIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const response = await ticketService.getMyTickets({ limit: 100 });
        setTickets(response.data);
      } catch (error) {
        console.error('Failed to load tickets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-dark-900">My Tickets</h1>
        <p className="mt-2 text-dark-500">View your event registrations and e-tickets.</p>
      </div>

      {tickets.length === 0 ? (
        <EmptyState
          icon={TicketIcon}
          title="No tickets found"
          description="You haven't registered for any events yet."
          action={
            <Link to="/events" className="btn btn-primary">
              Browse Events
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
