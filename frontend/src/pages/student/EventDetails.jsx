// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // // import { Calendar, MapPin, Clock, Building2, Ticket as TicketIcon } from 'lucide-react';
// // // // // import toast from 'react-hot-toast';
// // // // // import eventService from '../../services/eventService';
// // // // // import ticketService from '../../services/ticketService';
// // // // // import useAuth from '../../hooks/useAuth';
// // // // // import Button from '../../components/ui/Button';
// // // // // import Spinner from '../../components/ui/Spinner';
// // // // // import Badge from '../../components/ui/Badge';
// // // // // import Modal from '../../components/ui/Modal';
// // // // // import ImageUpload from '../../components/ui/ImageUpload';
// // // // // import { formatDate } from '../../utils/formatDate';
// // // // // import { formatCurrency } from '../../utils/formatCurrency';
// // // // // import { BANK_DETAILS } from '../../utils/constants';

// // // // // const EventDetails = () => {
// // // // //   const { id } = useParams();
// // // // //   const navigate = useNavigate();
// // // // //   const { user } = useAuth();
  
// // // // //   const [event, setEvent] = useState(null);
// // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // //   const [isPurchasing, setIsPurchasing] = useState(false);
// // // // //   const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  
// // // // //   const [quantity, setQuantity] = useState(1);
// // // // //   const [receiptFile, setReceiptFile] = useState(null);

// // // // //   useEffect(() => {
// // // // //     const fetchEventData = async () => {
// // // // //       try {
// // // // //         const response = await eventService.getEventById(id);
// // // // //         setEvent(response);
// // // // //       } catch (error) {
// // // // //         toast.error('Failed to load event details');
// // // // //         navigate('/events');
// // // // //       } finally {
// // // // //         setIsLoading(false);
// // // // //       }
// // // // //     };

// // // // //     fetchEventData();
// // // // //   }, [id, navigate]);

// // // // //   const handlePurchaseClick = () => {
// // // // //     if (!user) {
// // // // //       toast.error('Please login to purchase tickets');
// // // // //       navigate('/login');
// // // // //       return;
// // // // //     }
// // // // //     setPurchaseModalOpen(true);
// // // // //   };

// // // // //   const handlePurchaseSubmit = async (e) => {
// // // // //     e.preventDefault();
    
// // // // //     if (event.ticketPrice > 0 && !receiptFile) {
// // // // //       toast.error('Please upload your payment receipt');
// // // // //       return;
// // // // //     }
    
// // // // //     setIsPurchasing(true);
// // // // //     try {
// // // // //       const formData = new FormData();
// // // // //       formData.append('eventId', event._id);
// // // // //       formData.append('quantity', quantity);
      
// // // // //       if (receiptFile instanceof File) {
// // // // //         formData.append('receiptImage', receiptFile);
// // // // //       }

// // // // //       await ticketService.purchaseTicket(formData);
// // // // //       toast.success('Ticket request submitted successfully!');
// // // // //       setPurchaseModalOpen(false);
      
// // // // //       // Update local event stats roughly
// // // // //       setEvent(prev => ({
// // // // //         ...prev,
// // // // //         ticketsSold: prev.ticketsSold + parseInt(quantity)
// // // // //       }));
      
// // // // //       // Navigate to my tickets
// // // // //       setTimeout(() => navigate('/my-tickets'), 1500);
// // // // //     } catch (error) {
// // // // //       toast.error(error.response?.data?.message || 'Failed to submit ticket request');
// // // // //     } finally {
// // // // //       setIsPurchasing(false);
// // // // //     }
// // // // //   };

// // // // //   if (isLoading) {
// // // // //     return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
// // // // //   }

// // // // //   if (!event) return null;

// // // // //   const isSoldOut = event.ticketsSold >= event.totalTickets;
// // // // //   const isFree = event.ticketPrice === 0;
// // // // //   const totalAmount = event.ticketPrice * quantity;

// // // // //   return (
// // // // //     <div className="pb-12">
// // // // //       <div className="mx-auto max-w-5xl space-y-8">
// // // // //         {/* Banner */}
// // // // //         <div className="relative h-64 sm:h-96 w-full overflow-hidden rounded-3xl bg-dark-100 shadow-sm">
// // // // //           {event.bannerImage ? (
// // // // //             <img src={event.bannerImage} alt={event.title} className="h-full w-full object-cover" />
// // // // //           ) : (
// // // // //              <div className="h-full w-full bg-gradient-to-br from-primary-700 to-dark-900 flex items-center justify-center">
// // // // //                 <span className="text-white/20 font-bold text-6xl tracking-widest uppercase">{event.title.substring(0,3)}</span>
// // // // //              </div>
// // // // //           )}
// // // // //           <div className="absolute top-6 right-6">
// // // // //             <Badge status={event.status}>{event.status}</Badge>
// // // // //           </div>
// // // // //         </div>

// // // // //         <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
// // // // //           {/* Main Info */}
// // // // //           <div className="lg:col-span-2 space-y-8">
// // // // //             <div className="card p-6 sm:p-8">
// // // // //               {event.club && (
// // // // //                 <div className="mb-4 flex items-center gap-3">
// // // // //                   <div className="h-8 w-8 overflow-hidden rounded-md border border-dark-200 bg-white">
// // // // //                     {event.club.logo ? (
// // // // //                       <img src={event.club.logo} alt={event.club.clubName} className="h-full w-full object-cover" />
// // // // //                     ) : (
// // // // //                       <div className="flex h-full w-full items-center justify-center bg-dark-50">
// // // // //                         <Building2 className="h-4 w-4 text-dark-400" />
// // // // //                       </div>
// // // // //                     )}
// // // // //                   </div>
// // // // //                   <span className="text-sm font-semibold text-primary-600">{event.club.clubName}</span>
// // // // //                 </div>
// // // // //               )}
              
// // // // //               <h1 className="text-3xl font-bold text-dark-900 sm:text-4xl mb-6">{event.title}</h1>
              
// // // // //               <div className="flex flex-wrap gap-4 sm:gap-8 mb-8 border-y border-dark-100 py-4">
// // // // //                 <div className="flex items-center gap-2">
// // // // //                   <Calendar className="h-5 w-5 text-dark-400" />
// // // // //                   <div>
// // // // //                     <p className="text-xs text-dark-500">Date</p>
// // // // //                     <p className="font-medium text-dark-900">{formatDate(event.date)}</p>
// // // // //                   </div>
// // // // //                 </div>
// // // // //                 <div className="flex items-center gap-2">
// // // // //                   <Clock className="h-5 w-5 text-dark-400" />
// // // // //                   <div>
// // // // //                     <p className="text-xs text-dark-500">Time</p>
// // // // //                     <p className="font-medium text-dark-900">{event.time}</p>
// // // // //                   </div>
// // // // //                 </div>
// // // // //                 <div className="flex items-center gap-2">
// // // // //                   <MapPin className="h-5 w-5 text-dark-400" />
// // // // //                   <div>
// // // // //                     <p className="text-xs text-dark-500">Venue</p>
// // // // //                     <p className="font-medium text-dark-900">{event.venue}</p>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>

