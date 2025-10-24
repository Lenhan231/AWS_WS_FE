import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  ApiResponse,
  ChangePasswordPayload,
  LoginCredentials,
  LoginResponse,
  ModerateOfferPayload,
  NearbySearchParams,
  NearbySearchResponse,
  PaginatedResponse,
  PresignedUrlResponse,
  RegisterData,
  RegisterResponse,
  SearchFilters,
  Gym,
  Offer,
  PersonalTrainer,
  Rating,
  Report,
  User,
} from '@/types';

type PaginationParams = {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
};

type RatingQueryParams = PaginationParams & {
  minRating?: number;
};

type ReportQueryParams = PaginationParams & {
  status?: string;
};

type GymQueryParams = PaginationParams &
  Partial<
    Pick<
      SearchFilters,
      | 'latitude'
      | 'longitude'
      | 'radiusKm'
      | 'minRating'
      | 'searchQuery'
      | 'city'
      | 'state'
      | 'country'
    >
  >;

type OfferQueryParams = PaginationParams &
  Partial<
    Pick<
      SearchFilters,
      | 'offerType'
      | 'minPrice'
      | 'maxPrice'
      | 'minRating'
      | 'searchQuery'
      | 'gymId'
      | 'ptUserId'
    >
  >;

class ApiClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        // Check if using Basic Auth mode (no Cognito)
        const useCognito = process.env.NEXT_PUBLIC_USE_COGNITO !== 'false';

        if (!useCognito) {
          // Basic Auth mode for local testing
          const username = process.env.NEXT_PUBLIC_BASIC_USER || 'local-admin';
          const password = process.env.NEXT_PUBLIC_BASIC_PASS || 'local-password';

          // Encode credentials to Base64
          const credentials = typeof window !== 'undefined'
            ? btoa(`${username}:${password}`)
            : Buffer.from(`${username}:${password}`).toString('base64');

          config.headers = config.headers ?? {};
          (config.headers as Record<string, string>).Authorization = `Basic ${credentials}`;

          console.log('[API] Using Basic Auth mode');
          return config;
        }

        // Cognito/Mock Auth mode
        if (typeof window !== 'undefined') {
          // Try to get token from Cognito first
          try {
            const { cognito } = await import('./cognito');
            const token = await cognito.getAccessToken();

            if (token) {
              config.headers = config.headers ?? {};
              (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
            }
          } catch (error) {
            // Fallback to localStorage if Cognito fails
            const token = localStorage.getItem('auth_token');
            if (token) {
              config.headers = config.headers ?? {};
              (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
            }
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ message?: string; error?: string }>) => {
        // Silently ignore cancelled/aborted requests
        if (axios.isCancel(error) || error.message === 'Request aborted' || error.code === 'ERR_CANCELED') {
          return Promise.reject(error);
        }

        console.error('API Error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
        });

        if (error.response?.status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          document.cookie = 'auth_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';

          if (!window.location.pathname.includes('/auth/login')) {
            window.location.href = '/auth/login';
          }
        }

        if (error.response?.status === 500) {
          console.error('🔥 Backend Server Error:', error.response.data);

          if (error.config?.url?.includes('/auth/') && typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            document.cookie = 'auth_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, config);
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, config);
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, config);
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url, config);
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  private handleError<T>(error: unknown): ApiResponse<T> {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;

    // Silently handle cancelled requests
    if (axios.isCancel(error) || axiosError.message === 'Request aborted' || axiosError.code === 'ERR_CANCELED') {
      return {
        success: false,
        error: 'Request cancelled',
        message: 'Request cancelled',
      };
    }

    const message =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      'An error occurred';

    return {
      success: false,
      error: message,
      message,
    };
  }
}

const apiClient = new ApiClient();

const authApi = {
  register: (data: RegisterData) => apiClient.post<RegisterResponse>('/auth/register', data),
  me: () => apiClient.get<User>('/auth/me'),
  // Note: login and changePassword endpoints don't exist on backend
  // Authentication is handled by Cognito (Mock or Real)
};

const gymApi = {
  create: (data: Partial<Gym>) => apiClient.post<Gym>('/gyms', data),
  update: (gymId: string | number, data: Partial<Gym>) => apiClient.put<Gym>(`/gyms/${gymId}`, data),
  getById: (gymId: string | number) => apiClient.get<Gym>(`/gyms/${gymId}`),
  getAll: (params?: GymQueryParams) =>
    apiClient.get<PaginatedResponse<Gym>>('/gyms', { params }),
  search: (params: Partial<SearchFilters>) =>
    apiClient.get<PaginatedResponse<Gym>>('/gyms/search', { params }),
  assignPT: (gymId: string | number, ptUserId: string | number) =>
    apiClient.post<{ message: string }>(`/gyms/${gymId}/assign-pt`, null, { params: { ptUserId } }),
  getPTAssociations: (gymId: string | number) =>
    apiClient.get<unknown[]>(`/gyms/${gymId}/pt-associations`),
  approvePTAssociation: (associationId: string | number) =>
    apiClient.put<{ message: string }>(`/gyms/pt-associations/${associationId}/approve`),
  rejectPTAssociation: (associationId: string | number) =>
    apiClient.put<{ message: string }>(`/gyms/pt-associations/${associationId}/reject`),
};

