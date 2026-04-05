//frontend/src/services/adminService.js
import api from './api';

const adminService = {
  getUsers: async (params = { page: 1, limit: 10 }) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  changeUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },
  
  banUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/ban`);
    return response.data;
  },
  
  unbanUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/unban`);
    return response.data;
  },
  
  getReports: async (params) => {
    const response = await api.get('/admin/reports', { params });
    return response.data;
  }
};

export default adminService;
