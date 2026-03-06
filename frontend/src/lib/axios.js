import axios from "axios";

const axiosInstance = axios.create({
  // Use Vite proxy in development; same-origin in production builds.
  baseURL: "/api",
  withCredentials: true, // send cookies with the request
});

export default axiosInstance;
