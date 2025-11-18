import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token
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
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  signup: async (data) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/user");
    return response.data;
  },

  updateCurrentUser: async (data) => {
    const response = await api.put("/auth/user", data);
    return response.data;
  },

  // Google OAuth - Redirects to backend OAuth flow
  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/login/google`;
  },

  // GitHub OAuth - Redirects to backend OAuth flow
  githubLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/login/github`;
  },
};

export const notificationsAPI = {
  subscribe: () => api.post("/notifications/subscribe"),
  unsubscribe: () => api.post("/notifications/unsubscribe"),
  getStatus: () => api.get("/notifications/subscription/status"),
};

// Tasks API
export const tasksAPI = {
  getTasks: async (params = {}) => {
    const response = await api.get("/user/tasks/", { params });
    return response.data;
  },

  getTask: async (taskId) => {
    const response = await api.get(`/user/tasks/${taskId}`);
    return response.data;
  },

  createTask: async (data) => {
    const response = await api.post("/user/tasks/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateTask: async (taskId, data) => {
    const response = await api.put(`/user/tasks/${taskId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteTask: async (taskId) => {
    const response = await api.delete(`/user/tasks/${taskId}`);
    return response.data;
  },

  getUpcomingTasks: async () => {
    const response = await api.get("/user/tasks/upcoming/");
    return response.data;
  },

  getRecentTasks: async () => {
    const response = await api.get("/user/tasks/recent/");
    return response.data;
  },

  getOverdueTasks: async () => {
    const response = await api.get("/user/tasks/overdue/");
    return response.data;
  },

  getTodayTasks: async () => {
    const response = await api.get("/user/tasks/today/");
    return response.data;
  },

  getTaskStats: async () => {
    const response = await api.get("/user/tasks/stats");
    return response.data;
  },
};

export default api;
