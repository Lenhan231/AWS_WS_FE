# 🔌 API Integration Guide

## ✅ Đã Tích Hợp Hoàn Chỉnh

Tất cả các endpoints từ Backend đã được tích hợp vào Frontend qua file `lib/api.ts`

---

## 📦 Cách Sử dụng API trong Components

### 1. Import API
```typescript
import { api } from '@/lib/api';
```

### 2. Sử dụng trong Components

#### 🔐 Authentication
```typescript
// Register user (sau khi Cognito signup)
const registerUser = async () => {
  const response = await api.auth.register({
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "+1234567890",
    role: "CLIENT_USER"
  });
  
  if (response.success) {
    console.log('User registered:', response.data);
  }
};

// Get current user
const getCurrentUser = async () => {
  const response = await api.auth.me();
  if (response.success) {
    console.log('Current user:', response.data);
  }
};
```

#### 🏢 Gym Operations
```typescript
// Get all gyms
const getGyms = async () => {
  const response = await api.gyms.getAll();
  if (response.success) {
    setGyms(response.data);
  }
};

// Search gyms by location
const searchGyms = async () => {
  const response = await api.gyms.search({
    latitude: 40.7128,
    longitude: -74.0060,
    radiusKm: 10
  });
  if (response.success) {
    setGyms(response.data);
  }
};

// Create new gym (GYM_STAFF only)
const createGym = async () => {
  const response = await api.gyms.create({
    name: "FitZone Gym",
    description: "Premium fitness facility",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    country: "USA",
    postalCode: "10001",
    phoneNumber: "+1234567890",
    email: "info@fitzone.com",
    latitude: 40.7128,
    longitude: -74.0060
  });
};
```

#### 💪 Personal Trainer Operations
```typescript
// Get all trainers
const getTrainers = async () => {
  const response = await api.ptUsers.getAll();
  if (response.success) {
    setTrainers(response.data);
  }
};

// Get trainer by ID
const getTrainer = async (id: string) => {
  const response = await api.ptUsers.getById(id);
  if (response.success) {
    setTrainer(response.data);
  }
};

// Create PT profile (PT_USER only)
const createPTProfile = async () => {
  const response = await api.ptUsers.create({
    bio: "Certified personal trainer...",
    specialties: ["Weight Loss", "Strength Training"],
    certifications: ["NASM-CPT"],
    experience: 5,
    hourlyRate: 85
  });
};
```

#### 🎯 Offer Operations
```typescript
// Search offers with filters
const searchOffers = async () => {
  const response = await api.search.searchOffers({
    latitude: 40.7128,
    longitude: -74.0060,
    radiusKm: 10,
    minPrice: 0,
    maxPrice: 100,
    offerType: "GYM_OFFER",
    minRating: 4.0,
    page: 0,
    size: 20,
    sortBy: "averageRating",
    sortDirection: "DESC"
  });
  
  if (response.success) {
    setOffers(response.data.content);
  }
};

// Create offer (GYM_STAFF or PT_USER)
const createOffer = async () => {
  const response = await api.offers.create({
    title: "Monthly Membership",
    description: "Full gym access",
    offerType: "GYM_OFFER",
    gymId: "1",
    price: 49.99,
    currency: "USD",
    durationDescription: "1 Month",
    imageUrls: "https://s3.../image1.jpg,https://s3.../image2.jpg"
  });
};
```

#### ⭐ Rating System
```typescript
// Submit rating (CLIENT_USER)
const submitRating = async (offerId: string) => {
  const response = await api.ratings.create({
    offerId: offerId,
    rating: 5,
    comment: "Excellent gym!"
  });
};

// Get ratings for offer
const getRatings = async (offerId: string) => {
  const response = await api.ratings.getByOffer(offerId, {
    page: 0,
    size: 10
  });
  
  if (response.success) {
    setRatings(response.data.content);
  }
};
```

#### 🚩 Report System
```typescript
// Submit report
const submitReport = async (offerId: string) => {
  const response = await api.reports.create({
    offerId: offerId,
    reason: "Inappropriate content",
    details: "Contains misleading information"
  });
};
```