const ptUsersApi = {
  // Get current PT user profile
  getMyProfile: () => apiClient.get<PersonalTrainer>('/pt-users/me'),
  // Update current PT user profile
  updateMyProfile: (data: Partial<PersonalTrainer>) =>
    apiClient.put<PersonalTrainer>('/pt-users/me', data),
  // Create PT user profile
  create: (data: Partial<PersonalTrainer>) => apiClient.post<PersonalTrainer>('/pt-users', data),
  // Update PT user profile by ID
  update: (ptUserId: string | number, data: Partial<PersonalTrainer>) =>
    apiClient.put<PersonalTrainer>(`/pt-users/${ptUserId}`, data),
  // Get PT user by ID
  getById: (ptUserId: string | number) => apiClient.get<PersonalTrainer>(`/pt-users/${ptUserId}`),
  // Get all PT users
  getAll: (params?: Partial<SearchFilters>) =>
    apiClient.get<PersonalTrainer[]>('/pt-users', { params }),
  // Get gym associations for PT user
  getGymAssociations: (ptUserId: string | number) =>
    apiClient.get<unknown[]>(`/pt-users/${ptUserId}/gym-associations`),
};

const offerApi = {
  create: (data: Partial<Offer>) => apiClient.post<Offer>('/offers', data),
  update: (offerId: string | number, data: Partial<Offer>) =>
    apiClient.put<Offer>(`/offers/${offerId}`, data),
  getById: (offerId: string | number) => apiClient.get<Offer>(`/offers/${offerId}`),
  // Note: Use searchApi.searchOffers() for listing offers - no GET /offers endpoint exists
};

const searchApi = {
  searchOffers: (filters: Partial<SearchFilters>) =>
    apiClient.post<PaginatedResponse<Offer>>('/search/offers', filters),
  searchOffersByQuery: (params: Partial<SearchFilters>) =>
    apiClient.get<PaginatedResponse<Offer>>('/search/offers', { params }),
};

const ratingApi = {
  create: (data: { offerId: number; rating: number; comment?: string }) =>
    apiClient.post<Rating>('/ratings', data),
  getByOffer: (offerId: string | number, params?: RatingQueryParams) =>
    apiClient.get<PaginatedResponse<Rating>>(`/ratings/offer/${offerId}`, { params }),
};

const reportApi = {
  create: (data: { offerId: number; reportedUserId?: number; reason: string; details?: string }) =>
    apiClient.post<Report>('/reports', data),
};

const adminApi = {
  getPendingOffers: (params?: OfferQueryParams) =>
    apiClient.get<PaginatedResponse<Offer>>('/admin/offers/pending', { params }),
  moderateOffer: (offerId: string | number, payload: ModerateOfferPayload) =>
    apiClient.put<Offer>(`/admin/offers/${offerId}/moderate`, payload),
  getPendingReports: (params?: ReportQueryParams) =>
    apiClient.get<PaginatedResponse<Report>>('/admin/reports/pending', { params }),
  getReports: (status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED', params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Report>>('/admin/reports', { params: { status, ...params } }),
  resolveReport: (reportId: string | number) =>
    apiClient.put<Report>(`/admin/reports/${reportId}/resolve`),
  dismissReport: (reportId: string | number) =>
    apiClient.put<Report>(`/admin/reports/${reportId}/dismiss`),
  getPendingPTAssociations: (params?: PaginationParams) =>
    apiClient.get<unknown[]>('/admin/pt-associations/pending', { params }),
};

const mediaApi = {
  getPresignedUrl: (folder: string, fileExtension: string) =>
    apiClient.get<PresignedUrlResponse>('/media/presigned-url', {
      params: { folder, fileExtension },
    }),
};

export const api = {
  auth: authApi,
  gyms: gymApi,
  ptUsers: ptUsersApi,
  offers: offerApi,
  search: searchApi,
  ratings: ratingApi,
  reports: reportApi,
  admin: adminApi,
  media: mediaApi,
  // Backwards compatibility for older imports
  pt: ptUsersApi,
};

export type Api = typeof api;

export default api;