// // // // //               <h3 className="text-xl font-bold text-dark-900 mb-4">About this event</h3>
// // // // //               <div className="prose prose-dark max-w-none text-dark-600 whitespace-pre-wrap">
// // // // //                 {event.description}
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Ticket Sidebar */}
// // // // //           <div className="space-y-6">
// // // // //             <div className="card p-6 sticky top-24">
// // // // //               <h3 className="text-lg font-bold text-dark-900 mb-2">Tickets</h3>
// // // // //               <div className="flex items-baseline gap-2 mb-6 border-b border-dark-100 pb-4">
// // // // //                 <span className="text-3xl font-bold text-primary-600">
// // // // //                   {isFree ? 'Free' : formatCurrency(event.ticketPrice)}
// // // // //                 </span>
// // // // //                 {!isFree && <span className="text-dark-500 text-sm">/ person</span>}
// // // // //               </div>

// // // // //               <div className="space-y-4 mb-6 text-sm">
// // // // //                 <div className="flex justify-between items-center text-dark-600">
// // // // //                   <span>Capacity</span>
// // // // //                   <span className="font-medium text-dark-900">{event.totalTickets}</span>
// // // // //                 </div>
// // // // //                 <div className="flex justify-between items-center text-dark-600">
// // // // //                   <span>Available</span>
// // // // //                   <span className="font-medium text-dark-900">{event.totalTickets - event.ticketsSold}</span>
// // // // //                 </div>
// // // // //               </div>

// // // // //               <Button 
// // // // //                 className="w-full h-12 text-lg" 
// // // // //                 disabled={isSoldOut || event.status !== 'upcoming'}
// // // // //                 onClick={handlePurchaseClick}
// // // // //               >
// // // // //                 {isSoldOut ? 'Sold Out' : event.status !== 'upcoming' ? 'Event Ended' : 'Get Tickets'}
// // // // //               </Button>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Ticket Purchase Modal */}
// // // // //       <Modal isOpen={purchaseModalOpen} onClose={() => setPurchaseModalOpen(false)} title="Get Tickets">
// // // // //         <form onSubmit={handlePurchaseSubmit} className="space-y-6">
// // // // //           <div className="mb-4 bg-dark-50 p-4 rounded-xl border border-dark-200">
// // // // //             <h4 className="font-bold text-dark-900 mb-1">{event.title}</h4>
// // // // //             <p className="text-sm text-dark-600 flex items-center gap-1">
// // // // //               <Calendar className="h-3 w-3" /> {formatDate(event.date)} at {event.time}
// // // // //             </p>
// // // // //           </div>

// // // // //           <div>
// // // // //             <label className="label-text">Select Quantity</label>
// // // // //             <div className="flex items-center mt-1">
// // // // //               <button 
// // // // //                 type="button"
// // // // //                 className="px-4 py-2 border border-dark-300 rounded-l-md bg-dark-50 hover:bg-dark-100 disabled:opacity-50"
// // // // //                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
// // // // //                 disabled={quantity <= 1}
// // // // //               >
// // // // //                 -
// // // // //               </button>
// // // // //               <input
// // // // //                 type="number"
// // // // //                 min="1"
// // // // //                 max={Math.min(5, event.totalTickets - event.ticketsSold)}
// // // // //                 value={quantity}
// // // // //                 onChange={(e) => setQuantity(Number(e.target.value))}
// // // // //                 className="w-20 text-center border-y border-dark-300 py-2 focus:outline-none"
// // // // //                 readOnly
// // // // //               />
// // // // //               <button 
// // // // //                 type="button"
// // // // //                 className="px-4 py-2 border border-dark-300 rounded-r-md bg-dark-50 hover:bg-dark-100 disabled:opacity-50"
// // // // //                 onClick={() => setQuantity(Math.min(5, event.totalTickets - event.ticketsSold, quantity + 1))}
// // // // //                 disabled={quantity >= 5 || quantity >= (event.totalTickets - event.ticketsSold)}
// // // // //               >
// // // // //                 +
// // // // //               </button>
// // // // //             </div>
// // // // //             <p className="text-xs text-dark-500 mt-2">Maximum 5 tickets per user.</p>
// // // // //           </div>

// // // // //           <div className="border-t border-dark-200 pt-4 flex justify-between items-center text-lg">
// // // // //             <span className="font-semibold text-dark-900">Total:</span>
// // // // //             <span className="font-bold text-primary-600">{isFree ? 'Free' : formatCurrency(totalAmount)}</span>
// // // // //           </div>

// // // // //           {!isFree && (
// // // // //             <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
// // // // //               <h4 className="text-sm font-bold text-blue-900 mb-2">Payment Instructions</h4>
// // // // //               <p className="text-xs text-blue-800 mb-3">
// // // // //                 Please transfer exactly <span className="font-bold">{formatCurrency(totalAmount)}</span> to the following bank account and upload the receipt below.
// // // // //               </p>
// // // // //               <div className="text-xs font-mono bg-white p-3 rounded border border-blue-100 space-y-1">
// // // // //                 <p><span className="text-dark-500">Bank:</span> {BANK_DETAILS.BANK_NAME}</p>
// // // // //                 <p><span className="text-dark-500">Account Name:</span> {BANK_DETAILS.ACCOUNT_NAME}</p>
// // // // //                 <p><span className="text-dark-500">Account No:</span> <span className="font-bold text-dark-900">{BANK_DETAILS.ACCOUNT_NUMBER}</span></p>
// // // // //                 <p><span className="text-dark-500">Branch:</span> {BANK_DETAILS.BRANCH}</p>
// // // // //               </div>

// // // // //               <div className="mt-4">
// // // // //                 <ImageUpload
// // // // //                   label="Upload Payment Receipt *"
// // // // //                   value={receiptFile}
// // // // //                   onChange={setReceiptFile}
// // // // //                   maxSizeMB={5}
// // // // //                   accept="image/jpeg, image/png, application/pdf"
// // // // //                 />
// // // // //               </div>
// // // // //             </div>
// // // // //           )}

// // // // //           <div className="pt-2 flex justify-end gap-3">
// // // // //             <Button type="button" variant="secondary" onClick={() => setPurchaseModalOpen(false)}>
// // // // //               Cancel
// // // // //             </Button>
// // // // //             <Button type="submit" isLoading={isPurchasing}>
// // // // //               {isFree ? 'Confirm Registration' : 'Submit Request'}
// // // // //             </Button>
// // // // //           </div>
// // // // //         </form>
// // // // //       </Modal>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default EventDetails;


