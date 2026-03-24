import api from './api';

const notificationService = {
  getNotifications: async (params = { page: 1, limit: 10 }) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },
  
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
  
  broadcastMessage: async (data) => {
    const response = await api.post('/notifications/broadcast', data);
    return response.data;
  }
};

export default notificationService;
