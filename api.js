import axios from "axios";

// Check if we are running on Vercel (production) or local
const isProd = import.meta.env.PROD;

const API = axios.create({
  baseURL: isProd 
    ? "https://bold-comfort-backend.vercel.app" 
    : "http://localhost:5000",
  withCredentials: true, // Required for cookies/sessions
});

// Optional: Automatically add the token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;