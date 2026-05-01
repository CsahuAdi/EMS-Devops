import axios from "axios";

const EVENT_API = "http://localhost:5000";
const REG_API = "http://localhost:8000";

export const getEvents = () => axios.get(`${EVENT_API}/events`);
export const getEventById = (id) => axios.get(`${EVENT_API}/events/${id}`);
export const createEvent = (data) => axios.post(`${EVENT_API}/events`, data);
export const updateEvent = (id, data) =>
  axios.put(`${EVENT_API}/events/${id}`, data);
export const deleteEvent = (id) =>
  axios.delete(`${EVENT_API}/events/${id}`);

export const registerUser = (data) =>
  axios.post(`${REG_API}/registrations`, data);

export const getRegistrations = (eventId) =>
  axios.get(`${REG_API}/registrations/event/${eventId}`);