import React, { useEffect, useState } from 'react';
import merchService from '../../services/merchService';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const MyMerch = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    merchService
      .myOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (url, orderId) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Invoice-${orderId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download PDF');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark-900">My Merchandise</h1>

      <div className="grid gap-4">
        {orders.map((o) => (
          <div key={o._id} className="card p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-dark-900">{o.merchandise?.name}</p>
              {o.size && <p className="text-sm text-dark-500">Size: {o.size}</p>}
              <p className="text-sm text-dark-500">Qty: {o.quantity}</p>
              <p className="text-sm text-dark-500">Amount: {formatCurrency(o.amount)}</p>
              <p className="text-xs text-dark-400">Submitted {formatDateTime(o.createdAt)}</p>
              <p className="text-xs text-dark-500">Venue: {o.pickupVenue || 'Will be notified'}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[o.status]}`}>
                {o.status}
              </span>

              {o.status === 'approved' && o.invoicePdf && (
                <button
                  onClick={() => handleDownload(o.invoicePdf, o._id)}
                  className="text-primary-600 text-sm font-semibold hover:underline"
                >
                  Download Payment Confirmation
                </button>
              )}
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-sm text-dark-500">No purchases yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyMerch;