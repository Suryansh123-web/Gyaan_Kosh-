import axios from 'axios';

// Dynamically retrieve backend URL from LocalStorage or default
export const getBackendURL = () => {
  return localStorage.getItem('gyaan_kosh_backend_url') || 'http://127.0.0.1:5000';
};

// Update backend URL in LocalStorage
export const setBackendURL = (url) => {
  localStorage.setItem('gyaan_kosh_backend_url', url);
};

// Create dynamic axios instance
const createClient = () => {
  return axios.create({
    baseURL: getBackendURL(),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Upload a file to the backend
 * @param {File} file 
 * @returns {Promise<{message: string, chunks: number}>}
 */
export const uploadFile = async (file) => {
  const client = createClient();
  const formData = new FormData();
  formData.append('file', file);

  const response = await client.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Ask a query optionally filtered by a list of documents
 * @param {string} query 
 * @param {string[]|null} documentNames 
 * @returns {Promise<{answer: string, sources: string[]}>}
 */
export const askQuestion = async (query, documentNames = []) => {
  const client = createClient();
  const payload = { query };
  if (documentNames && documentNames.length > 0) {
    payload.documents = documentNames;
  }
  const response = await client.post('/ask', payload);
  return response.data;
};

/**
 * Retrieve the list of uploaded and chunked files
 * @returns {Promise<{documents: string[]}>}
 */
export const getDocuments = async () => {
  const client = createClient();
  const response = await client.get('/documents');
  return response.data;
};

/**
 * Seed the knowledge base from files stored in the backend 'knowledge_base' folder
 * @returns {Promise<{message: string, total_chunks: number}>}
 */
export const seedDatabase = async () => {
  const client = createClient();
  const response = await client.post('/seed');
  return response.data;
};

/**
 * Ping the home endpoint of the backend to verify connection health
 * @returns {Promise<string>}
 */
export const checkHealth = async () => {
  const client = createClient();
  const response = await client.get('/', { timeout: 3000 });
  return response.data;
};
