import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const logout = () => api.post('/auth/logout');

export const register = (data: any) => api.post('/auth/register', data);

export const getEvents = () => api.get('/events');
export const getUpcomingEvents = () => api.get('/events/upcoming');
export const getEvent = (id: number) => api.get(`/events/${id}`);
export const createEvent = (data: any) => api.post('/events', data);
export const deleteEvent = (id: number) => api.delete(`/events/${id}`);

export const getSubmissions = () => api.get('/submissions');
export const createSubmission = (data: FormData) =>
  api.post('/submissions', data, { headers: { 'Content-Type': 'multipart/form-data' } });

// Registrations
export const registerForEvent = (eventId: number, type: string) =>
  api.post('/registrations', { event_id: eventId, type_inscription: type });

export const getEventRegistrations = (eventId: number) =>
  api.get(`/registrations/event/${eventId}`);

export const getMyRegistrations = () => api.get('/registrations/my-events');

export default api;
