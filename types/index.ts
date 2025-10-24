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

// Location Types (Backend format)
export interface Location {
  id?: number;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  formattedAddress?: string;
}

// Gym Types (Backend format)
export interface Gym {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  active: boolean;
  verified: boolean;
  location: Location;
  averageRating?: number;
  ratingCount?: number;
  createdAt?: string;
  updatedAt?: string;
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

// Personal Trainer Types (Backend format)
export interface PersonalTrainer {
  id: number;
  bio?: string;
  specializations?: string; // Comma-separated
  certifications?: string; // Comma-separated
  yearsOfExperience?: number;
  hourlyRate?: number;
  profileImageUrl?: string;
  availability?: string; // JSON string
  averageRating?: number;
  ratingCount?: number;
  user?: UserResponse;
  location?: Location;
  gyms?: Gym[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  active: boolean;
  profileImageUrl?: string;
}

export interface Availability {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
}

// Offer Types (Backend format)
export interface Offer {
  id: number;
  title: string;
  description?: string;
  offerType: OfferType;
  gymId?: number;
  ptUserId?: number;
  gymName?: string;
  ptUserName?: string;
  price: number;
  currency: string;
  durationDescription?: string;
  imageUrls?: string; // Comma-separated URLs
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  active: boolean;
  averageRating?: number;
  ratingCount?: number;
  distanceKm?: number; // For search results
  location?: Location;
  gym?: Gym;
  ptUser?: PersonalTrainer;
  creator?: UserResponse;
  createdAt?: string;
  updatedAt?: string;
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

// Rating Types (Backend format)
export interface Rating {
  id: number;
  rating: number; // 1-5
  comment?: string;
  verified: boolean;
  user?: UserResponse;
  offer?: Offer;
  createdAt?: string;
  updatedAt?: string;
}

// Review Type (alias for Rating, used in gym/trainer pages)
export type Review = Rating;

// Trainer Type (alias for PersonalTrainer)
export type Trainer = PersonalTrainer;

// Report Types (Backend format)
export interface Report {
  id: number;
  reason: string;
  details?: string;
  status: ReportStatus;
  reporter?: UserResponse;
  reportedUser?: UserResponse;
  offer?: Offer;
  reviewedBy?: number;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';

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
  password?: string; // Optional: only used for Cognito signup, not sent to backend
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

// Auth Action Result Types
export interface AuthActionResult {
  needsConfirmation?: boolean;
  email?: string;
}

// Cognito Confirmation Types
export interface ResendCodeResult {
  success: boolean;
  data?: {
    codeSent: boolean;
    destination: string;
  };
  error?: string;
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
