import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  resetRequest: async (email: string) => {
    const response = await api.post('/auth/reset-request', { email });
    return response.data;
  },
  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },
};

export const rooms = {
  getAll: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },
  create: async (data: {
    name: string;
    capacity: number;
    type: 'SINGLE' | 'CONNECTED';
    connectedToId?: string;
  }) => {
    const response = await api.post('/rooms', data);
    return response.data;
  },
  setMaintenance: async (roomId: string, data: {
    reason: string;
    startDate: string;
    endDate: string;
  }) => {
    const response = await api.post(`/rooms/${roomId}/maintenance`, data);
    return response.data;
  },
  removeMaintenance: async (roomId: string) => {
    const response = await api.delete(`/rooms/${roomId}/maintenance`);
    return response.data;
  },
};

export const reservations = {
  getAll: async () => {
    const response = await api.get('/reservations');
    return response.data;
  },
  create: async (data: {
    roomId: string;
    connectedRoomId?: string;
    title: string;
    startTime: string;
    endTime: string;
  }) => {
    const response = await api.post('/reservations', data);
    return response.data;
  },
  updateStatus: async (id: string, data: {
    status: 'IN_PROGRESS' | 'COMPLETED';
    actualEndTime?: string;
  }) => {
    const response = await api.patch(`/reservations/${id}/status`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
  },
};

export const holidays = {
  getAll: async () => {
    const response = await api.get('/holidays');
    return response.data;
  },
  create: async (data: {
    date: string;
    name: string;
  }) => {
    const response = await api.post('/holidays', data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/holidays/${id}`);
    return response.data;
  },
};

export const users = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  create: async (data: {
    email: string;
    name: string;
    password: string;
    role: 'ADMIN' | 'USER';
  }) => {
    const response = await api.post('/users', data);
    return response.data;
  },
};