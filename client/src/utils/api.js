import axios from "axios";

const productionUrl = `${window.location.origin}/api/v1`;
const developmentUrl = "http://localhost:8000/api/v1";

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
