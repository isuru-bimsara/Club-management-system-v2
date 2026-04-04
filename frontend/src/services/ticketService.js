import api from './api';

const ticketService = {
  purchaseTicket: async (formData) => {
    const response = await api.post('/tickets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  getMyTickets: async (params = { page: 1, limit: 10 }) => {
    const response = await api.get('/tickets/my', { params });
    return response.data;
  },
  
  getClubTickets: async (clubId, params = { page: 1, limit: 10 }) => {
    const response = await api.get(`/tickets/club/${clubId}`, { params });
    return response.data;
  },
  
  approveTicket: async (id) => {
    const response = await api.put(`/tickets/${id}/approve`);
    return response.data;
  },
  
  rejectTicket: async (id, rejectionReason) => {
    const response = await api.put(`/tickets/${id}/reject`, { rejectionReason });
    return response.data;
  }
};

export default ticketService;
