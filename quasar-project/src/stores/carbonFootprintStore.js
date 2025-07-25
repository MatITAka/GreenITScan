import { defineStore } from 'pinia';
import { api } from 'boot/axios';
// import { useNotificationsStore } from './notificationsStore.js';

// System columns for potential table display (if needed)
const systemColumns = ['actions'];

export const useCarbonFootprintStore = defineStore('carbonFootprintStore', {
  state: () => ({
    // Store the list of carbon footprint calculations
    footprints: [],
    // Indicate if data is being loaded
    loading: false,
    // Store any error messages
    error: null,
    // Pagination settings for listing footprints (if displayed in a table)
    footprintPagination: {
      sortBy: 'id',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
      search: '',
    },
    // Visible columns for table display (if needed)
    visibleColumns: [],
    // Default columns for table display
    defaultColumns: [],
  }),

  actions: {
    // Set pagination page
    setFootprintPaginationPage(page) {
      this.footprintPagination.page = page;
    },

    // Set rows per page for pagination
    setFootprintPaginationRowsPerPage(rowsPerPage) {
      this.footprintPagination.rowsPerPage = rowsPerPage;
    },

    // Set total number of rows for pagination
    setFootprintPaginationRowsNumber(rowsNumber) {
      this.footprintPagination.rowsNumber = rowsNumber;
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
      if (systemColumns.includes(columnName)) {
        return;
      }
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

    // Calculate carbon footprint (mock implementation, replace with actual logic)
    calculateCarbonFootprint(data) {
      // Mock calculation: replace with actual carbon footprint calculation logic
      const footprint = (
        data.emailSimple * 0.01 + // g CO2 per email
        data.emailPJ * 0.05 + // g CO2 per email with attachment
        data.webQueries * 0.02 + // g CO2 per web query
        data.streamingVideo * 150 + // g CO2 per hour of video streaming
        data.streamingAudio * 0.1 + // g CO2 per minute of audio streaming
        data.videoConf * 200 + // g CO2 per hour of video conferencing
        data.pcCount * 200000 + // g CO2 per laptop per year
        data.smartphoneCount * 80000 + // g CO2 per smartphone per year
        data.consoleCount * 100000 + // g CO2 per console per year
        data.cloudCount * 50000 // g CO2 per cloud service per year
      ).toFixed(2); // Total in grams CO2

      return footprint;
    },

    // Save a new carbon footprint calculation to the API
    async createFootprint(footprintData) {
      this.loading = true;
      this.error = null;
      try {
        // Calculate the footprint before saving
        const calculatedFootprint = this.calculateCarbonFootprint(footprintData);
        const payload = { ...footprintData, calculatedFootprint };

        // Send data to API
        const response = await api.post('/carbon-footprints/create', payload);
        this.footprints.push(response.data);

        // const notificationsStore = useNotificationsStore();
        // notificationsStore.createNotification({
        //   message: `Carbon footprint calculated and saved: ${calculatedFootprint} g CO2`,
        //   type: 'positive',
        //   position: 'top-right',
        // });

        return response.data;
      } catch (error) {
        this.error = error.message;
        // const notificationsStore = useNotificationsStore();
        // notificationsStore.createNotification({
        //   message: 'Error saving carbon footprint.',
        //   type: 'negative',
        //   position: 'top-right',
        // });
        throw error; // Rethrow to handle in component
      } finally {
        this.loading = false;
      }
    },

    // Fetch all carbon footprint calculations
    async fetchFootprints() {
      this.loading = true;
      this.error = null;
      try {
        const { page, rowsPerPage, sortBy, descending, search } = this.footprintPagination;
        const response = await api.get('/carbon-footprints', {
          params: {
            page,
            rowsPerPage,
            sortBy,
            descending,
            search,
          },
        });

        this.footprints = response.data.data;
        this.setFootprintPaginationPage(response.data.current_page);
        this.setFootprintPaginationRowsPerPage(response.data.per_page);
        this.setFootprintPaginationRowsNumber(response.data.total);

        // const notificationsStore = useNotificationsStore();
        // notificationsStore.createNotification({
        //   message: 'Carbon footprints fetched successfully.',
        //   type: 'positive',
        //   position: 'top-right',
        // });
      } catch (error) {
        this.error = error.message;
        // const notificationsStore = useNotificationsStore();
        // notificationsStore.createNotification({
        //   message: 'Error fetching carbon footprints.',
        //   type: 'negative',
        //   position: 'top-right',
        // });
      } finally {
        this.loading = false;
      }
    },

    // Fetch a single carbon footprint by ID
    async viewFootprint(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/carbon-footprints/${id}`);
        return response.data;
      } catch (error) {
        this.error = error.message;
        // const notificationsStore = useNotificationsStore();
        // notificationsStore.createNotification({
        //   message: 'Error fetching carbon footprint.',
        //   type: 'negative',
        //   position: 'top-right',
        // });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update a carbon footprint by ID
    async editFootprint(id, updatedFootprint) {
      this.loading = true;
      this.error = null;
      try {
        // Recalculate footprint if data is updated
        const calculatedFootprint = this.calculateCarbonFootprint(updatedFootprint);
        const payload = { ...updatedFootprint, calculatedFootprint };

        await api.put(`/carbon-footprints/${id}`, payload);
        await this.fetchFootprints();

        // const notificationsStore = useNotificationsStore();
        // notificationsStore.createNotification({
        //   message: 'Carbon footprint updated successfully.',
        //   type: 'positive',
        //   position: 'top-right',
        // });
      } catch (error) {
        this.error = error.message;
        // const notificationsStore = useNotificationsStore();
        // notificationsStore.createNotification({
        //   message: 'Error updating carbon footprint.',
        //   type: 'negative',
        //   position: 'top-right',
        // });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete a carbon footprint by ID
    async deleteFootprint(id) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/carbon-footprints/${id}`);
        await this.fetchFootprints();

        // const notificationsStore = useNotificationsStore();
        // notificationsStore.createNotification({
        //   message: 'Carbon footprint deleted successfully.',
        //   type: 'positive',
        //   position: 'top-right',
        // });
      } catch (error) {
        this.error = error.message;
        // const notificationsStore = useNotificationsStore();
        // notificationsStore.createNotification({
        //   message: 'Error deleting carbon footprint.',
        //   type: 'negative',
        //   position: 'top-right',
        // });
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    // Get the list of footprints
    getFootprints: (state) => state.footprints,
    // Get loading state
    isLoading: (state) => state.loading,
    // Get error state
    hasError: (state) => state.error,
  },
});