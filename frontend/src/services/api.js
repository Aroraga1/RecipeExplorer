import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
  throw new Error("REACT_APP_API_URL environment variable is required");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `Making ${config.method.toUpperCase()} request to: ${config.url}`
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ECONNREFUSED" || error.message === "Network Error") {
      error.message =
        "Unable to connect to the server. Please try again later.";
    } else if (error.response) {
      error.message =
        error.response.data?.error ||
        error.response.data?.message ||
        "An error occurred while processing your request. Please try again.";
    } else if (error.request) {
      error.message =
        "Unable to reach the server. Please check your connection and try again.";
    }
    return Promise.reject(error);
  }
);

export const recipeAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (
        filters[key] !== undefined &&
        filters[key] !== null &&
        filters[key] !== ""
      ) {
        if (Array.isArray(filters[key])) {
          filters[key].forEach((item) => params.append(key, item));
        } else {
          params.append(key, filters[key]);
        }
      }
    });

    const queryString = params.toString();
    const url = queryString ? `/recipes?${queryString}` : "/recipes";
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  create: async (recipeData) => {
    const response = await api.post("/recipes", recipeData);
    return response.data;
  },
};

export const aiAPI = {
  suggestRecipe: async (ingredients) => {
    const response = await api.post("/ai/suggest", { ingredients });
    return response.data;
  },

  simplifyInstructions: async (instructions, recipeId = null) => {
    const payload = recipeId ? { recipeId } : { instructions };
    const response = await api.post("/ai/simplify", payload);
    return response.data;
  },

  search: async (query) => {
    const response = await api.post("/ai/search", { query });
    return response.data;
  },

  getCookingTips: async (recipeId) => {
    const response = await api.post("/ai/cooking-tips", { recipeId });
    return response.data;
  },
};

export default api;