// // // // import React, { useState, useEffect } from 'react';
// // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // import { Calendar, MapPin, Clock, Building2 } from 'lucide-react';
// // // // import toast from 'react-hot-toast';
// // // // import eventService from '../../services/eventService';
// // // // import merchService from '../../services/merchService';
// // // // import useAuth from '../../hooks/useAuth';
// // // // import Button from '../../components/ui/Button';
// // // // import Spinner from '../../components/ui/Spinner';
// // // // import Badge from '../../components/ui/Badge';
// // // // import Modal from '../../components/ui/Modal';
// // // // import { formatDate } from '../../utils/formatDate';
// // // // import { formatCurrency } from '../../utils/formatCurrency';

// // // // const EventDetails = () => {
// // // //   const { id } = useParams();
// // // //   const navigate = useNavigate();
// // // //   const { user } = useAuth();
  
// // // //   const [event, setEvent] = useState(null);
// // // //   const [isLoading, setIsLoading] = useState(true);

// // // //   // merchandise
// // // //   const [merchItems, setMerchItems] = useState([]);
// // // //   const [selectedMerch, setSelectedMerch] = useState(null);
// // // //   const [qty, setQty] = useState(1);
// // // //   const [receipt, setReceipt] = useState(null);
// // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // //   const [merchModalOpen, setMerchModalOpen] = useState(false);

// // // //   useEffect(() => {
// // // //     const fetchEventData = async () => {
// // // //       try {
// // // //         const response = await eventService.getEventById(id);
// // // //         setEvent(response);

// // // //         // load merch for this event
// // // //         const merch = await merchService.getEventMerch(id);
// // // //         setMerchItems(merch);
// // // //       } catch (error) {
// // // //         toast.error('Failed to load event details');
// // // //         navigate('/events');
// // // //       } finally {
// // // //         setIsLoading(false);
// // // //       }
// // // //     };
// // // //     fetchEventData();
// // // //   }, [id, navigate]);

// // // //   const openMerchModal = (item) => {
// // // //     if (!user) {
// // // //       toast.error('Please login to buy merchandise');
// // // //       navigate('/login');
// // // //       return;
// // // //     }
// // // //     setSelectedMerch(item);
// // // //     setQty(1);
// // // //     setReceipt(null);
// // // //     setMerchModalOpen(true);
// // // //   };

// // // //   const submitMerchOrder = async (e) => {
// // // //     e.preventDefault();
// // // //     if (!selectedMerch) return toast.error('Select an item');
// // // //     if (!receipt) return toast.error('Upload payment receipt');

// // // //     setIsSubmitting(true);
// // // //     try {
// // // //       await merchService.placeOrder({
// // // //         merchandiseId: selectedMerch._id,
// // // //         quantity: qty,
// // // //         receiptImage: receipt
// // // //       });
// // // //       toast.success('Order submitted. Await approval.');
// // // //       setMerchModalOpen(false);

// // // //       // refresh merch quantities
// // // //       const merch = await merchService.getEventMerch(id);
// // // //       setMerchItems(merch);
// // // //     } catch (error) {
// // // //       toast.error(error.response?.data?.message || 'Failed to submit order');
// // // //     } finally {
// // // //       setIsSubmitting(false);
// // // //     }
// // // //   };

// // // //   if (isLoading) {
// // // //     return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
// // // //   }
// // // //   if (!event) return null;

// // // //   return (
// // // //     <div className="pb-12">
// // // //       <div className="mx-auto max-w-5xl space-y-8">
// // // //         {/* Banner */}
// // // //         <div className="relative h-64 sm:h-96 w-full overflow-hidden rounded-3xl bg-dark-100 shadow-sm">
// // // //           {event.bannerImage ? (
// // // //             <img src={event.bannerImage} alt={event.title} className="h-full w-full object-cover" />
// // // //           ) : (
// // // //              <div className="h-full w-full bg-gradient-to-br from-primary-700 to-dark-900 flex items-center justify-center">
// // // //                 <span className="text-white/20 font-bold text-6xl tracking-widest uppercase">{event.title.substring(0,3)}</span>
// // // //              </div>
// // // //           )}
// // // //           <div className="absolute top-6 right-6">
// // // //             <Badge status={event.status}>{event.status}</Badge>
// // // //           </div>
// // // //         </div>

// // // //         <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
// // // //           {/* Main Info */}
// // // //           <div className="lg:col-span-2 space-y-8">
// // // //             <div className="card p-6 sm:p-8">
// // // //               {event.club && (
// // // //                 <div className="mb-4 flex items-center gap-3">
// // // //                   <div className="h-8 w-8 overflow-hidden rounded-md border border-dark-200 bg-white">
// // // //                     {event.club.logo ? (
// // // //                       <img src={event.club.logo} alt={event.club.clubName} className="h-full w-full object-cover" />
// // // //                     ) : (
// // // //                       <div className="flex h-full w-full items-center justify-center bg-dark-50">
// // // //                         <Building2 className="h-4 w-4 text-dark-400" />
// // // //                       </div>
// // // //                     )}
// // // //                   </div>
// // // //                   <span className="text-sm font-semibold text-primary-600">{event.club.clubName}</span>
// // // //                 </div>
// // // //               )}
              
// // // //               <h1 className="text-3xl font-bold text-dark-900 sm:text-4xl mb-6">{event.title}</h1>
              
// // // //               <div className="flex flex-wrap gap-4 sm:gap-8 mb-8 border-y border-dark-100 py-4">
// // // //                 <div className="flex items-center gap-2">
// // // //                   <Calendar className="h-5 w-5 text-dark-400" />
// // // //                   <div>
// // // //                     <p className="text-xs text-dark-500">Date</p>
// // // //                     <p className="font-medium text-dark-900">{formatDate(event.date)}</p>
// // // //                   </div>
// // // //                 </div>
// // // //                 <div className="flex items-center gap-2">
// // // //                   <Clock className="h-5 w-5 text-dark-400" />
// // // //                   <div>
// // // //                     <p className="text-xs text-dark-500">Time</p>
// // // //                     <p className="font-medium text-dark-900">{event.time}</p>
// // // //                   </div>
// // // //                 </div>
// // // //                 <div className="flex items-center gap-2">
// // // //                   <MapPin className="h-5 w-5 text-dark-400" />
// // // //                   <div>
// // // //                     <p className="text-xs text-dark-500">Venue</p>
// // // //                     <p className="font-medium text-dark-900">{event.venue}</p>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>

