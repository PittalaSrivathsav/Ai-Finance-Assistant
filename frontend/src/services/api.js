const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api` 
  : 'http://localhost:8000/api';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.detail || 'An error occurred. Please try again.';
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const authApi = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  register: async (name, email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },
  googleAuth: async (idToken) => {
    return apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    });
  },
  getMe: async () => {
    return apiRequest('/auth/me', {
      method: 'GET',
    });
  },
};

export const transactionApi = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/transactions${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  create: async (txnData) => {
    return apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(txnData),
    });
  },
  update: async (id, txnData) => {
    return apiRequest(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(txnData),
    });
  },
  delete: async (id) => {
    return apiRequest(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },
};

export const budgetApi = {
  getAll: async (month) => {
    const query = month ? `?month=${month}` : '';
    return apiRequest(`/budgets${query}`, { method: 'GET' });
  },
  save: async (budgetData) => {
    return apiRequest('/budgets', {
      method: 'POST',
      body: JSON.stringify(budgetData),
    });
  },
};

export const dashboardApi = {
  getSummary: async () => {
    return apiRequest('/dashboard', { method: 'GET' });
  },
};

export const insightsApi = {
  getAll: async () => {
    return apiRequest('/insights', { method: 'GET' });
  },
};

export const mlApi = {
  predictCategory: async (description, amount) => {
    return apiRequest('/ml/predict-category', {
      method: 'POST',
      body: JSON.stringify({ description, amount }),
    });
  },
};

export const chatbotApi = {
  sendMessage: async (message) => {
    return apiRequest('/chatbot/query', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};

export const forecastApi = {
  getForecast: async () => {
    return apiRequest('/forecast', { method: 'GET' });
  },
};
