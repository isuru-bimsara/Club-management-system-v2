import React, { useState } from 'react';
import { formatDateTime } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import { Check, X, FileText } from 'lucide-react';

const ReceiptInbox = ({ tickets, onApprove, onReject, isLoading }) => {
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [ticketToReject, setTicketToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleOpenReject = (ticket) => {
    setTicketToReject(ticket);
    setRejectionReason('Payment verification failed');
    setRejectModalOpen(true);
  };

  const submitReject = () => {
    if (ticketToReject) {
      onReject(ticketToReject._id, rejectionReason);
      setRejectModalOpen(false);
      setTicketToReject(null);
    }
  };

  const isPdf = (url) => typeof url === 'string' && url.endsWith('.pdf');

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-dark-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-dark-600">
          <thead className="bg-dark-50 text-dark-900">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">Student</th>
              <th scope="col" className="px-6 py-4 font-semibold">Event</th>
              <th scope="col" className="px-6 py-4 font-semibold">Details</th>
              <th scope="col" className="px-6 py-4 font-semibold text-center">Receipt</th>
              <th scope="col" className="px-6 py-4 font-semibold text-center">Status</th>
              <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-200">
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="hover:bg-dark-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-dark-900">{ticket.student?.name}</div>
                  <div className="text-xs text-dark-500">{ticket.student?.studentId}</div>
                  <div className="text-xs text-dark-500">{ticket.student?.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-dark-900 line-clamp-1 max-w-[200px]">{ticket.event?.title}</div>
                  <div className="text-xs text-dark-500">{formatDateTime(ticket.createdAt, '00:00')}</div>
                </td>
                <td className="px-6 py-4">
                  <div><span className="text-dark-500">Qty:</span> <span className="font-medium text-dark-900">{ticket.quantity}</span></div>
                  <div><span className="text-dark-500">Amt:</span> <span className="font-medium text-dark-900 text-primary-600">{formatCurrency(ticket.totalAmount)}</span></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    {ticket.receiptImage && ticket.receiptImage !== 'free_event' ? (
                      isPdf(ticket.receiptImage) ? (
                        <button 
                          onClick={() => setSelectedReceipt(ticket.receiptImage)}
                          className="flex h-12 w-12 items-center justify-center rounded-lg border border-dark-200 bg-dark-50 cursor-pointer hover:border-primary-400 focus:outline-none"
                        >
                          <FileText className="h-6 w-6 text-dark-500" />
                        </button>
                      ) : (
                        <img 
                          src={ticket.receiptImage} 
                          alt="Receipt" 
                          className="h-12 w-16 rounded-lg object-cover cursor-pointer border border-dark-200 hover:border-primary-400"
                          onClick={() => setSelectedReceipt(ticket.receiptImage)}
                        />
                      )
                    ) : (
                      <span className="text-xs italic text-dark-400">Free Event</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <Badge status={ticket.status}>{ticket.status}</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  {ticket.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onApprove(ticket._id)}
                        disabled={isLoading}
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50"
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenReject(ticket)}
                        disabled={isLoading}
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Receipt Image Modal */}
      <Modal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        title="Payment Receipt"
      >
        <div className="flex flex-col items-center">
          {selectedReceipt && isPdf(selectedReceipt) ? (
            <div className="w-full h-96">
              <iframe src={selectedReceipt} width="100%" height="100%" title="PDF Receipt"></iframe>
              <div className="mt-4 flex justify-center">
                <a 
                  href={selectedReceipt} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  Open PDF in new tab
                </a>
              </div>
            </div>
          ) : (
            <img 
              src={selectedReceipt} 
              alt="Receipt Preview" 
              className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
            />
          )}
        </div>
      </Modal>

      {/* Reject Reason Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Ticket Request"
      >
        <div className="space-y-4">
          <p className="text-sm text-dark-600">
            Please provide a reason for rejecting this ticket request. The student will be notified.
          </p>
          <div>
            <label className="label-text">Rejection Reason</label>
            <select
              className="input-field"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            >
              <option value="Payment verification failed">Payment verification failed</option>
              <option value="Incorrect payment amount">Incorrect payment amount</option>
              <option value="Receipt image unclear">Receipt image unclear</option>
              <option value="Event is sold out">Event is sold out</option>
              <option value="Other">Other (Contact support)</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button 
              className="btn btn-secondary"
              onClick={() => setRejectModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-danger"
              onClick={submitReject}
              disabled={isLoading}
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReceiptInbox;