// // // //               <h3 className="text-xl font-bold text-dark-900 mb-4">About this event</h3>
// // // //               <div className="prose prose-dark max-w-none text-dark-600 whitespace-pre-wrap">
// // // //                 {event.description}
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Merchandise Sidebar */}
// // // //           <div className="space-y-6">
// // // //             <div className="card p-6 sticky top-24">
// // // //               <h3 className="text-lg font-bold text-dark-900 mb-4">Merchandise</h3>
// // // //               <div className="space-y-3">
// // // //                 {merchItems.length === 0 && (
// // // //                   <p className="text-sm text-dark-500">No merchandise for this event.</p>
// // // //                 )}
// // // //                 {merchItems.map((m) => {
// // // //                   const available = m.totalQuantity - m.soldQuantity;
// // // //                   return (
// // // //                     <div key={m._id} className="border border-dark-100 rounded-xl p-3">
// // // //                       <div className="flex justify-between items-start gap-3">
// // // //                         <div>
// // // //                           <p className="font-semibold text-dark-900">{m.name}</p>
// // // //                           <p className="text-sm text-dark-500">Price: {formatCurrency(m.price)}</p>
// // // //                           <p className="text-xs text-dark-500">Available: {available}</p>
// // // //                           <div className="mt-2 space-y-1">
// // // //                             {m.bankDetails?.map((b,i)=>(
// // // //                               <p key={i} className="text-[11px] text-dark-500">
// // // //                                 {b.bankName} | {b.accountName} | {b.accountNumber} {b.branch && `| ${b.branch}`}
// // // //                               </p>
// // // //                             ))}
// // // //                           </div>
// // // //                         </div>
// // // //                         <Button size="sm" disabled={available <= 0} onClick={()=>openMerchModal(m)}>
// // // //                           {available <= 0 ? 'Sold out' : 'Buy'}
// // // //                         </Button>
// // // //                       </div>
// // // //                     </div>
// // // //                   );
// // // //                 })}
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* Merchandise Order Modal */}
// // // //       <Modal isOpen={merchModalOpen} onClose={() => setMerchModalOpen(false)} title="Buy Merchandise">
// // // //         {selectedMerch && (
// // // //           <form onSubmit={submitMerchOrder} className="space-y-6">
// // // //             <div className="bg-dark-50 p-4 rounded-xl border border-dark-200">
// // // //               <h4 className="font-bold text-dark-900 mb-1">{selectedMerch.name}</h4>
// // // //               <p className="text-sm text-dark-600">
// // // //                 Price: {formatCurrency(selectedMerch.price)} | Available: {selectedMerch.totalQuantity - selectedMerch.soldQuantity}
// // // //               </p>
// // // //             </div>

// // // //             <div>
// // // //               <label className="label-text">Quantity</label>
// // // //               <input
// // // //                 type="number"
// // // //                 min="1"
// // // //                 max={selectedMerch.totalQuantity - selectedMerch.soldQuantity}
// // // //                 value={qty}
// // // //                 onChange={(e)=>setQty(Math.max(1, Math.min(selectedMerch.totalQuantity - selectedMerch.soldQuantity, Number(e.target.value))))}
// // // //                 className="input mt-1"
// // // //                 required
// // // //               />
// // // //             </div>

// // // //             <div>
// // // //               <label className="label-text">Upload Payment Receipt *</label>
// // // //               <input
// // // //                 type="file"
// // // //                 accept="image/*,application/pdf"
// // // //                 className="input mt-1"
// // // //                 onChange={(e)=>setReceipt(e.target.files[0])}
// // // //                 required
// // // //               />
// // // //             </div>

// // // //             <div className="pt-2 flex justify-end gap-3">
// // // //               <Button type="button" variant="secondary" onClick={() => setMerchModalOpen(false)}>
// // // //                 Cancel
// // // //               </Button>
// // // //               <Button type="submit" isLoading={isSubmitting}>Submit</Button>
// // // //             </div>
// // // //           </form>
// // // //         )}
// // // //       </Modal>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default EventDetails;

// // // import React, { useEffect, useState } from 'react';
// // // import merchService from '../../services/merchService';
// // // import eventService from '../../services/eventService';
// // // import Button from '../../components/ui/Button';
// // // import Spinner from '../../components/ui/Spinner';
// // // import toast from 'react-hot-toast';
// // // import useAuth from '../../hooks/useAuth';
// // // import { formatCurrency } from '../../utils/formatCurrency';

// // // const blankBank = { bankName: '', accountName: '', accountNumber: '', branch: '' };

// // // const AddMerchandise = () => {
// // //   const { user } = useAuth();
// // //   const [events, setEvents] = useState([]);
// // //   const [selectedEvent, setSelectedEvent] = useState('');
// // //   const [banks, setBanks] = useState([blankBank]);
// // //   const [form, setForm] = useState({ name: '', price: '', totalQuantity: '', bannerImage: null });
// // //   const [preview, setPreview] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [saving, setSaving] = useState(false);
// // //   const [items, setItems] = useState([]);
// // //   const [editingId, setEditingId] = useState(null);

// // //   // load events and default selection
// // //   useEffect(() => {
// // //     const load = async () => {
// // //       setLoading(true);
// // //       try {
// // //         const resp = await eventService.getEvents({ page: 1, limit: 500 });
// // //         const evts = resp?.data?.data || resp?.data || resp;
// // //         const mine = (evts || []).filter((e) => {
// // //           const ownerId = typeof e.createdBy === 'string' ? e.createdBy : e.createdBy?._id;
// // //           return ownerId === user?._id;
// // //         });
// // //         setEvents(mine);
// // //         if (mine[0]) setSelectedEvent(mine[0]._id);
// // //       } catch (err) {
// // //         toast.error(err.response?.data?.message || 'Unable to load events');
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };
// // //     load();
// // //   }, [user]);

// // //   // load merch for selected event
// // //   useEffect(() => {
// // //     const loadItems = async () => {
// // //       if (!selectedEvent) return;
// // //       const list = await merchService.getEventMerch(selectedEvent);
// // //       setItems(list);
// // //     };
// // //     loadItems();
// // //   }, [selectedEvent]);

// // //   const handleBankChange = (idx, field, val) => {
// // //     const next = [...banks];
// // //     next[idx][field] = val;
// // //     setBanks(next);
// // //   };

// // //   const addBank = () => setBanks((b) => [...b, blankBank]);
// // //   const removeBank = (idx) => setBanks((b) => b.filter((_, i) => i !== idx));

// // //   const resetForm = () => {
// // //     setForm({ name: '', price: '', totalQuantity: '', bannerImage: null });
// // //     setBanks([blankBank]);
// // //     setPreview(null);
// // //     setEditingId(null);
// // //   };

// // //   const onFileChange = (file) => {
// // //     setForm((f) => ({ ...f, bannerImage: file }));
// // //     setPreview(file ? URL.createObjectURL(file) : null);
// // //   };

