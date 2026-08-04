import axios from "axios";

const API = axios.create({
  baseURL: "https://teamsync-3uca.onrender.com/api/",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        const res = await axios.post(
          "https://teamsync-3uca.onrender.com/api/token/refresh/",
          {
            refresh,
          }
        );

        localStorage.setItem("access", res.data.access);

        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`;

        return API(originalRequest);
      } catch (err) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default API;