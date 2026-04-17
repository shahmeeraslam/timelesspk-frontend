import axios from "axios";

const API = axios.create({
  // Use the exact URL of your Vercel backend
  baseURL: import.meta.env.PROD 
    ? "https://bold-comfort-backend.vercel.app" 
    : "http://localhost:5000",
  withCredentials: true,
});

// Add the interceptor to attach the token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API; // <--- MUST HAVE THIS LINE