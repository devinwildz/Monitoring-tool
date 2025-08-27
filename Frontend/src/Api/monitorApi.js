import axios from "axios";

const monitorApi = axios.create({
  baseURL: "/api/v1/monitors",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

monitorApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Or from Context
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default monitorApi;
