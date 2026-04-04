import api from './api';

const merchService = {
  getEventMerch: async (eventId) => {
    const response = await api.get(`/merch/event/${eventId}`);
    return response.data;
  },
};

export default merchService;
