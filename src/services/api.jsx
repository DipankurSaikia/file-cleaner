import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  // Duplicate File Management
  findDuplicates: (directoryPath, recursive) =>
    axios.get(`${API_BASE_URL}/cleaner/duplicates`, {
      params: { directoryPath, recursive }
    }),

  deleteDuplicates: (duplicateGroups) =>
    axios.post(`${API_BASE_URL}/cleaner/delete-duplicates`, duplicateGroups),

  scanDirectory: (request) =>
    axios.post(`${API_BASE_URL}/cleaner/scan`, request),

  // File Categorization
  getCategorizedFiles: (directoryPath, recursive) =>
    axios.get(`${API_BASE_URL}/categories/list`, {
      params: { directoryPath, recursive }
    }),

  // Rule Management
  getAllRules: () =>
    axios.get(`${API_BASE_URL}/categories/rules`),

  addOrUpdateRule: (rule) =>
    axios.post(`${API_BASE_URL}/categories/rules`, rule),

  deleteRule: (match) =>
    axios.delete(`${API_BASE_URL}/categories/rules/${match}`),

  // Configuration Management
  getConfig: () =>
    axios.get(`${API_BASE_URL}/config`),

  updateConfig: (config) =>
    axios.put(`${API_BASE_URL}/config`, config),

  // Logging & Reporting
  getLogs: (action, date) => {
    const params = {};
    if (action && action !== 'ALL') {
      params.action = action;
    }
    if (date) {
      params.date = date;
    }

    return axios.get(`${API_BASE_URL}/logs`, { params });
  },

  sendEmail: (emailRequest) =>
    axios.post(`${API_BASE_URL}/cleaner/send-email`, emailRequest)
};
