import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import eventService from '../../services/eventService';
import merchService from '../../services/merchService';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [merchItems, setMerchItems] = useState([]);
  const [selectedMerch, setSelectedMerch] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [merchModalOpen, setMerchModalOpen] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await eventService.getEventById(id);
        setEvent(response);
        const merch = await merchService.getEventMerch(id);
        setMerchItems(merch);
      } catch (error) {
        toast.error('Failed to load event details');
        navigate('/events');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventData();
  }, [id, navigate]);

  const openMerchModal = (item) => {
    if (!user) {
      toast.error('Please login to buy merchandise');
      navigate('/login');
      return;
    }

    setSelectedMerch(item);
    setQty(1);
    setReceipt(null);

    if (item?.hasSizes && item?.sizes?.length > 0) {
      const firstAvailable = item.sizes.find(
        (s) => (Number(s.quantity || 0) - Number(s.soldQuantity || 0)) > 0
      );
      setSelectedSize(firstAvailable?.size || item.sizes[0].size);
    } else {
      setSelectedSize('');
    }

    setMerchModalOpen(true);
  };

  const selectedSizeObj =
    selectedMerch?.hasSizes && selectedSize
      ? selectedMerch.sizes?.find((s) => s.size === selectedSize)
      : null;

  const availableForSelected = selectedMerch?.hasSizes
    ? Math.max(0, Number(selectedSizeObj?.quantity || 0) - Number(selectedSizeObj?.soldQuantity || 0))
    : Math.max(0, Number(selectedMerch?.totalQuantity || 0) - Number(selectedMerch?.soldQuantity || 0));

  const submitMerchOrder = async (e) => {
    e.preventDefault();
    if (!selectedMerch) return toast.error('Select an item');
    if (selectedMerch.hasSizes && !selectedSize) return toast.error('Select a size');
    if (!receipt) return toast.error('Upload payment receipt');

    setIsSubmitting(true);
    try {
      await merchService.placeOrder({
        merchandiseId: selectedMerch._id,
        quantity: qty,
        size: selectedMerch.hasSizes ? selectedSize : '',
        receiptImage: receipt,
      });

      toast.success('Order submitted. Await approval.');
      setMerchModalOpen(false);
      const merch = await merchService.getEventMerch(id);
      setMerchItems(merch);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
  if (!event) return null;

  return (
    <div className="pb-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="relative h-64 sm:h-96 w-full overflow-hidden rounded-3xl bg-dark-100 shadow-sm">
          {event.bannerImage ? (
            <img src={event.bannerImage} alt={event.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary-700 to-dark-900 flex items-center justify-center">
              <span className="text-white/20 font-bold text-6xl tracking-widest uppercase">{event.title.substring(0, 3)}</span>
            </div>
          )}
          <div className="absolute top-6 right-6">
            <Badge status={event.status}>{event.status}</Badge>
          </div>
        </div>

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

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-dark-900">Merchandise</h3>
          {merchItems.length === 0 && (
            <div className="card p-6 text-sm text-dark-500">No merchandise for this event.</div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {merchItems.map((m) => {
              const available = Number(m.totalQuantity || 0) - Number(m.soldQuantity || 0);

              return (
                <div key={m._id} className="card p-3 sm:p-4 hover:shadow-lg transition-shadow duration-150">
                  <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-dark-50 border border-dark-100">
                    {m.image ? (
                      <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-dark-400">No Image</div>
                    )}
                  </div>

                  <div className="mt-3 flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-dark-400 uppercase tracking-wide">New</p>
                      <p className="font-semibold text-dark-900">{m.name}</p>
                      <p className="text-xs text-dark-500">Venue: {m.venue}</p>
                    </div>
                    <div className="text-xs text-dark-400 flex flex-col items-end gap-1">
                      <button className="h-7 w-7 flex items-center justify-center rounded-full border border-dark-100 text-dark-400" title="Wishlist">♡</button>
                      <button className="h-7 w-7 flex items-center justify-center rounded-full border border-dark-100 text-dark-400" title="Preview">👁</button>
                    </div>
                  </div>

                  <div className="mt-3 font-semibold text-dark-900">{formatCurrency(m.price)}</div>
                  <div className="mt-1 text-xs text-dark-500">Available: {available}</div>

                  {m.hasSizes && m.sizes?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {m.sizes.map((s, i) => {
                        const sAvail = Number(s.quantity || 0) - Number(s.soldQuantity || 0);
                        return (
                          <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700">
                            {s.size}: {sAvail}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <Button
                    className="mt-3 w-full"
                    disabled={available <= 0}
                    onClick={() => openMerchModal(m)}
                  >
                    {available <= 0 ? 'Sold out' : 'Buy'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal isOpen={merchModalOpen} onClose={() => setMerchModalOpen(false)} title="Buy Merchandise">
        {selectedMerch && (
          <form onSubmit={submitMerchOrder} className="space-y-6">
            <div className="bg-dark-50 p-4 rounded-xl border border-dark-200">
              <h4 className="font-bold text-dark-900 mb-1">{selectedMerch.name}</h4>
              <p className="text-sm text-dark-600">
                Price: {formatCurrency(selectedMerch.price)} | Available: {availableForSelected}
              </p>
              <p className="text-sm text-primary-700 mt-1">Total: {formatCurrency(selectedMerch.price * qty)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-dark-800">Payment details</p>
              {selectedMerch.bankDetails?.length === 0 && (
                <p className="text-sm text-dark-500">No bank details provided.</p>
              )}
              {selectedMerch.bankDetails?.map((b, i) => (
                <div key={i} className="rounded-lg border border-dark-200 bg-white p-3 text-sm text-dark-700">
                  <div className="font-semibold text-dark-900 mb-1">Bank option {i + 1}</div>
                  <div className="space-y-1">
                    <div><span className="font-medium">Bank Name:</span> {b.bankName}</div>
                    <div><span className="font-medium">Account Name:</span> {b.accountName}</div>
                    <div><span className="font-medium">Account Number:</span> {b.accountNumber}</div>
                    {b.branch && <div><span className="font-medium">Branch:</span> {b.branch}</div>}
                  </div>
                </div>
              ))}
            </div>

            {selectedMerch.hasSizes && (
              <div>
                <label className="label-text">Size *</label>
                <select
                  className="input mt-1"
                  value={selectedSize}
                  onChange={(e) => {
                    setSelectedSize(e.target.value);
                    setQty(1);
                  }}
                  required
                >
                  {selectedMerch.sizes?.map((s) => {
                    const sAvail = Number(s.quantity || 0) - Number(s.soldQuantity || 0);
                    return (
                      <option key={s.size} value={s.size} disabled={sAvail <= 0}>
                        {s.size} ({sAvail} available)
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            <div>
              <label className="label-text">Quantity</label>
              <input
                type="number"
                min="1"
                max={availableForSelected}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(availableForSelected, Number(e.target.value) || 1)))}
                className="input mt-1"
                required
              />
            </div>

            <div>
              <label className="label-text">Upload Payment Receipt *</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="input mt-1"
                onChange={(e) => setReceipt(e.target.files[0])}
                required
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setMerchModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>Submit</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default EventDetails;