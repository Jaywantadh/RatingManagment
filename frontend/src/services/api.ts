import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete this.api.defaults.headers.common['Authorization'];
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.api.post('/auth/login', credentials);
  }

  async register(userData: { email: string; password: string; name: string; role?: string }) {
    return this.api.post('/auth/register', userData);
  }

  async updatePassword(passwordData: { currentPassword: string; newPassword: string }) {
    return this.api.post('/auth/update-password', passwordData);
  }

  // Users endpoints
  async getUsers(page = 1, limit = 10, search?: string) {
    return this.api.get('/users', { params: { page, limit, search } });
  }

  async getUserById(id: number) {
    return this.api.get(`/users/${id}`);
  }

  async getUserStats() {
    return this.api.get('/users/stats');
  }

  async updateProfile(userData: Partial<{ name: string; email: string }>) {
    return this.api.put('/users/profile/me', userData);
  }

  // Stores endpoints
  async getStores(page = 1, limit = 10, search?: string) {
    return this.api.get('/stores', { params: { page, limit, search } });
  }

  async getStoreById(id: number) {
    return this.api.get(`/stores/${id}`);
  }

  async createStore(storeData: { name: string; address: string }) {
    return this.api.post('/stores', storeData);
  }

  async updateStore(id: number, storeData: Partial<{ name: string; address: string }>) {
    return this.api.put(`/stores/${id}`, storeData);
  }

  async deleteStore(id: number) {
    return this.api.delete(`/stores/${id}`);
  }

  async getMyStores() {
    return this.api.get('/stores/owner/my-stores');
  }

  async getStoreStats() {
    return this.api.get('/stores/stats');
  }

  // Ratings endpoints
  async getRatings(page = 1, limit = 10) {
    return this.api.get('/ratings', { params: { page, limit } });
  }

  async getRatingsByStore(storeId: number) {
    return this.api.get(`/ratings/store/${storeId}`);
  }

  async getStoreRatingStats(storeId: number) {
    return this.api.get(`/ratings/store/${storeId}/stats`);
  }

  async getMyRatings() {
    return this.api.get('/ratings/user/my-ratings');
  }

  async createRating(ratingData: { store_id: number; rating_value: string; comment?: string }) {
    return this.api.post('/ratings', ratingData);
  }

  async updateRating(id: number, ratingData: Partial<{ rating_value: string; comment?: string }>) {
    return this.api.put(`/ratings/${id}`, ratingData);
  }

  async deleteRating(id: number) {
    return this.api.delete(`/ratings/${id}`);
  }

  async getOverallRatingStats() {
    return this.api.get('/ratings/stats/overall');
  }
}

export const apiService = new ApiService();

// Named exports for specific API sections
export const authApi = {
  login: apiService.login.bind(apiService),
  register: apiService.register.bind(apiService),
  updatePassword: apiService.updatePassword.bind(apiService),
  setAuthToken: apiService.setAuthToken.bind(apiService),
  removeAuthToken: apiService.removeAuthToken.bind(apiService),
};

export const usersApi = {
  getUsers: apiService.getUsers.bind(apiService),
  getUserById: apiService.getUserById.bind(apiService),
  getUserStats: apiService.getUserStats.bind(apiService),
  updateProfile: apiService.updateProfile.bind(apiService),
};

export const storesApi = {
  getStores: apiService.getStores.bind(apiService),
  getStoreById: apiService.getStoreById.bind(apiService),
  createStore: apiService.createStore.bind(apiService),
  updateStore: apiService.updateStore.bind(apiService),
  deleteStore: apiService.deleteStore.bind(apiService),
  getMyStores: apiService.getMyStores.bind(apiService),
  getStoreStats: apiService.getStoreStats.bind(apiService),
};

export const ratingsApi = {
  getRatings: apiService.getRatings.bind(apiService),
  getRatingsByStore: apiService.getRatingsByStore.bind(apiService),
  getStoreRatingStats: apiService.getStoreRatingStats.bind(apiService),
  getMyRatings: apiService.getMyRatings.bind(apiService),
  createRating: apiService.createRating.bind(apiService),
  updateRating: apiService.updateRating.bind(apiService),
  deleteRating: apiService.deleteRating.bind(apiService),
  getOverallRatingStats: apiService.getOverallRatingStats.bind(apiService),
};