#### 📸 Media Upload
```typescript
import { mediaUpload } from '@/lib/mediaUpload';

// Upload single image
const uploadImage = async (file: File) => {
  try {
    // Validate file
    const validation = mediaUpload.validateFile(file, {
      maxSizeMB: 10,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
    });
    
    if (!validation.valid) {
      alert(validation.error);
      return;
    }
    
    // Compress image (optional)
    const compressedFile = await mediaUpload.compressImage(file, 1920, 0.8);
    
    // Upload to S3
    const result = await mediaUpload.uploadFile(
      compressedFile,
      'offers',
      (progress) => {
        console.log(`Upload progress: ${progress}%`);
        setUploadProgress(progress);
      }
    );
    
    console.log('File uploaded:', result.publicUrl);
    return result.publicUrl;
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

// Upload multiple images
const uploadMultipleImages = async (files: File[]) => {
  try {
    const result = await mediaUpload.uploadMultipleFiles(
      files,
      'offers',
      (progress) => setUploadProgress(progress)
    );
    
    console.log('Files uploaded:', result.publicUrls);
    return result.publicUrls.join(',');
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

#### 👨‍💼 Admin Operations
```typescript
// Get pending offers (ADMIN only)
const getPendingOffers = async () => {
  const response = await api.admin.getPendingOffers();
  if (response.success) {
    setPendingOffers(response.data.content);
  }
};

// Moderate offer (ADMIN only)
const moderateOffer = async (offerId: string, approve: boolean) => {
  const response = await api.admin.moderateOffer(offerId, {
    decision: approve ? 'approve' : 'reject',
    reason: approve ? undefined : 'Violates content policy'
  });
};

// Get pending reports (ADMIN only)
const getPendingReports = async () => {
  const response = await api.admin.getPendingReports();
  if (response.success) {
    setReports(response.data.content);
  }
};

// Resolve report (ADMIN only)
const resolveReport = async (reportId: string) => {
  const response = await api.admin.resolveReport(reportId);
};
```

---

## 🔑 Authentication Flow

### 1. Đăng ký mới
```typescript
// Step 1: Cognito Signup (handled by cognito.ts)
await cognito.signUp(email, password, userData);

// Step 2: Confirm email
await cognito.confirmSignUp(email, code);

// Step 3: Register in backend
await api.auth.register({
  email,
  firstName,
  lastName,
  phoneNumber,
  role,
  profileImageUrl
});
```

### 2. Đăng nhập
```typescript
// Step 1: Cognito SignIn (handled by cognito.ts)
const result = await cognito.signIn(email, password);

// Step 2: Save JWT token
localStorage.setItem('auth_token', result.data.tokens.idToken);

// Step 3: Get user profile from backend
const userProfile = await api.auth.me();
```

---

## 🎯 Pagination

Tất cả list endpoints đều hỗ trợ pagination:

```typescript
const getGymsWithPagination = async (page: number = 0) => {
  const response = await api.gyms.getAll({
    page: page,
    size: 20
  });
  
  if (response.success) {
    console.log('Total pages:', response.data.totalPages);
    console.log('Total items:', response.data.totalElements);
    console.log('Current page:', response.data.pageNumber);
    console.log('Items:', response.data.content);
  }
};
```

---

## 🗺️ Geo-Location Search

```typescript
// Search by current location
const searchNearby = async () => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const response = await api.search.searchOffers({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      radiusKm: 5,
      offerType: "GYM_OFFER",
      sortBy: "averageRating",
      sortDirection: "DESC"
    });
    
    if (response.success) {
      setNearbyOffers(response.data.content);
    }
  });
};
```

---

## 🛡️ Error Handling

```typescript
const handleApiCall = async () => {
  try {
    const response = await api.gyms.getAll();
    
    if (!response.success) {
      // Handle API error
      toast.error(response.error || 'Something went wrong');
      return;
    }
    
    // Success
    setData(response.data);
  } catch (error) {
    // Handle network error
    console.error('Network error:', error);
    toast.error('Network error. Please try again.');
  }
};
```

---

## 📝 TypeScript Support

Tất cả API đều có full TypeScript support:

```typescript
import { Gym, Offer, PersonalTrainer, Rating } from '@/types';

// Type-safe API calls
const gyms: Gym[] = [];
const offers: Offer[] = [];
const trainers: PersonalTrainer[] = [];
const ratings: Rating[] = [];
```

---

## 🚀 Best Practices

1. **Always check response.success** before using data
2. **Use try-catch** for error handling
3. **Show loading states** during API calls
4. **Cache data** when appropriate (using React Query or SWR)
5. **Validate files** before uploading
6. **Compress images** before uploading to save bandwidth
7. **Use pagination** for large lists
8. **Handle 401 errors** (auto-redirect to login)

---

## 🔧 Configuration

Đảm bảo `.env.local` có các biến:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_S3_BUCKET=easybody-media
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
```

---

## 📚 API Endpoints Summary

✅ **Authentication**: register, me  
✅ **Gyms**: CRUD, search, PT assignment  
✅ **PT Users**: CRUD, search, gym associations  
✅ **Offers**: CRUD, search  
✅ **Ratings**: create, list  
✅ **Reports**: create  
✅ **Admin**: moderation, pending items  
✅ **Media**: pre-signed URL upload  

**Tất cả đã sẵn sàng để sử dụng!** 🎉

