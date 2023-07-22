import axios from "axios";

const productionUrl = `${window.location.origin}/api/v1`;
const developmentUrl = "http://localhost:8000/api/v1";
// const developmentUrl = "http://192.168.1.6:8000/api/v1";

const api = axios.create({
  baseURL: import.meta.env.DEV ? developmentUrl : productionUrl,
});
window.api = api;

export default api;
