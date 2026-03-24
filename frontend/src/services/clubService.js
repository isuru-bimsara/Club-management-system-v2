import api from './api';

const clubService = {
  getClubs: async (params = { page: 1, limit: 10 }) => {
    const response = await api.get('/clubs', { params });
    return response.data;
  },
  
  getClubById: async (id) => {
    const response = await api.get(`/clubs/${id}`);
    return response.data;
  },
  
  createClub: async (formData) => {
    const response = await api.post('/clubs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  updateClub: async (id, formData) => {
    const response = await api.put(`/clubs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  deleteClub: async (id) => {
    const response = await api.delete(`/clubs/${id}`);
    return response.data;
  },
  
  joinClub: async (id) => {
    const response = await api.post(`/clubs/${id}/join`);
    return response.data;
  },
  
  leaveClub: async (id) => {
    const response = await api.delete(`/clubs/${id}/leave`);
    return response.data;
  },
  
  getClubMembers: async (id, params = { page: 1, limit: 10 }) => {
    const response = await api.get(`/clubs/${id}/members`, { params });
    return response.data;
  }
};

export default clubService;
