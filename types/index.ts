// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'CLIENT_USER' | 'PT_USER' | 'GYM_STAFF' | 'ADMIN';

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  bio?: string;
  location?: Location;
}

// Location Types
export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

// Gym Types
export interface Gym {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  website?: string;
  latitude: number;
  longitude: number;
  averageRating?: number;
  totalRatings?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  phoneNumber: string;
  email: string;
  website?: string;
}

export interface OperatingHours {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: string; // HH:MM format
  closeTime: string; // HH:MM format
  isClosed: boolean;
}

// Personal Trainer Types
export interface PersonalTrainer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  bio: string;
  specialties: string[];
  certifications: string[];
  experience: number; // years
  hourlyRate: number;
  averageRating?: number;
  totalRatings?: number;
  availability: Availability[];
  attachedGyms: string[]; // Gym IDs
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
}

// Offer Types
export interface Offer {
  id: string;
  title: string;
  description: string;
  offerType: OfferType;
  gymId?: string; // For gym offers
  ptUserId?: string; // For PT offers
  price: number;
  currency: string;
  durationDescription?: string;
  imageUrls: string; // Comma-separated URLs
  averageRating?: number;
  totalRatings?: number;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OfferType = 'GYM_OFFER' | 'PT_OFFER';

export interface ModerationFlag {
  id: string;
  type: ModerationFlagType;
  reason: string;
  reportedBy: string; // User ID
  status: ModerationStatus;
  createdAt: string;
}

export type ModerationFlagType = 'INAPPROPRIATE_CONTENT' | 'MISLEADING_INFO' | 'SPAM' | 'OTHER';
export type ModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Rating Types
export interface Rating {
  id: string;
  userId: string;
  offerId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Review Type (alias for Rating, used in gym/trainer pages)
export type Review = Rating;

// Trainer Type (alias for PersonalTrainer)
export type Trainer = PersonalTrainer;

// Report Types
export interface Report {
  id: string;
  userId: string;
  offerId?: string;
  reason: string;
  details?: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

export type ReportStatus = 'PENDING' | 'RESOLVED' | 'DISMISSED';

// Search and Filter Types
export interface SearchFilters {
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  offerType?: OfferType;
  searchQuery?: string;
  city?: string;
  state?: string;
  country?: string;
  gymId?: string;
  ptUserId?: string;
  page?: number;
  size?: number;
  sortBy?: 'createdAt' | 'price' | 'averageRating';
  sortDirection?: 'ASC' | 'DESC';
}

export interface SearchResult<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface NearbySearchLocation {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  formattedAddress?: string;
}

export interface NearbyGymResult {
  id: number | string;
  name: string;
  description?: string;
  logoUrl?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  averageRating?: number;
  ratingCount?: number;
  location: NearbySearchLocation;
  distance: number;
  type: 'gym';
}

export interface NearbyPTResult {
  id: number | string;
  name: string;
  bio?: string;
  specializations?: string;
  certifications?: string;
  experience?: number;
  hourlyRate?: number;
  availability?: string;
  averageRating?: number;
  ratingCount?: number;
  location: NearbySearchLocation;
  distance: number;
  type: 'pt';
}

export type NearbySearchResult = NearbyGymResult | NearbyPTResult;

export interface NearbySearchResponse {
  results: NearbySearchResult[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
  searchCriteria: {
    latitude: number;
    longitude: number;
    radius: number;
    type?: string;
  };
}

export interface NearbySearchParams {
  lat: number;
  lon: number;
  radius: number;
  type?: 'gym' | 'pt';
  page?: number;
  size?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: UserRole;
  profileImageUrl?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface RegisterResponse {
  user: User;
  token?: string;
  requiresConfirmation?: boolean;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
  expiresIn: number;
}

export interface ModerateOfferPayload {
  decision: 'approve' | 'reject';
  reason?: string;
}

// Modal Types
export interface ModalState {
  isOpen: boolean;
  type?: 'login' | 'register' | 'profile' | 'search';
}

// UI Store Types
export interface UIState {
  modal: ModalState;
  sidebar: {
    isOpen: boolean;
  };
  loading: {
    [key: string]: boolean;
  };
}

// Toast Types
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}
