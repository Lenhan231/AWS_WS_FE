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
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers = config.headers ?? {};
            (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ message?: string; error?: string }>) => {
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
  login: (credentials: LoginCredentials) =>
    apiClient.post<LoginResponse>('/auth/login', credentials),
  register: (data: RegisterData) => apiClient.post<RegisterResponse>('/auth/register', data),
  me: () => apiClient.get<User>('/auth/me'),
  changePassword: (payload: ChangePasswordPayload) =>
    apiClient.post<{ message: string }>('/auth/change-password', payload),
};

const gymApi = {
  create: (data: Partial<Gym>) => apiClient.post<Gym>('/gyms', data),
  update: (gymId: string, data: Partial<Gym>) => apiClient.put<Gym>(`/gyms/${gymId}`, data),
  getById: (gymId: string) => apiClient.get<Gym>(`/gyms/${gymId}`),
  getAll: (params?: GymQueryParams) =>
    apiClient.get<PaginatedResponse<Gym>>('/gyms', { params }),
  search: (params: Partial<SearchFilters>) =>
    apiClient.get<PaginatedResponse<Gym>>('/gyms/search', { params }),
  assignPT: (gymId: string, ptUserId: string) =>
    apiClient.post<{ message: string }>(`/gyms/${gymId}/assign-pt`, { ptUserId }),
  getPTAssociations: (gymId: string) =>
    apiClient.get<PaginatedResponse<unknown>>(`/gyms/${gymId}/pt-associations`),
  approvePTAssociation: (associationId: string) =>
    apiClient.put<{ message: string }>(`/gyms/pt-associations/${associationId}/approve`),
  rejectPTAssociation: (associationId: string) =>
    apiClient.put<{ message: string }>(`/gyms/pt-associations/${associationId}/reject`),
};

const ptUsersApi = {
  create: (data: Partial<PersonalTrainer>) => apiClient.post<PersonalTrainer>('/pt-users', data),
  update: (ptUserId: string, data: Partial<PersonalTrainer>) =>
    apiClient.put<PersonalTrainer>(`/pt-users/${ptUserId}`, data),
  getById: (ptUserId: string) => apiClient.get<PersonalTrainer>(`/pt-users/${ptUserId}`),
  getAll: (params?: Partial<SearchFilters>) =>
    apiClient.get<PaginatedResponse<PersonalTrainer>>('/pt-users', { params }),
  getGymAssociations: (ptUserId: string) =>
    apiClient.get<PaginatedResponse<unknown>>(`/pt-users/${ptUserId}/gym-associations`),
};

const offerApi = {
  create: (data: Partial<Offer>) => apiClient.post<Offer>('/offers', data),
  update: (offerId: string, data: Partial<Offer>) =>
    apiClient.put<Offer>(`/offers/${offerId}`, data),
  getById: (offerId: string) => apiClient.get<Offer>(`/offers/${offerId}`),
  getAll: (params?: OfferQueryParams) =>
    apiClient.get<PaginatedResponse<Offer>>('/offers', { params }),
  delete: (offerId: string) => apiClient.delete<{ message: string }>(`/offers/${offerId}`),
};

const searchApi = {
  searchOffers: (filters: Partial<SearchFilters>) =>
    apiClient.post<PaginatedResponse<Offer>>('/search/offers', filters),
  searchOffersByQuery: (params: Partial<SearchFilters>) =>
    apiClient.get<PaginatedResponse<Offer>>('/search/offers', { params }),
  nearby: (params: NearbySearchParams) =>
    apiClient.get<NearbySearchResponse>('/search/nearby', { params }),
};

const ratingApi = {
  create: (data: { offerId: string; rating: number; comment?: string }) =>
    apiClient.post<Rating>('/ratings', data),
  getByOffer: (offerId: string, params?: RatingQueryParams) =>
    apiClient.get<PaginatedResponse<Rating>>(`/ratings/offer/${offerId}`, { params }),
};

const reportApi = {
  create: (data: { offerId: string; reason: string; details?: string }) =>
    apiClient.post<Report>('/reports', data),
};

const adminApi = {
  getPendingOffers: (params?: OfferQueryParams) =>
    apiClient.get<PaginatedResponse<Offer>>('/admin/offers/pending', { params }),
  moderateOffer: (offerId: string, payload: ModerateOfferPayload) =>
    apiClient.put<Offer>(`/admin/offers/${offerId}/moderate`, payload),
  getPendingReports: (params?: ReportQueryParams) =>
    apiClient.get<PaginatedResponse<Report>>('/admin/reports/pending', { params }),
  getReports: (params?: ReportQueryParams) =>
    apiClient.get<PaginatedResponse<Report>>('/admin/reports', { params }),
  resolveReport: (reportId: string) =>
    apiClient.put<Report>(`/admin/reports/${reportId}/resolve`),
  dismissReport: (reportId: string) =>
    apiClient.put<Report>(`/admin/reports/${reportId}/dismiss`),
  getPendingPTAssociations: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<unknown>>('/admin/pt-associations/pending', { params }),
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
