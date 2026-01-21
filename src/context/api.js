import axios from "axios";
import API_BASE_URL from "./envVariables";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add the access token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle 401 errors and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and we haven't retried yet
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Attempt to refresh the token
        const response = await axios.post(
          `${API_BASE_URL}/users/token/refresh/`,
          {
            refresh: refreshToken,
          },
        );

        const { access, refresh } = response.data;

        // Store the new tokens
        localStorage.setItem("token", access);
        localStorage.setItem("refresh", refresh);

        // Update the header for the original request
        originalRequest.headers.Authorization = `Bearer ${access}`;

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear local storage and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
