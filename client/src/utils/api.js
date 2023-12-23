import axios from "axios";

// const productionUrl = `${window.location.origin}/api/v1`;
const productionUrl = `https://farhat-glass-dev.onrender.com/api/v1`;
const developmentUrl = window.location.hostname.startsWith("192.168")
  ? `http://${window.location.hostname}:8000/api/v1`
  : "http://192.168.1.6:8000/api/v1";

const api = axios.create({
  baseURL: import.meta.env.DEV ? developmentUrl : productionUrl,
});
window.api = api;

export const adminApi = axios.create({
  baseURL: import.meta.env.DEV ? developmentUrl : productionUrl,
});
window.adminApi = adminApi;

adminApi.interceptors.request.use((config) => {
  config.headers.token = window.localStorage.token;
  return config;
});
adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default api;
