import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Building2, Ticket as TicketIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import eventService from '../../services/eventService';
import ticketService from '../../services/ticketService';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import ImageUpload from '../../components/ui/ImageUpload';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { BANK_DETAILS } from '../../utils/constants';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  
  const [quantity, setQuantity] = useState(1);
  const [receiptFile, setReceiptFile] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await eventService.getEventById(id);
        setEvent(response);
      } catch (error) {
        toast.error('Failed to load event details');
        navigate('/events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [id, navigate]);

  const handlePurchaseClick = () => {
    if (!user) {
      toast.error('Please login to purchase tickets');
      navigate('/login');
      return;
    }
    setPurchaseModalOpen(true);
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    
    if (event.ticketPrice > 0 && !receiptFile) {
      toast.error('Please upload your payment receipt');
      return;
    }
    
    setIsPurchasing(true);
    try {
      const formData = new FormData();
      formData.append('eventId', event._id);
      formData.append('quantity', quantity);
      
      if (receiptFile instanceof File) {
        formData.append('receiptImage', receiptFile);
      }

      await ticketService.purchaseTicket(formData);
      toast.success('Ticket request submitted successfully!');
      setPurchaseModalOpen(false);
      
      // Update local event stats roughly
      setEvent(prev => ({
        ...prev,
        ticketsSold: prev.ticketsSold + parseInt(quantity)
      }));
      
      // Navigate to my tickets
      setTimeout(() => navigate('/my-tickets'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit ticket request');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (!event) return null;

  const isSoldOut = event.ticketsSold >= event.totalTickets;
  const isFree = event.ticketPrice === 0;
  const totalAmount = event.ticketPrice * quantity;

  return (
    <div className="pb-12">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Banner */}
        <div className="relative h-64 sm:h-96 w-full overflow-hidden rounded-3xl bg-dark-100 shadow-sm">
          {event.bannerImage ? (
            <img src={event.bannerImage} alt={event.title} className="h-full w-full object-cover" />
          ) : (
             <div className="h-full w-full bg-gradient-to-br from-primary-700 to-dark-900 flex items-center justify-center">
                <span className="text-white/20 font-bold text-6xl tracking-widest uppercase">{event.title.substring(0,3)}</span>
             </div>
          )}
          <div className="absolute top-6 right-6">
            <Badge status={event.status}>{event.status}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-6 sm:p-8">
              {event.club && (
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-8 w-8 overflow-hidden rounded-md border border-dark-200 bg-white">
                    {event.club.logo ? (
                      <img src={event.club.logo} alt={event.club.clubName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-dark-50">
                        <Building2 className="h-4 w-4 text-dark-400" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-primary-600">{event.club.clubName}</span>
                </div>
              )}
              
              <h1 className="text-3xl font-bold text-dark-900 sm:text-4xl mb-6">{event.title}</h1>
              
              <div className="flex flex-wrap gap-4 sm:gap-8 mb-8 border-y border-dark-100 py-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-dark-400" />
                  <div>
                    <p className="text-xs text-dark-500">Date</p>
                    <p className="font-medium text-dark-900">{formatDate(event.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-dark-400" />
                  <div>
                    <p className="text-xs text-dark-500">Time</p>
                    <p className="font-medium text-dark-900">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-dark-400" />
                  <div>
                    <p className="text-xs text-dark-500">Venue</p>
                    <p className="font-medium text-dark-900">{event.venue}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-dark-900 mb-4">About this event</h3>
              <div className="prose prose-dark max-w-none text-dark-600 whitespace-pre-wrap">
                {event.description}
              </div>
            </div>
          </div>

          {/* Ticket Sidebar */}
          <div className="space-y-6">
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-bold text-dark-900 mb-2">Tickets</h3>
              <div className="flex items-baseline gap-2 mb-6 border-b border-dark-100 pb-4">
                <span className="text-3xl font-bold text-primary-600">
                  {isFree ? 'Free' : formatCurrency(event.ticketPrice)}
                </span>
                {!isFree && <span className="text-dark-500 text-sm">/ person</span>}
              </div>

              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between items-center text-dark-600">
                  <span>Capacity</span>
                  <span className="font-medium text-dark-900">{event.totalTickets}</span>
                </div>
                <div className="flex justify-between items-center text-dark-600">
                  <span>Available</span>
                  <span className="font-medium text-dark-900">{event.totalTickets - event.ticketsSold}</span>
                </div>
              </div>

              <Button 
                className="w-full h-12 text-lg" 
                disabled={isSoldOut || event.status !== 'upcoming'}
                onClick={handlePurchaseClick}
              >
                {isSoldOut ? 'Sold Out' : event.status !== 'upcoming' ? 'Event Ended' : 'Get Tickets'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Purchase Modal */}
      <Modal isOpen={purchaseModalOpen} onClose={() => setPurchaseModalOpen(false)} title="Get Tickets">
        <form onSubmit={handlePurchaseSubmit} className="space-y-6">
          <div className="mb-4 bg-dark-50 p-4 rounded-xl border border-dark-200">
            <h4 className="font-bold text-dark-900 mb-1">{event.title}</h4>
            <p className="text-sm text-dark-600 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formatDate(event.date)} at {event.time}
            </p>
          </div>

          <div>
            <label className="label-text">Select Quantity</label>
            <div className="flex items-center mt-1">
              <button 
                type="button"
                className="px-4 py-2 border border-dark-300 rounded-l-md bg-dark-50 hover:bg-dark-100 disabled:opacity-50"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={Math.min(5, event.totalTickets - event.ticketsSold)}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 text-center border-y border-dark-300 py-2 focus:outline-none"
                readOnly
              />
              <button 
                type="button"
                className="px-4 py-2 border border-dark-300 rounded-r-md bg-dark-50 hover:bg-dark-100 disabled:opacity-50"
                onClick={() => setQuantity(Math.min(5, event.totalTickets - event.ticketsSold, quantity + 1))}
                disabled={quantity >= 5 || quantity >= (event.totalTickets - event.ticketsSold)}
              >
                +
              </button>
            </div>
            <p className="text-xs text-dark-500 mt-2">Maximum 5 tickets per user.</p>
          </div>

          <div className="border-t border-dark-200 pt-4 flex justify-between items-center text-lg">
            <span className="font-semibold text-dark-900">Total:</span>
            <span className="font-bold text-primary-600">{isFree ? 'Free' : formatCurrency(totalAmount)}</span>
          </div>

          {!isFree && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <h4 className="text-sm font-bold text-blue-900 mb-2">Payment Instructions</h4>
              <p className="text-xs text-blue-800 mb-3">
                Please transfer exactly <span className="font-bold">{formatCurrency(totalAmount)}</span> to the following bank account and upload the receipt below.
              </p>
              <div className="text-xs font-mono bg-white p-3 rounded border border-blue-100 space-y-1">
                <p><span className="text-dark-500">Bank:</span> {BANK_DETAILS.BANK_NAME}</p>
                <p><span className="text-dark-500">Account Name:</span> {BANK_DETAILS.ACCOUNT_NAME}</p>
                <p><span className="text-dark-500">Account No:</span> <span className="font-bold text-dark-900">{BANK_DETAILS.ACCOUNT_NUMBER}</span></p>
                <p><span className="text-dark-500">Branch:</span> {BANK_DETAILS.BRANCH}</p>
              </div>

              <div className="mt-4">
                <ImageUpload
                  label="Upload Payment Receipt *"
                  value={receiptFile}
                  onChange={setReceiptFile}
                  maxSizeMB={5}
                  accept="image/jpeg, image/png, application/pdf"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setPurchaseModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isPurchasing}>
              {isFree ? 'Confirm Registration' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventDetails;