// // //   const submit = async (e) => {
// // //     e.preventDefault();
// // //     if (!selectedEvent) return toast.error('Select an event');
// // //     setSaving(true);
// // //     try {
// // //       if (editingId) {
// // //         await merchService.updateMerch(editingId, {
// // //           eventId: selectedEvent,
// // //           name: form.name,
// // //           price: form.price,
// // //           totalQuantity: form.totalQuantity,
// // //           bankDetails: banks,
// // //           bannerImage: form.bannerImage,
// // //         });
// // //         toast.success('Merchandise updated');
// // //       } else {
// // //         await merchService.createMerch({
// // //           eventId: selectedEvent,
// // //           name: form.name,
// // //           price: form.price,
// // //           totalQuantity: form.totalQuantity,
// // //           bankDetails: banks,
// // //           bannerImage: form.bannerImage,
// // //         });
// // //         toast.success('Merchandise created');
// // //       }
// // //       resetForm();
// // //       const list = await merchService.getEventMerch(selectedEvent);
// // //       setItems(list);
// // //     } catch (err) {
// // //       toast.error(err.response?.data?.message || 'Failed to save merchandise');
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   const startEdit = (item) => {
// // //     setEditingId(item._id);
// // //     setForm({
// // //       name: item.name,
// // //       price: item.price,
// // //       totalQuantity: item.totalQuantity,
// // //       bannerImage: null,
// // //     });
// // //     setBanks(item.bankDetails?.length ? item.bankDetails : [blankBank]);
// // //     setPreview(item.image || item.bannerImage || null);
// // //   };

// // //   const del = async (id) => {
// // //     if (!window.confirm('Delete this item?')) return;
// // //     await merchService.deleteMerch(id);
// // //     toast.success('Deleted');
// // //     setItems((prev) => prev.filter((m) => m._id !== id));
// // //     if (editingId === id) resetForm();
// // //   };

// // //   if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

// // //   return (
// // //     <div className="space-y-8">
// // //       <div className="flex items-center justify-between">
// // //         <div>
// // //           <h1 className="text-2xl font-bold text-dark-900">Merchandise</h1>
// // //           <p className="text-sm text-dark-500">Create, edit, and delete merchandise per event.</p>
// // //         </div>
// // //       </div>

// // //       <div className="grid lg:grid-cols-3 gap-6">
// // //         {/* Form */}
// // //         <div className="card p-5 lg:col-span-1">
// // //           <h3 className="text-lg font-semibold text-dark-900 mb-3">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
// // //           <form onSubmit={submit} className="space-y-4">
// // //             <select className="input" value={selectedEvent} onChange={(e)=>setSelectedEvent(e.target.value)} required>
// // //               <option value="" disabled>Select Event</option>
// // //               {events.map(ev => (
// // //                 <option key={ev._id} value={ev._id}>{ev.title}</option>
// // //               ))}
// // //             </select>
// // //             <input className="input" placeholder="Merchandise Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
// // //             <div className="grid grid-cols-2 gap-3">
// // //               <input className="input" type="number" min="0" placeholder="Price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} required />
// // //               <input className="input" type="number" min="1" placeholder="Total Quantity" value={form.totalQuantity} onChange={(e)=>setForm({...form,totalQuantity:e.target.value})} required />
// // //             </div>

// // //             <div className="space-y-2">
// // //               <label className="label-text">Item Image</label>
// // //               <input className="input" type="file" accept="image/*" onChange={(e)=>onFileChange(e.target.files[0])} />
// // //               {preview && <img src={preview} alt="preview" className="h-24 w-full object-cover rounded-lg border border-dark-100" />}
// // //             </div>

// // //             <div className="space-y-3">
// // //               <div className="flex items-center justify-between">
// // //                 <h4 className="font-semibold text-dark-800">Bank Details</h4>
// // //                 <Button type="button" variant="secondary" size="sm" onClick={addBank}>Add Bank</Button>
// // //               </div>
// // //               {banks.map((b, idx) => (
// // //                 <div key={idx} className="rounded-xl border border-dark-100 p-3 space-y-2 bg-dark-50">
// // //                   <div className="grid grid-cols-2 gap-2">
// // //                     <input className="input" placeholder="Bank Name" value={b.bankName} onChange={(e)=>handleBankChange(idx,'bankName',e.target.value)} required />
// // //                     <input className="input" placeholder="Account Name" value={b.accountName} onChange={(e)=>handleBankChange(idx,'accountName',e.target.value)} required />
// // //                     <input className="input" placeholder="Account Number" value={b.accountNumber} onChange={(e)=>handleBankChange(idx,'accountNumber',e.target.value)} required />
// // //                     <input className="input" placeholder="Branch (optional)" value={b.branch} onChange={(e)=>handleBankChange(idx,'branch',e.target.value)} />
// // //                   </div>
// // //                   {banks.length > 1 && (
// // //                     <div className="flex justify-end">
// // //                       <Button variant="secondary" size="sm" type="button" onClick={()=>removeBank(idx)}>Remove</Button>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               ))}
// // //             </div>

// // //             <div className="flex justify-end gap-2 pt-2">
// // //               {editingId && (
// // //                 <Button type="button" variant="secondary" onClick={resetForm}>
// // //                   Cancel
// // //                 </Button>
// // //               )}
// // //               <Button type="submit" isLoading={saving}>{editingId ? 'Update' : 'Create'}</Button>
// // //             </div>
// // //           </form>
// // //         </div>

// // //         {/* Items list */}
// // //         <div className="lg:col-span-2 space-y-4">
// // //           {items.length === 0 && (
// // //             <div className="card p-6 text-sm text-dark-500">No merchandise for this event yet.</div>
// // //           )}
// // //           {items.map((m) => (
// // //             <div key={m._id} className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // //               <div className="flex gap-3">
// // //                 <div className="h-20 w-20 rounded-xl overflow-hidden bg-dark-50 border border-dark-100">
// // //                   {m.image || m.bannerImage ? (
// // //                     <img src={m.image || m.bannerImage} alt={m.name} className="h-full w-full object-cover" />
// // //                   ) : (
// // //                     <div className="flex items-center justify-center h-full text-xs text-dark-400">No Image</div>
// // //                   )}
// // //                 </div>
// // //                 <div>
// // //                   <p className="font-semibold text-dark-900">{m.name}</p>
// // //                   <p className="text-sm text-dark-500">Price: {formatCurrency(m.price)}</p>
// // //                   <p className="text-xs text-dark-500">Available: {m.totalQuantity - m.soldQuantity} / {m.totalQuantity}</p>
// // //                   <div className="mt-1 space-y-1">
// // //                     {m.bankDetails?.map((b,i)=>(
// // //                       <p key={i} className="text-[11px] text-dark-500">
// // //                         {b.bankName} | {b.accountName} | {b.accountNumber} {b.branch && `| ${b.branch}`}
// // //                       </p>
// // //                     ))}
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //               <div className="flex gap-2">
// // //                 <Button variant="secondary" size="sm" onClick={()=>startEdit(m)}>Edit</Button>
// // //                 <Button variant="danger" size="sm" onClick={()=>del(m._id)}>Delete</Button>
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default AddMerchandise;

// // import React, { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { Calendar, MapPin, Clock, Building2 } from 'lucide-react';
// // import toast from 'react-hot-toast';
// // import eventService from '../../services/eventService';
// // import merchService from '../../services/merchService';
// // import useAuth from '../../hooks/useAuth';
// // import Button from '../../components/ui/Button';
// // import Spinner from '../../components/ui/Spinner';
// // import Badge from '../../components/ui/Badge';
// // import Modal from '../../components/ui/Modal';
// // import { formatDate } from '../../utils/formatDate';
// // import { formatCurrency } from '../../utils/formatCurrency';

// // const EventDetails = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const { user } = useAuth();
  
// //   const [event, setEvent] = useState(null);
// //   const [isLoading, setIsLoading] = useState(true);

// //   const [merchItems, setMerchItems] = useState([]);
// //   const [selectedMerch, setSelectedMerch] = useState(null);
// //   const [qty, setQty] = useState(1);
// //   const [receipt, setReceipt] = useState(null);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [merchModalOpen, setMerchModalOpen] = useState(false);

// //   useEffect(() => {
// //     const fetchEventData = async () => {
// //       try {
// //         const response = await eventService.getEventById(id);
// //         setEvent(response);
// //         const merch = await merchService.getEventMerch(id);
// //         setMerchItems(merch);
// //       } catch (error) {
// //         toast.error('Failed to load event details');
// //         navigate('/events');
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };
// //     fetchEventData();
// //   }, [id, navigate]);

