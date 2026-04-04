import React from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { Download, Calendar, MapPin, Ticket as TicketIcon, AlertCircle } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

const TicketCard = ({ ticket }) => {
  const ticketRef = React.useRef(null);

  const handleDownload = async () => {
    try {
      if (!ticketRef.current) return;
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `ticket-${ticket.event.title.replace(/\s+/g, '-').toLowerCase()}-${ticket.eTicketCode.substring(0,8)}.png`;
      link.href = image;
      link.click();
      toast.success('Ticket downloaded successfully');
    } catch (error) {
      toast.error('Failed to download ticket');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div 
        ref={ticketRef}
        className={`card h-full flex flex-col relative overflow-hidden transition-shadow duration-300 hover:shadow-md ${
          ticket.status === 'approved' ? 'border-t-4 border-t-green-500' : 
          ticket.status === 'rejected' ? 'border-t-4 border-t-red-500' : 
          'border-t-4 border-t-yellow-500'
        }`}
      >
        <div className="absolute top-4 right-4 z-10">
          <Badge status={ticket.status}>{ticket.status}</Badge>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
               {ticket.event?.club?.logo ? (
                <img src={ticket.event.club.logo} alt="" className="h-8 w-8 object-contain" />
               ) : (
                <TicketIcon className="h-6 w-6 text-primary-600" />
               )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-dark-900 line-clamp-1">{ticket.event.title}</h3>
              <p className="text-sm text-dark-500">{ticket.event?.club?.clubName}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6 flex-1">
            <div className="flex items-center gap-2 text-sm text-dark-600">
              <Calendar className="h-4 w-4 text-dark-400 shrink-0" />
              <span>{formatDate(ticket.event.date)} at {ticket.event.time}</span>
            </div>
            <div className="flex flex-start gap-2 text-sm text-dark-600">
              <MapPin className="h-4 w-4 text-dark-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{ticket.event.venue}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-dark-200 my-4 relative">
             <div className="absolute -left-8 -top-3 h-6 w-6 rounded-full bg-dark-50"></div>
             <div className="absolute -right-8 -top-3 h-6 w-6 rounded-full bg-dark-50"></div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-dark-500 mb-1">Ticket Info</p>
              <p className="font-semibold text-dark-900">{ticket.quantity} x {ticket.quantity === 1 ? 'Admit 1' : `Admit ${ticket.quantity}`}</p>
              <p className="font-bold text-primary-600 mt-1">{formatCurrency(ticket.totalAmount)}</p>
            </div>
            
            {ticket.status === 'approved' && ticket.eTicketCode && (
              <div className="flex flex-col items-center">
                <div className="bg-white p-1 rounded-lg border border-dark-100 shadow-sm">
                  {ticket.qrCodeImage ? (
                    <img src={ticket.qrCodeImage} alt="QR Code" className="h-20 w-20" />
                  ) : (
                    <QRCode value={ticket.eTicketCode} size={80} level="M" />
                  )}
                </div>
                <span className="text-[10px] text-dark-400 mt-1 font-mono uppercase tracking-wider">{ticket.eTicketCode.substring(0,8)}</span>
              </div>
            )}
          </div>

          {ticket.status === 'rejected' && ticket.rejectionReason && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg text-sm text-red-800 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{ticket.rejectionReason}</span>
            </div>
          )}
        </div>
      </div>
      
      {ticket.status === 'approved' && (
        <button
          onClick={handleDownload}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dark-200 bg-white px-4 py-2.5 text-sm font-medium text-dark-700 shadow-sm hover:bg-dark-50 hover:text-dark-900 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download E-Ticket
        </button>
      )}
    </div>
  );
};

export default TicketCard;
