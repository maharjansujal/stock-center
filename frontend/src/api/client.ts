import axios from "axios";

// Fallback safely to your live production Render URL
const BASE_URL = import.meta.env.VITE_API_URL || "https://stock-center-backend.onrender.com";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor injecting the JWT on protected routes automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);