// //   const openMerchModal = (item) => {
// //     if (!user) {
// //       toast.error('Please login to buy merchandise');
// //       navigate('/login');
// //       return;
// //     }
// //     setSelectedMerch(item);
// //     setQty(1);
// //     setReceipt(null);
// //     setMerchModalOpen(true);
// //   };

// //   const submitMerchOrder = async (e) => {
// //     e.preventDefault();
// //     if (!selectedMerch) return toast.error('Select an item');
// //     if (!receipt) return toast.error('Upload payment receipt');

// //     setIsSubmitting(true);
// //     try {
// //       await merchService.placeOrder({
// //         merchandiseId: selectedMerch._id,
// //         quantity: qty,
// //         receiptImage: receipt
// //       });
// //       toast.success('Order submitted. Await approval.');
// //       setMerchModalOpen(false);
// //       const merch = await merchService.getEventMerch(id);
// //       setMerchItems(merch);
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || 'Failed to submit order');
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
// //   if (!event) return null;

// //   return (
// //     <div className="pb-12">
// //       <div className="mx-auto max-w-5xl space-y-8">
// //         {/* Banner */}
// //         <div className="relative h-64 sm:h-96 w-full overflow-hidden rounded-3xl bg-dark-100 shadow-sm">
// //           {event.bannerImage ? (
// //             <img src={event.bannerImage} alt={event.title} className="h-full w-full object-cover" />
// //           ) : (
// //              <div className="h-full w-full bg-gradient-to-br from-primary-700 to-dark-900 flex items-center justify-center">
// //                 <span className="text-white/20 font-bold text-6xl tracking-widest uppercase">{event.title.substring(0,3)}</span>
// //              </div>
// //           )}
// //           <div className="absolute top-6 right-6">
// //             <Badge status={event.status}>{event.status}</Badge>
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
// //           {/* Main Info */}
// //           <div className="lg:col-span-2 space-y-8">
// //             <div className="card p-6 sm:p-8">
// //               {event.club && (
// //                 <div className="mb-4 flex items-center gap-3">
// //                   <div className="h-8 w-8 overflow-hidden rounded-md border border-dark-200 bg-white">
// //                     {event.club.logo ? (
// //                       <img src={event.club.logo} alt={event.club.clubName} className="h-full w-full object-cover" />
// //                     ) : (
// //                       <div className="flex h-full w-full items-center justify-center bg-dark-50">
// //                         <Building2 className="h-4 w-4 text-dark-400" />
// //                       </div>
// //                     )}
// //                   </div>
// //                   <span className="text-sm font-semibold text-primary-600">{event.club.clubName}</span>
// //                 </div>
// //               )}
              
// //               <h1 className="text-3xl font-bold text-dark-900 sm:text-4xl mb-6">{event.title}</h1>
              
// //               <div className="flex flex-wrap gap-4 sm:gap-8 mb-8 border-y border-dark-100 py-4">
// //                 <div className="flex items-center gap-2">
// //                   <Calendar className="h-5 w-5 text-dark-400" />
// //                   <div>
// //                     <p className="text-xs text-dark-500">Date</p>
// //                     <p className="font-medium text-dark-900">{formatDate(event.date)}</p>
// //                   </div>
// //                 </div>
// //                 <div className="flex items-center gap-2">
// //                   <Clock className="h-5 w-5 text-dark-400" />
// //                   <div>
// //                     <p className="text-xs text-dark-500">Time</p>
// //                     <p className="font-medium text-dark-900">{event.time}</p>
// //                   </div>
// //                 </div>
// //                 <div className="flex items-center gap-2">
// //                   <MapPin className="h-5 w-5 text-dark-400" />
// //                   <div>
// //                     <p className="text-xs text-dark-500">Venue</p>
// //                     <p className="font-medium text-dark-900">{event.venue}</p>
// //                   </div>
// //                 </div>
// //               </div>

