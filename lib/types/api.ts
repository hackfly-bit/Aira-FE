// Common API Types

// Base API Response
export interface BaseApiResponse {
  message?: string;
  timestamp?: string;
  status: number;
}

// Paginated Response
export interface PaginatedResponse<T> extends BaseApiResponse {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Single Item Response
export interface SingleResponse<T> extends BaseApiResponse {
  data: T;
}

// List Response
export interface ListResponse<T> extends BaseApiResponse {
  data: T[];
}

// Error Response
export interface ErrorResponse extends BaseApiResponse {
  error: string;
  details?: any;
}

// Success Response
export interface SuccessResponse extends BaseApiResponse {
  success: boolean;
}

// Common Query Parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: any;
}

// File Upload Response
export interface FileUploadResponse extends BaseApiResponse {
  data: {
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    url: string;
  };
}

// Health Check Response
export interface HealthResponse extends BaseApiResponse {
  data: {
    status: 'ok' | 'error';
    uptime: number;
    timestamp: string;
    version?: string;
  };
}