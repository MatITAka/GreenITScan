import { defineStore } from 'pinia';
import { api } from 'boot/axios';

// System columns that are always visible in tables
const systemColumns = ['actions'];

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Authentication token and expiration
    token: localStorage.getItem('token') || null,
    tokenExpiration: localStorage.getItem('tokenExpiration') || null,
    // User-related data
    users: [],
    userId: null,
    roles: [],
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    workplace: '',
    tel: '',
    // Loading and error states
    loading: false,
    error: null,
    // Pagination settings for user list
    userPagination: {
      sortBy: 'id',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
      search: '',
    },
    // Table column visibility
    visibleColumns: [], // Visible columns in the table
    defaultColumns: [], // Default columns in the table
  }),

  getters: {
    // Get all users
    getUsers: (state) => state.users,
    // Check if loading
    isLoading: (state) => state.loading,
    // Check if there is an error
    hasError: (state) => state.error,
    // Check if user is authenticated and token is valid
    isAuthenticated: (state) =>
      state.token && state.tokenExpiration
        ? new Date(state.tokenExpiration) > new Date()
        : false,
    // Check if token is expired
    isTokenExpired: (state) => {
      if (!state.token || !state.tokenExpiration) return true;
      return new Date(state.tokenExpiration) < new Date();
    },
    // User data getters
    getUserId: (state) => state.userId,
    getRoles: (state) => state.roles,
    getFirstName: (state) => state.firstName,
    getLastName: (state) => state.lastName,
    getEmail: (state) => state.email,
    getPosition: (state) => state.position,
    getWorkplace: (state) => state.workplace,
    getTel: (state) => state.tel,
  },

  actions: {
    // Attempt automatic login with default credentials
    async autoLogin() {
      this.loading = true;
      this.error = null;
      try {
        // Send login request to Symfony backend with default credentials
        const response = await api.post('http://localhost:8000/api/auth/login', {
          email: 'gotham@dc.us',
          password: 'batman',
        });

        // Store token and expiration
        this.setToken(response.data.token, response.data.expiration);

        // Fetch and store user info
        await this.fetchUserWithInfo();
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Set pagination page
    setUserPaginationPage(page) {
      this.userPagination.page = page;
    },
    // Set rows per page
    setUserPaginationRowsPerPage(rowsPerPage) {
      this.userPagination.rowsPerPage = rowsPerPage;
    },
    // Set total number of rows
    setUserPaginationRowsNumber(rowsNumber) {
      this.userPagination.rowsNumber = rowsNumber;
    },

    // Initialize visible columns based on default columns
    initializeVisibleColumns(columns) {
      const defaultCols = columns
        .filter((col) => !systemColumns.includes(col.name))
        .map((col) => col.name);
      this.defaultColumns = [...defaultCols];
      if (this.visibleColumns.length === 0) {
        this.visibleColumns = [...defaultCols];
      }
    },

    // Toggle visibility of a column
    toggleColumnVisibility(columnName) {
      if (systemColumns.includes(columnName)) return;
      if (this.visibleColumns.includes(columnName)) {
        if (this.visibleColumns.length > 1) {
          this.visibleColumns = this.visibleColumns.filter((col) => col !== columnName);
        }
      } else {
        this.visibleColumns.push(columnName);
      }
    },

    // Reset visible columns to default
    resetVisibleColumns() {
      this.visibleColumns = [...this.defaultColumns];
    },

    // Set token and expiration date
    setToken(token, expirationDate) {
      const expirationDateFormatted = new Date(expirationDate);
      this.token = token;
      this.tokenExpiration = expirationDateFormatted;
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiration', expirationDateFormatted.toISOString());
    },

    // Clear token and expiration
    clearToken() {
      this.token = null;
      this.tokenExpiration = null;
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
    },

    // Fetch user info after login
    async fetchUserWithInfo() {
      if (!this.token) return;
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/auth/user-info', {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.setUser(response.data);
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Set user data in store
    setUser(userData) {
      const userInfo = userData.user_info || {};
      this.userId = userData.id || null;
      this.roles = userData.roles || [];
      this.firstName = userInfo.firstname || '';
      this.lastName = userInfo.lastname || '';
      this.email = userData.email || '';
      this.position = userInfo.position || '';
      this.workplace = userInfo.workplace || '';
      this.tel = userInfo.tel || '';
    },

    // Clear user data
    clearUser() {
      this.userId = null;
      this.roles = [];
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.position = '';
      this.workplace = '';
      this.tel = '';
    },

    // Update user information (admin)
    async updateUserInfo(updatedData) {
      this.loading = true;
      this.error = null;
      try {
        const userId = this.getUserId;
        const payload = {
          id: userId,
          email: updatedData.email,
          password: updatedData.password || undefined,
          user_id: userId,
          firstname: updatedData.firstname,
          lastname: updatedData.lastname,
          tel: updatedData.tel,
          position: updatedData.position,
          workplace: updatedData.workplace,
        };
        const response = await api.put(`/users/${userId}`, payload, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.setUser(response.data);
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Edit a user (admin)
    async editUser(userData, userId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(`/users/${userId}/edit`, userData, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Create a new user (admin)
    async createUser(userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/users/create', userData, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Deactivate a user (admin)
    async deactivateUser(userId) {
      this.loading = true;
      this.error = null;
      try {
        await api.put(`/users/${userId}/deactivate`, {}, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.users = this.users.filter((user) => user.id !== userId);
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch all users (admin)
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const { page, rowsPerPage, sortBy, descending, search } = this.userPagination;
        const response = await api.get('/users', {
          params: { page, rowsPerPage, sortBy, descending, search },
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.users = response.data.data;
        this.setUserPaginationPage(response.data.current_page);
        this.setUserPaginationRowsPerPage(response.data.per_page);
        this.setUserPaginationRowsNumber(response.data.total);
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch a user by ID (admin)
    async fetchUserById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/users/${id}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Clear roles
    emptyRoles() {
      this.roles = [];
    },

    // Set roles
    setRoles(roles) {
      this.roles = roles;
    },

    // Set last name
    setLastName(lastName) {
      this.lastName = lastName;
    },

    // Set first name
    setFirstName(firstName) {
      this.firstName = firstName;
    },

    // Set telephone
    setTel(tel) {
      this.tel = tel;
    },

    // Set position
    setPosition(position) {
      this.position = position;
    },

    // Set workplace
    setWorkplace(workplace) {
      this.workplace = workplace;
    },

    // Set email
    setEmail(email) {
      this.email = email;
    },
  },
});
