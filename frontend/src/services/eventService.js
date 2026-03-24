import api from './api';

const eventService = {
  getEvents: async (params = { page: 1, limit: 8 }) => {
    const response = await api.get('/events', { params });
    return response.data;
  },
  
  getEventsForCalendar: async () => {
    const response = await api.get('/events/calendar');
    return response.data;
  },
  
  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  
  createEvent: async (formData) => {
    const response = await api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  updateEvent: async (id, formData) => {
    const response = await api.put(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};

export default eventService;
