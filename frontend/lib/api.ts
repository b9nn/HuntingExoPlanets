import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { 
  HealthResponse, 
  ModelInfo, 
  MetricsResponse, 
  FeaturesResponse, 
  PredictResponse, 
  DatasetResponse,
  PredictBody,
  Mission,
  ShapSample 
} from './types';
import { 
  mockHealth, 
  mockModels, 
  mockMetrics, 
  mockFeatures, 
  mockPredict, 
  mockDataset,
  mockShapSample,
  mockPredictWithFeatures 
} from './mocks';
import { DEFAULT_BACKEND_URL, API_ENDPOINTS } from './constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

const handleApiError = (error: unknown, fallbackData: any) => {
  console.error('API call failed, using mock data:', error);
  toast.error('Backend offline — using mock data', {
    duration: 3000,
  });
  return fallbackData;
};

export const apiClient = {
  // Health check
  async getHealth(): Promise<HealthResponse> {
    try {
      const response = await api.get<HealthResponse>(API_ENDPOINTS.health);
      return response.data;
    } catch (error) {
      return handleApiError(error, mockHealth);
    }
  },

  // Get available models
  async getModels(): Promise<ModelInfo[]> {
    try {
      const response = await api.get<ModelInfo[]>(API_ENDPOINTS.models);
      return response.data;
    } catch (error) {
      return handleApiError(error, mockModels);
    }
  },

  // Get overall metrics
  async getMetrics(): Promise<MetricsResponse> {
    try {
      const response = await api.get<MetricsResponse>(API_ENDPOINTS.metrics);
      return response.data;
    } catch (error) {
      return handleApiError(error, mockMetrics);
    }
  },

  // Get feature importances
  async getFeatures(): Promise<FeaturesResponse> {
    try {
      const response = await api.get<FeaturesResponse>(API_ENDPOINTS.features);
      return response.data;
    } catch (error) {
      return handleApiError(error, mockFeatures);
    }
  },

  // Make prediction
  async predict(data: PredictBody): Promise<PredictResponse> {
    try {
      const response = await api.post<PredictResponse>(API_ENDPOINTS.predict, data);
      return response.data;
    } catch (error) {
      // Use mock prediction with actual features
      const mockResult = mockPredictWithFeatures(data.features);
      return handleApiError(error, mockResult);
    }
  },

  // Get dataset
  async getDataset(params: {
    mission?: Mission;
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<DatasetResponse> {
    try {
      const response = await api.get<DatasetResponse>(API_ENDPOINTS.dataset, {
        params: {
          mission: params.mission,
          page: params.page || 1,
          limit: params.limit || 50,
          search: params.search,
        },
      });
      return response.data;
    } catch (error) {
      // Filter mock data by mission if specified
      let filteredRows = mockDataset.rows;
      if (params.mission) {
        filteredRows = mockDataset.rows.filter(row => row.mission === params.mission);
      }
      
      return handleApiError(error, {
        rows: filteredRows,
        total: filteredRows.length
      });
    }
  },

  // Get SHAP samples
  async getShapSample(): Promise<ShapSample[]> {
    try {
      const response = await api.get<ShapSample[]>(API_ENDPOINTS.shapSample);
      return response.data;
    } catch (error) {
      return handleApiError(error, mockShapSample);
    }
  },

  // Predict CSV file
  async predictCSV(file: File): Promise<Blob> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/predict-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });
      
      return response.data;
    } catch (error) {
      console.error('CSV prediction error:', error);
      throw error;
    }
  },
};

// Export individual functions for convenience
export const {
  getHealth,
  getModels,
  getMetrics,
  getFeatures,
  predict,
  getDataset,
  getShapSample,
  predictCSV,
} = apiClient;