// //               <h3 className="text-xl font-bold text-dark-900 mb-4">About this event</h3>
// //               <div className="prose prose-dark max-w-none text-dark-600 whitespace-pre-wrap">
// //                 {event.description}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Merchandise Sidebar */}
// //           <div className="space-y-6">
// //             <div className="card p-6 sticky top-24">
// //               <h3 className="text-lg font-bold text-dark-900 mb-4">Merchandise</h3>
// //               <div className="space-y-3">
// //                 {merchItems.length === 0 && (
// //                   <p className="text-sm text-dark-500">No merchandise for this event.</p>
// //                 )}
// //                 {merchItems.map((m) => {
// //                   const available = m.totalQuantity - m.soldQuantity;
// //                   return (
// //                     <div key={m._id} className="border border-dark-100 rounded-xl p-3">
// //                       <div className="flex justify-between items-start gap-3">
// //                         <div className="flex gap-3">
// //                           <div className="h-16 w-16 rounded-lg overflow-hidden bg-dark-50 border border-dark-100">
// //                             {m.image || m.bannerImage ? (
// //                               <img src={m.image || m.bannerImage} alt={m.name} className="h-full w-full object-cover" />
// //                             ) : (
// //                               <div className="flex items-center justify-center h-full text-[10px] text-dark-400">No Image</div>
// //                             )}
// //                           </div>
// //                           <div>
// //                             <p className="font-semibold text-dark-900">{m.name}</p>
// //                             <p className="text-sm text-dark-500">Price: {formatCurrency(m.price)}</p>
// //                             <p className="text-xs text-dark-500">Available: {available}</p>
// //                             <div className="mt-1 space-y-1">
// //                               {m.bankDetails?.map((b,i)=>(
// //                                 <p key={i} className="text-[11px] text-dark-500">
// //                                   {b.bankName} | {b.accountName} | {b.accountNumber} {b.branch && `| ${b.branch}`}
// //                                 </p>
// //                               ))}
// //                             </div>
// //                           </div>
// //                         </div>
// //                         <Button size="sm" disabled={available <= 0} onClick={()=>openMerchModal(m)}>
// //                           {available <= 0 ? 'Sold out' : 'Buy'}
// //                         </Button>
// //                       </div>
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Merchandise Order Modal */}
// //       <Modal isOpen={merchModalOpen} onClose={() => setMerchModalOpen(false)} title="Buy Merchandise">
// //         {selectedMerch && (
// //           <form onSubmit={submitMerchOrder} className="space-y-6">
// //             <div className="bg-dark-50 p-4 rounded-xl border border-dark-200">
// //               <h4 className="font-bold text-dark-900 mb-1">{selectedMerch.name}</h4>
// //               <p className="text-sm text-dark-600">
// //                 Price: {formatCurrency(selectedMerch.price)} | Available: {selectedMerch.totalQuantity - selectedMerch.soldQuantity}
// //               </p>
// //               <p className="text-sm text-primary-700 mt-1">Total: {formatCurrency(selectedMerch.price * qty)}</p>
// //             </div>

// //             <div>
// //               <label className="label-text">Quantity</label>
// //               <input
// //                 type="number"
// //                 min="1"
// //                 max={selectedMerch.totalQuantity - selectedMerch.soldQuantity}
// //                 value={qty}
// //                 onChange={(e)=>setQty(Math.max(1, Math.min(selectedMerch.totalQuantity - selectedMerch.soldQuantity, Number(e.target.value))))}
// //                 className="input mt-1"
// //                 required
// //               />
// //             </div>

// //             <div>
// //               <label className="label-text">Upload Payment Receipt *</label>
// //               <input
// //                 type="file"
// //                 accept="image/*,application/pdf"
// //                 className="input mt-1"
// //                 onChange={(e)=>setReceipt(e.target.files[0])}
// //                 required
// //               />
// //             </div>

// //             <div className="pt-2 flex justify-end gap-3">
// //               <Button type="button" variant="secondary" onClick={() => setMerchModalOpen(false)}>
// //                 Cancel
// //               </Button>
// //               <Button type="submit" isLoading={isSubmitting}>Submit</Button>
// //             </div>
// //           </form>
// //         )}
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default EventDetails;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Calendar, MapPin, Clock, Building2 } from 'lucide-react';
// import toast from 'react-hot-toast';
// import eventService from '../../services/eventService';
// import merchService from '../../services/merchService';
// import useAuth from '../../hooks/useAuth';
// import Button from '../../components/ui/Button';
// import Spinner from '../../components/ui/Spinner';
// import Badge from '../../components/ui/Badge';
// import Modal from '../../components/ui/Modal';
// import { formatDate } from '../../utils/formatDate';
// import { formatCurrency } from '../../utils/formatCurrency';

// const EventDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [event, setEvent] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const [merchItems, setMerchItems] = useState([]);
//   const [selectedMerch, setSelectedMerch] = useState(null);
//   const [qty, setQty] = useState(1);
//   const [receipt, setReceipt] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [merchModalOpen, setMerchModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchEventData = async () => {
//       try {
//         const response = await eventService.getEventById(id);
//         setEvent(response);
//         const merch = await merchService.getEventMerch(id);
//         setMerchItems(merch);
//       } catch (error) {
//         toast.error('Failed to load event details');
//         navigate('/events');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchEventData();
//   }, [id, navigate]);

//   const openMerchModal = (item) => {
//     if (!user) {
//       toast.error('Please login to buy merchandise');
//       navigate('/login');
//       return;
//     }
//     setSelectedMerch(item);
//     setQty(1);
//     setReceipt(null);
//     setMerchModalOpen(true);
//   };

//   const submitMerchOrder = async (e) => {
//     e.preventDefault();
//     if (!selectedMerch) return toast.error('Select an item');
//     if (!receipt) return toast.error('Upload payment receipt');

//     setIsSubmitting(true);
//     try {
//       await merchService.placeOrder({
//         merchandiseId: selectedMerch._id,
//         quantity: qty,
//         receiptImage: receipt,
//       });
//       toast.success('Order submitted. Await approval.');
//       setMerchModalOpen(false);
//       const merch = await merchService.getEventMerch(id);
//       setMerchItems(merch);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to submit order');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
//   if (!event) return null;

//   return (
//     <div className="pb-12">
//       <div className="mx-auto max-w-6xl space-y-8">
//         {/* Banner */}
//         <div className="relative h-64 sm:h-96 w-full overflow-hidden rounded-3xl bg-dark-100 shadow-sm">
//           {event.bannerImage ? (
//             <img src={event.bannerImage} alt={event.title} className="h-full w-full object-cover" />
//           ) : (
//              <div className="h-full w-full bg-gradient-to-br from-primary-700 to-dark-900 flex items-center justify-center">
//                 <span className="text-white/20 font-bold text-6xl tracking-widest uppercase">{event.title.substring(0,3)}</span>
//              </div>
//           )}
//           <div className="absolute top-6 right-6">
//             <Badge status={event.status}>{event.status}</Badge>
//           </div>
//         </div>

//         {/* Event Info */}
//         <div className="card p-6 sm:p-8">
//           {event.club && (
//             <div className="mb-4 flex items-center gap-3">
//               <div className="h-8 w-8 overflow-hidden rounded-md border border-dark-200 bg-white">
//                 {event.club.logo ? (
//                   <img src={event.club.logo} alt={event.club.clubName} className="h-full w-full object-cover" />
//                 ) : (
//                   <div className="flex h-full w-full items-center justify-center bg-dark-50">
//                     <Building2 className="h-4 w-4 text-dark-400" />
//                   </div>
//                 )}
//               </div>
//               <span className="text-sm font-semibold text-primary-600">{event.club.clubName}</span>
//             </div>
//           )}

//           <h1 className="text-3xl font-bold text-dark-900 sm:text-4xl mb-6">{event.title}</h1>

//           <div className="flex flex-wrap gap-4 sm:gap-8 mb-8 border-y border-dark-100 py-4">
//             <div className="flex items-center gap-2">
//               <Calendar className="h-5 w-5 text-dark-400" />
//               <div>
//                 <p className="text-xs text-dark-500">Date</p>
//                 <p className="font-medium text-dark-900">{formatDate(event.date)}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <Clock className="h-5 w-5 text-dark-400" />
//               <div>
//                 <p className="text-xs text-dark-500">Time</p>
//                 <p className="font-medium text-dark-900">{event.time}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <MapPin className="h-5 w-5 text-dark-400" />
//               <div>
//                 <p className="text-xs text-dark-500">Venue</p>
//                 <p className="font-medium text-dark-900">{event.venue}</p>
//               </div>
//             </div>
//           </div>

//           <h3 className="text-xl font-bold text-dark-900 mb-4">About this event</h3>
//           <div className="prose prose-dark max-w-none text-dark-600 whitespace-pre-wrap">
//             {event.description}
//           </div>
//         </div>

//         {/* Merchandise Grid */}
//         <div className="space-y-4">
//           <h3 className="text-xl font-bold text-dark-900">Merchandise</h3>
//           {merchItems.length === 0 && (
//             <div className="card p-6 text-sm text-dark-500">No merchandise for this event.</div>
//           )}
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {merchItems.map((m) => {
//               const available = m.totalQuantity - m.soldQuantity;
//               return (
//                 <div key={m._id} className="card p-3 sm:p-4 hover:shadow-lg transition-shadow duration-150">
//                   <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-dark-50 border border-dark-100">
//                     {m.image ? (
//                       <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
//                     ) : (
//                       <div className="flex items-center justify-center h-full text-xs text-dark-400">No Image</div>
//                     )}
//                   </div>
//                   <div className="mt-3 flex items-start justify-between">
//                     <div className="space-y-1">
//                       <p className="text-xs text-dark-400 uppercase tracking-wide">New</p>
//                       <p className="font-semibold text-dark-900">{m.name}</p>
//                       <p className="text-xs text-dark-500">Venue: {m.venue}</p>
//                     </div>
//                     <div className="text-xs text-dark-400 flex flex-col items-end gap-1">
//                       <button className="h-7 w-7 flex items-center justify-center rounded-full border border-dark-100 text-dark-400" title="Wishlist">♡</button>
//                       <button className="h-7 w-7 flex items-center justify-center rounded-full border border-dark-100 text-dark-400" title="Preview">👁</button>
//                     </div>
//                   </div>
//                   <div className="mt-3 font-semibold text-dark-900">{formatCurrency(m.price)}</div>
//                   <div className="mt-1 text-xs text-dark-500">Available: {available}</div>
//                   <Button
//                     className="mt-3 w-full"
//                     disabled={available <= 0}
//                     onClick={() => openMerchModal(m)}
//                   >
//                     {available <= 0 ? 'Sold out' : 'Buy'}
//                   </Button>
              
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Merchandise Order Modal */}
//       <Modal isOpen={merchModalOpen} onClose={() => setMerchModalOpen(false)} title="Buy Merchandise">
//         {selectedMerch && (
//           <form onSubmit={submitMerchOrder} className="space-y-6">
//             <div className="bg-dark-50 p-4 rounded-xl border border-dark-200">
//               <h4 className="font-bold text-dark-900 mb-1">{selectedMerch.name}</h4>
//               <p className="text-sm text-dark-600">
//                 Price: {formatCurrency(selectedMerch.price)} | Available: {selectedMerch.totalQuantity - selectedMerch.soldQuantity}
//               </p>
//               <p className="text-sm text-primary-700 mt-1">Total: {formatCurrency(selectedMerch.price * qty)}</p>
//             </div>

//             <div>
//               <label className="label-text">Quantity</label>
//               <input
//                 type="number"
//                 min="1"
//                 max={selectedMerch.totalQuantity - selectedMerch.soldQuantity}
//                 value={qty}
//                 onChange={(e)=>setQty(Math.max(1, Math.min(selectedMerch.totalQuantity - selectedMerch.soldQuantity, Number(e.target.value))))}
//                 className="input mt-1"
//                 required
//               />
//             </div>

//             <div>
//               <label className="label-text">Upload Payment Receipt *</label>
//               <input
//                 type="file"
//                 accept="image/*,application/pdf"
//                 className="input mt-1"
//                 onChange={(e)=>setReceipt(e.target.files[0])}
//                 required
//               />
//             </div>

//             <div className="pt-2 flex justify-end gap-3">
//               <Button type="button" variant="secondary" onClick={() => setMerchModalOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" isLoading={isSubmitting}>Submit</Button>
//             </div>
//           </form>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default EventDetails;


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
    setMerchModalOpen(true);
  };

  const submitMerchOrder = async (e) => {
    e.preventDefault();
    if (!selectedMerch) return toast.error('Select an item');
    if (!receipt) return toast.error('Upload payment receipt');

    setIsSubmitting(true);
    try {
      await merchService.placeOrder({
        merchandiseId: selectedMerch._id,
        quantity: qty,
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

        {/* Event Info */}
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

        {/* Merchandise Grid */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-dark-900">Merchandise</h3>
          {merchItems.length === 0 && (
            <div className="card p-6 text-sm text-dark-500">No merchandise for this event.</div>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {merchItems.map((m) => {
              const available = m.totalQuantity - m.soldQuantity;
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

      {/* Merchandise Order Modal */}
      <Modal isOpen={merchModalOpen} onClose={() => setMerchModalOpen(false)} title="Buy Merchandise">
        {selectedMerch && (
          <form onSubmit={submitMerchOrder} className="space-y-6">
            <div className="bg-dark-50 p-4 rounded-xl border border-dark-200">
              <h4 className="font-bold text-dark-900 mb-1">{selectedMerch.name}</h4>
              <p className="text-sm text-dark-600">
                Price: {formatCurrency(selectedMerch.price)} | Available: {selectedMerch.totalQuantity - selectedMerch.soldQuantity}
              </p>
              <p className="text-sm text-primary-700 mt-1">Total: {formatCurrency(selectedMerch.price * qty)}</p>
            </div>

            {/* Bank details in real-world readable format */}
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

            <div>
              <label className="label-text">Quantity</label>
              <input
                type="number"
                min="1"
                max={selectedMerch.totalQuantity - selectedMerch.soldQuantity}
                value={qty}
                onChange={(e)=>setQty(Math.max(1, Math.min(selectedMerch.totalQuantity - selectedMerch.soldQuantity, Number(e.target.value))))}
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
                onChange={(e)=>setReceipt(e.target.files[0])}
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