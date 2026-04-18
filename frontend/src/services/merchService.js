import api from './api';

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

const merchService = {
  getMyMerchandise: async () => (await api.get('/merch/president')).data,

  createMerch: async (payload) => {
    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (k === 'bankDetails' || k === 'sizes') form.append(k, JSON.stringify(v));
      else if (k === 'merchImage') form.append('merchImage', v);
      else form.append(k, v);
    });
    return (await api.post('/merch/president', form, multipart)).data;
  },

  updateMerch: async (id, payload) => {
    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (k === 'bankDetails' || k === 'sizes') form.append(k, JSON.stringify(v));
      else if (k === 'merchImage') form.append('merchImage', v);
      else form.append(k, v);
    });
    return (await api.put(`/merch/president/${id}`, form, multipart)).data;
  },

  deleteMerch: async (id) => (await api.delete(`/merch/president/${id}`)).data,
  getOrdersForPresident: async () => (await api.get('/merch/president/orders')).data,
  updateOrderStatus: async (id, status) =>
    (await api.put(`/merch/president/orders/${id}`, { status })).data,

  getEventMerch: async (eventId) => (await api.get(`/merch/event/${eventId}`)).data,

  placeOrder: async ({ merchandiseId, quantity, size, receiptImage }) => {
    const form = new FormData();
    form.append('merchandiseId', merchandiseId);
    form.append('quantity', quantity);
    if (size) form.append('size', size); // NEW
    form.append('receiptImage', receiptImage);
    return (await api.post('/merch/order', form, multipart)).data;
  },

  myOrders: async () => (await api.get('/merch/orders/me')).data,
};

export default merchService;