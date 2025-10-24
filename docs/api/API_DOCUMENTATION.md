# Easy Body API Documentation

> Companion docs: [`API_NEARBY_SEARCH.md`](./API_NEARBY_SEARCH.md) • [`FRONTEND_API_INTEGRATION.md`](./FRONTEND_API_INTEGRATION.md)

## Authentication
All authenticated endpoints require JWT token in Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📋 API Endpoints Summary

The tables below reflect the endpoints implemented in the Spring Boot codebase under `src/main/java/com/easybody/controller`.

### 🔐 Authentication Module
| Method | Endpoint | Auth | Role | Status | Description |
|--------|----------|------|------|--------|-------------|
| POST | `/api/v1/auth/register` | ✅ | Any | ✅ Spring Boot | Register user based on Cognito identity |
| GET | `/api/v1/auth/me` | ✅ | Any | ✅ Spring Boot | Get current user profile |

### 🏢 Gym Management
| Method | Endpoint | Auth | Role | Status | Description |
|--------|----------|------|------|--------|-------------|
| POST | `/api/v1/gyms` | ✅ | GYM_STAFF, ADMIN | ✅ Spring Boot | Register new gym |
| PUT | `/api/v1/gyms/{gymId}` | ✅ | GYM_STAFF, ADMIN | ✅ Spring Boot | Update gym details |
| GET | `/api/v1/gyms/{gymId}` | ❌ | Public | ✅ Spring Boot | Get gym by ID |
| GET | `/api/v1/gyms` | ❌ | Public | ✅ Spring Boot | List all active gyms |
| GET | `/api/v1/gyms/search` | ❌ | Public | ✅ Spring Boot | Search gyms by text or nearby radius |
| POST | `/api/v1/gyms/{gymId}/assign-pt` | ✅ | GYM_STAFF, ADMIN | ✅ Spring Boot | Assign PT to gym (`ptUserId` query param) |
| GET | `/api/v1/gyms/{gymId}/pt-associations` | ❌ | Public | ✅ Spring Boot | Get gym/PT associations |
| PUT | `/api/v1/gyms/pt-associations/{id}/approve` | ✅ | GYM_STAFF, ADMIN | ✅ Spring Boot | Approve PT-Gym association |
| PUT | `/api/v1/gyms/pt-associations/{id}/reject` | ✅ | GYM_STAFF, ADMIN | ✅ Spring Boot | Reject association (`reason` query param) |

### 💪 Personal Trainer Management
| Method | Endpoint | Auth | Role | Status | Description |
|--------|----------|------|------|--------|-------------|
| POST | `/api/v1/pt-users` | ✅ | PT_USER | ✅ Spring Boot | Create PT profile |
| PUT | `/api/v1/pt-users/{ptUserId}` | ✅ | PT_USER, ADMIN | ✅ Spring Boot | Update PT profile |
| GET | `/api/v1/pt-users/{ptUserId}` | ❌ | Public | ✅ Spring Boot | Get PT details |
| GET | `/api/v1/pt-users` | ❌ | Public | ✅ Spring Boot | List PTs (supports geo filters) |
| GET | `/api/v1/pt-users/{ptUserId}/gym-associations` | ❌ | Public | ✅ Spring Boot | Get PT's gym associations |

### 🎯 Offer Management
| Method | Endpoint | Auth | Role | Status | Description |
|--------|----------|------|------|--------|-------------|
| POST | `/api/v1/offers` | ✅ | GYM_STAFF, PT_USER, ADMIN | ✅ Spring Boot | Create new offer |
| PUT | `/api/v1/offers/{offerId}` | ✅ | GYM_STAFF, PT_USER, ADMIN | ✅ Spring Boot | Update offer |
| GET | `/api/v1/offers/{offerId}` | ❌ | Public | ✅ Spring Boot | Get offer by ID |

### 🔍 Search Module
| Method | Endpoint | Auth | Role | Status | Description |
|--------|----------|------|------|--------|-------------|
| POST | `/api/v1/search/offers` | ❌ | Public | ✅ Spring Boot | Advanced offer search (JSON body) |
| GET | `/api/v1/search/offers` | ❌ | Public | ✅ Spring Boot | Search offers via query parameters |

### ⭐ Rating System
| Method | Endpoint | Auth | Role | Status | Description |
|--------|----------|------|------|--------|-------------|
| POST | `/api/v1/ratings` | ✅ | CLIENT_USER | ✅ Spring Boot | Submit rating for offer |
| GET | `/api/v1/ratings/offer/{offerId}` | ❌ | Public | ✅ Spring Boot | Get ratings for offer (paginated) |

### 🚩 Report System
| Method | Endpoint | Auth | Role | Status | Description |
|--------|----------|------|------|--------|-------------|
| POST | `/api/v1/reports` | ✅ | Any | ✅ Spring Boot | Submit report (offer or user) |

### 👨‍💼 Admin Moderation
| Method | Endpoint | Auth | Role | Status | Description |
|--------|----------|------|------|--------|-------------|
| GET | `/api/v1/admin/offers/pending` | ✅ | ADMIN | ✅ Spring Boot | Get pending offers |
| PUT | `/api/v1/admin/offers/{offerId}/moderate` | ✅ | ADMIN | ✅ Spring Boot | Approve or reject offer |
| GET | `/api/v1/admin/reports/pending` | ✅ | ADMIN | ✅ Spring Boot | Get pending reports |
| GET | `/api/v1/admin/reports` | ✅ | ADMIN | ✅ Spring Boot | Get reports filtered by status |
| PUT | `/api/v1/admin/reports/{reportId}/resolve` | ✅ | ADMIN | ✅ Spring Boot | Resolve report |
| PUT | `/api/v1/admin/reports/{reportId}/dismiss` | ✅ | ADMIN | ✅ Spring Boot | Dismiss report |
| GET | `/api/v1/admin/pt-associations/pending` | ✅ | ADMIN | ✅ Spring Boot | Pending PT-Gym associations |

### 📸 Media Upload
| Method | Endpoint | Auth | Role | Status | Description |
|--------|----------|------|------|--------|-------------|
| GET | `/api/v1/media/presigned-url` | ✅ | Any | ✅ Spring Boot | Generate S3 pre-signed upload URL |

---

## 📝 Request/Response Examples

### 1. Register User
**POST** `/api/v1/auth/register`
```json
{
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "role": "CLIENT_USER",
  "profileImageUrl": "https://..."
}
```

### 2. Register Gym
**POST** `/api/v1/gyms`
```json
{
  "name": "FitZone Gym",
  "description": "Premium fitness facility",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "postalCode": "10001",
  "phoneNumber": "+1234567890",
  "email": "info@fitzone.com",
  "website": "https://fitzone.com",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

### 3. Create Offer
**POST** `/api/v1/offers`
```json
{
  "title": "Monthly Membership",
  "description": "Full gym access with all amenities",
  "offerType": "GYM_OFFER",
  "gymId": 1,
  "price": 49.99,
  "currency": "USD",
  "durationDescription": "1 Month",
  "imageUrls": "https://s3.../image1.jpg,https://s3.../image2.jpg"
}
```

### 4. Search Offers
**POST** `/api/v1/search/offers`
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "radiusKm": 10,
  "minPrice": 0,
  "maxPrice": 100,
  "offerType": "GYM_OFFER",
  "minRating": 4.0,
  "searchQuery": "yoga",
  "page": 0,
  "size": 20,
  "sortBy": "averageRating",
  "sortDirection": "DESC"
}
```

**OR GET** `/api/v1/search/offers?latitude=40.7128&longitude=-74.0060&radiusKm=10&minPrice=0&maxPrice=100`

### 5. Submit Rating
**POST** `/api/v1/ratings`
```json
{
  "offerId": 1,
  "rating": 5,
  "comment": "Excellent gym with great equipment!"
}
```

### 6. Submit Report
**POST** `/api/v1/reports`
```json
{
  "offerId": 1,
  "reason": "Inappropriate content",
  "details": "Contains misleading information"
}
```

### 7. Moderate Offer (Admin)
**PUT** `/api/v1/admin/offers/{offerId}/moderate`
```json
{
  "decision": "approve"
}
```
or
```json
{
  "decision": "reject",
  "reason": "Violates content policy"
}
```

### 8. Get Pre-signed Upload URL
**GET** `/api/v1/media/presigned-url?folder=offers&fileExtension=jpg`

Response:
```json
{
  "uploadUrl": "https://s3.amazonaws.com/...",
  "fileKey": "offers/uuid.jpg",
  "publicUrl": "https://easybody-media.s3.amazonaws.com/offers/uuid.jpg",
  "expiresIn": 3600
}
```

---

## 🔍 Search Filters

### Offer Search Parameters
- `latitude` / `longitude` - Location coordinates
- `radiusKm` - Search radius in kilometers (default: 10, max: 100)
- `minPrice` / `maxPrice` - Price range filter
- `offerType` - GYM_OFFER or PT_OFFER
- `minRating` - Minimum average rating (0-5)
- `searchQuery` - Text search in title/description
- `gymId` - Filter by specific gym
- `ptUserId` - Filter by specific PT
- `page` - Page number (default: 0)
- `size` - Results per page (default: 20, max: 100)
- `sortBy` - Sort field (createdAt, price, averageRating)
- `sortDirection` - ASC or DESC

---

## 📊 Pagination Response Format

All paginated endpoints return:
```json
{
  "content": [...],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 100,
  "totalPages": 5,
  "last": false,
  "first": true
}
```

---

## ⚠️ Error Response Format

```json
{
  "message": "Resource not found",
  "error": "Not Found",
  "status": 404,
  "path": "/api/v1/offers/999",
  "timestamp": 1699123456789
}
```

### Validation Error Response
```json
{
  "message": "Validation failed",
  "errors": {
    "email": "Email should be valid",
    "price": "Price must be greater than 0"
  },
  "status": 400,
  "path": "/api/v1/offers",
  "timestamp": 1699123456789
}
```

---

## 🎭 User Roles

- **ADMIN** - Full system access, moderation capabilities
- **GYM_STAFF** - Manage gyms, assign PTs, create gym offers
- **PT_USER** - Create PT profile, create PT offers
- **CLIENT_USER** - Search, rate offers, submit reports

---

## 🌍 PostGIS Geo-Location Queries

The system uses PostgreSQL PostGIS extension for spatial queries:

- Radius search using `ST_DWithin`
- Distance calculation using `ST_Distance`
- Coordinate system: EPSG:4326 (WGS 84)
- Distance measurements in meters converted to kilometers

Example: Find all gyms within 5km of location
```
GET /api/v1/gyms/search?latitude=40.7128&longitude=-74.0060&radiusKm=5
```

---

## Detailed Endpoint Reference

The content below aggregates the step-by-step request/response samples that previously lived in `API_ENDPOINTS_COMPLETE.md`. Use it when you need full payload examples beyond the summary tables above.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Fitness Center",
  "description": "Modern gym in downtown",
  "phoneNumber": "+84901234567",
  "email": "contact@newfitness.com",
  "website": "https://newfitness.com",
  "logoUrl": "https://s3.amazonaws.com/logo.jpg",
  "latitude": 10.7769,
  "longitude": 106.7009,
  "address": "123 Main Street",
  "city": "Ho Chi Minh City",
  "state": "Ho Chi Minh",
  "country": "Vietnam",
  "postalCode": "700000"
}
```

**Response (201):**
```json
{
  "id": 3,
  "name": "New Fitness Center",
  "description": "Modern gym in downtown",
  "active": true,
  "verified": false,
  "location": {
    "id": 5,
    "latitude": 10.7769,
    "longitude": 106.7009,
    "address": "123 Main Street"
  }
}
```

---

### 🔒 **10. Cập nhật Gym** (GYM_STAFF owner, ADMIN only)
```
PUT /gyms/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (Tất cả fields đều optional)
```json
{
  "name": "Updated Gym Name",
  "description": "New description",
  "phoneNumber": "+84909876543",
  "email": "newemail@gym.com",
  "website": "https://newwebsite.com",
  "logoUrl": "https://newlogo.jpg"
}
```

**Response (200):** Gym object đã update

---

### 🔒 **11. Xóa Gym** (ADMIN only)
```
DELETE /gyms/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (204):** No content

---

### 🔒 **12. Gán PT cho Gym** (GYM_STAFF owner, ADMIN only)
```
POST /gyms/:id/assign-pt?ptUserId=5
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `ptUserId` (required): ID của PT user

**Response (201):**
```json
{
  "id": 1,
  "gymId": 3,
  "ptUserId": 5,
  "status": "PENDING",
  "createdAt": "2025-10-06T10:30:00.000Z"
}
```

---

### ✅ **13. Danh sách PTs của Gym (Public)**
```
GET /gyms/:id/personal-trainers
```

**Response (200):**
```json
[
  {
    "id": 5,
    "bio": "Certified personal trainer",
    "specializations": "Yoga, Weight Loss",
    "hourlyRate": 35.00,
    "user": {
      "firstName": "Jane",
      "lastName": "Trainer",
      "email": "jane@example.com"
    },
    "location": {
      "city": "Ho Chi Minh City"
    }
  }
]
```

---

## 💪 PERSONAL TRAINER APIs

### ✅ **14. Danh sách PTs (Public)**
```
GET /pt-users?page=0&size=20
```

**Query Parameters:**
- `page` (optional): Số trang (default: 0)
- `size` (optional): Số items (default: 20)

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "bio": "Certified personal trainer with 5+ years experience",
      "specializations": "Weight Loss, Strength Training, Yoga",
      "certifications": "NASM-CPT, ACE Certified",
      "yearsOfExperience": 5,
      "hourlyRate": 35.00,
      "averageRating": 4.9,
      "ratingCount": 67,
      "user": {
        "firstName": "Jane",
        "lastName": "Trainer",
        "email": "jane@example.com"
      },
      "location": {
        "latitude": 10.7769,
        "longitude": 106.7009,
        "city": "Ho Chi Minh City"
      }
    }
  ],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 25,
  "totalPages": 2
}
```

---

### ✅ **15. Tìm kiếm PTs (Public)**
```
GET /pt-users/search?specialization=Yoga&minRate=20&maxRate=50&latitude=10.7769&longitude=106.7009&radiusKm=10
```

**Query Parameters:**
- `query` (optional): Tìm kiếm theo bio hoặc specializations
- `specialization` (optional): Lọc theo chuyên môn
- `minRate` (optional): Giá tối thiểu (USD/hour)
- `maxRate` (optional): Giá tối đa (USD/hour)
- `latitude` (optional): Vĩ độ
- `longitude` (optional): Kinh độ
- `radiusKm` (optional): Bán kính (km)
- `page` (optional): Số trang
- `size` (optional): Số items

**Response (200):** Giống GET /pt-users

---

### ✅ **16. Chi tiết PT (Public)**
```
GET /pt-users/:id
```

**Response (200):**
```json
{
  "id": 1,
  "bio": "Certified personal trainer",
  "specializations": "Weight Loss, Strength Training, Yoga",
  "certifications": "NASM-CPT, ACE Certified",
  "yearsOfExperience": 5,
  "hourlyRate": 35.00,
  "averageRating": 4.9,
  "ratingCount": 67,
  "user": {
    "firstName": "Jane",
    "lastName": "Trainer",
    "email": "jane@example.com",
    "phoneNumber": "+84901234567"
  },
  "location": {
    "latitude": 10.7769,
    "longitude": 106.7009,
    "address": "123 Nguyen Hue Street",
    "city": "Ho Chi Minh City"
  },
  "gyms": [
    {
      "id": 1,
      "name": "Fitness Pro Gym"
    }
  ]
}
```

---

### 🔒 **17. Tạo PT Profile** (PT_USER, ADMIN only)
```
POST /pt-users
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "bio": "Certified personal trainer with 5 years experience",
  "specializations": "Weight Loss, Strength Training, Yoga",
  "certifications": "NASM-CPT, ACE Certified",
  "yearsOfExperience": 5,
  "hourlyRate": 35.00,
  "profileImageUrl": "https://example.com/photo.jpg",
  "latitude": 10.7769,
  "longitude": 106.7009,
  "address": "456 Fitness Street",
  "city": "Ho Chi Minh City",
  "state": "Ho Chi Minh",
  "country": "Vietnam"
}
```

**Response (201):** PT profile object

---

### 🔒 **18. Cập nhật PT Profile** (PT_USER owner, ADMIN only)
```
PUT /pt-users/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (Tất cả fields đều optional)
```json
{
  "bio": "Updated bio",
  "specializations": "Yoga, Pilates",
  "hourlyRate": 40.00
}
```

**Response (200):** Updated PT profile

---

### 🔒 **19. Xóa PT Profile** (ADMIN only)
```
DELETE /pt-users/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (204):** No content

---

## 🎯 OFFER APIs

### ✅ **20. Danh sách Offers (Public)**
```
GET /offers?page=0&size=20
```

**Query Parameters:**
- `page` (optional): Số trang (default: 0)
- `size` (optional): Số items (default: 20)

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "1 Month Premium Membership",
      "description": "Full access to all equipment and classes",
      "offerType": "GYM_OFFER",
      "price": 50.00,
      "currency": "USD",
      "durationDescription": "1 month",
      "imageUrls": "[\"url1.jpg\", \"url2.jpg\"]",
      "status": "APPROVED",
      "active": true,
      "averageRating": 4.6,
      "ratingCount": 45,
      "gym": {
        "id": 1,
        "name": "Fitness Pro Gym",
        "location": {
          "city": "Ho Chi Minh City"
        }
      }
    }
  ],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 100,
  "totalPages": 5
}
```

---

### ✅ **21. Tìm kiếm Offers (Public)**
```
GET /offers/search?query=yoga&offerType=PT_OFFER&minPrice=20&maxPrice=100
```

**Query Parameters:**
- `query` (optional): Tìm kiếm theo title hoặc description
- `offerType` (optional): `GYM_OFFER` hoặc `PT_OFFER`
- `minPrice` (optional): Giá tối thiểu
- `maxPrice` (optional): Giá tối đa
- `page` (optional): Số trang
- `size` (optional): Số items

**Response (200):** Giống GET /offers

---

### ✅ **22. Chi tiết Offer (Public)**
```
GET /offers/:id
```

**Response (200):**
```json
{
  "id": 1,
  "title": "1 Month Premium Membership",
  "description": "Full access to all equipment and classes",
  "offerType": "GYM_OFFER",
  "price": 50.00,
  "currency": "USD",
  "durationDescription": "1 month",
  "imageUrls": "[\"url1.jpg\"]",
  "status": "APPROVED",
  "averageRating": 4.6,
  "ratingCount": 45,
  "gym": {
    "id": 1,
    "name": "Fitness Pro Gym",
    "location": {
      "city": "Ho Chi Minh City"
    }
  },
  "creator": {
    "firstName": "John",
    "lastName": "Owner"
  }
}
```

---

### 🔒 **23. Tạo Offer mới** (GYM_STAFF, PT_USER, ADMIN only)
```
POST /offers
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (Gym Offer):**
```json
{
  "title": "3 Month Premium Membership",
  "description": "Unlimited access to gym + classes",
  "offerType": "GYM_OFFER",
  "price": 120.00,
  "currency": "USD",
  "durationDescription": "3 months",
  "imageUrls": [
    "https://s3.amazonaws.com/offer1.jpg",
    "https://s3.amazonaws.com/offer2.jpg"
  ],
  "gymId": 1
}
```

**Request Body (PT Offer):**
```json
{
  "title": "10 Personal Training Sessions",
  "description": "One-on-one training with certified PT",
  "offerType": "PT_OFFER",
  "price": 300.00,
  "currency": "USD",
  "durationDescription": "10 sessions",
  "ptUserId": 5
}
```

**Response (201):**
```json
{
  "id": 15,
  "title": "3 Month Premium Membership",
  "offerType": "GYM_OFFER",
  "price": 120.00,
  "status": "PENDING",
  "active": true,
  "gym": {
    "id": 1,
    "name": "Fitness Pro Gym"
  }
}
```

---

### 🔒 **24. Cập nhật Offer** (Owner, ADMIN only)
```
PUT /offers/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (Tất cả fields đều optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 130.00,
  "active": true
}
```

**Response (200):** Updated offer object

---

### 🔒 **25. Xóa Offer** (Owner, ADMIN only)
```
DELETE /offers/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (204):** No content

---

## 🔍 SEARCH API

### ✅ **26. Tìm kiếm tổng hợp (Public)**
```
GET /search?query=fitness&minPrice=20&maxPrice=100
```

**Query Parameters:**
- `query` (optional): Từ khóa tìm kiếm
- `latitude` (optional): Vĩ độ
- `longitude` (optional): Kinh độ
- `radiusKm` (optional): Bán kính (km)
- `minPrice` (optional): Giá tối thiểu (cho offers)
- `maxPrice` (optional): Giá tối đa (cho offers)
- `page` (optional): Số trang
- `size` (optional): Số items

**Response (200):**
```json
{
  "gyms": [
    {
      "id": 1,
      "name": "Fitness Pro Gym",
      "description": "Premium gym",
      "location": { "city": "Ho Chi Minh City" }
    }
  ],
  "pts": [
    {
      "id": 5,
      "bio": "Certified trainer",
      "specializations": "Yoga, Weight Loss",
      "user": { "firstName": "Jane", "lastName": "Trainer" }
    }
  ],
  "offers": [
    {
      "id": 1,
      "title": "1 Month Membership",
      "price": 50.00,
      "offerType": "GYM_OFFER"
    }
  ],
  "total": 25
}
```

---

## ⭐ RATING APIs

### ✅ **27. Danh sách Ratings của Offer (Public)**
```
GET /ratings/offer/:offerId?page=0&size=20
```

**Query Parameters:**
- `page` (optional): Số trang (default: 0)
- `size` (optional): Số items (default: 20)

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Great gym with excellent equipment!",
      "verified": false,
      "user": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "createdAt": "2025-10-01T10:00:00.000Z"
    }
  ],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 45
}
```

---

### 🔒 **28. Tạo Rating mới**
```
POST /ratings
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "offerId": 1,
  "rating": 5,
  "comment": "Excellent service and friendly staff!"
}
```

**Response (201):**
```json
{
  "id": 10,
  "rating": 5,
  "comment": "Excellent service and friendly staff!",
  "user": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "offer": {
    "id": 1,
    "title": "1 Month Membership"
  },
  "createdAt": "2025-10-06T10:30:00.000Z"
}
```

---

### 🔒 **29. Cập nhật Rating** (Owner only)
```
PUT /ratings/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated comment"
}
```

**Response (200):** Updated rating object

---

### 🔒 **30. Xóa Rating** (Owner, ADMIN only)
```
DELETE /ratings/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (204):** No content

---

## 🚨 REPORT APIs

### 🔒 **31. Tạo Report**
```
POST /reports
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Inappropriate content",
  "details": "This offer contains misleading information",
  "offerId": 5
}
```

Hoặc report user:
```json
{
  "reason": "Spam",
  "details": "This user is sending spam messages",
  "reportedUserId": 10
}
```

**Response (201):**
```json
{
  "id": 1,
  "reason": "Inappropriate content",
  "details": "This offer contains misleading information",
  "status": "PENDING",
  "reporter": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "offer": {
    "id": 5,
    "title": "Suspicious Offer"
  },
  "createdAt": "2025-10-06T10:30:00.000Z"
}
```

---

### 🔒 **32. Danh sách Reports của tôi**
```
GET /reports/my-reports?page=0&size=20
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "reason": "Inappropriate content",
      "status": "PENDING",
      "reportedUser": {
        "firstName": "Bad",
        "lastName": "User"
      },
      "createdAt": "2025-10-06T10:00:00.000Z"
    }
  ],
  "pageNumber": 0,
  "totalElements": 5
}
```

---

## 👑 ADMIN APIs (ADMIN role only)

### 🔒 **33. Danh sách Offers chờ duyệt**
```
GET /admin/pending-offers?page=0&size=20
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "content": [
    {
      "id": 15,
      "title": "New Offer",
      "offerType": "GYM_OFFER",
      "price": 100.00,
      "status": "PENDING",
      "gym": {
        "name": "New Gym"
      },
      "creator": {
        "firstName": "John",
        "lastName": "Owner"
      },
      "createdAt": "2025-10-06T09:00:00.000Z"
    }
  ],
  "pageNumber": 0,
  "totalElements": 10
}
```

---

### 🔒 **34. Danh sách Gym-PT Associations chờ duyệt**
```
GET /admin/pending-gym-pt-associations?page=0&size=20
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "content": [
    {
      "id": 5,
      "status": "PENDING",
      "gym": {
        "id": 1,
        "name": "Fitness Pro Gym"
      },
      "ptUser": {
        "id": 5,
        "user": {
          "firstName": "Jane",
          "lastName": "Trainer"
        }
      },
      "createdAt": "2025-10-06T08:00:00.000Z"
    }
  ],
  "pageNumber": 0,
  "totalElements": 3
}
```

---

### 🔒 **35. Duyệt/Từ chối Offer**
```
POST /admin/moderate-offer/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "decision": "APPROVED",
  "moderationNotes": "Looks good, approved!"
}
```

Hoặc từ chối:
```json
{
  "decision": "REJECTED",
  "moderationNotes": "Contains inappropriate content"
}
```

**Response (200):**
```json
{
  "id": 15,
  "title": "New Offer",
  "status": "APPROVED",
  "moderationNotes": "Looks good, approved!",
  "updatedAt": "2025-10-06T10:30:00.000Z"
}
```

---

### 🔒 **36. Duyệt/Từ chối Gym-PT Association**
```
POST /admin/moderate-gym-pt-association/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "decision": "APPROVED"
}
```

Hoặc từ chối:
```json
{
  "decision": "REJECTED",
  "rejectionReason": "PT does not meet gym requirements"
}
```

**Response (200):**
```json
{
  "id": 5,
  "status": "APPROVED",
  "approvedAt": "2025-10-06T10:30:00.000Z"
}
```

---

### 🔒 **37. Danh sách tất cả Reports**
```
GET /admin/reports?status=PENDING&page=0&size=20
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): `PENDING`, `REVIEWED`, `RESOLVED`, `DISMISSED`
- `page` (optional): Số trang
- `size` (optional): Số items

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "reason": "Inappropriate content",
      "details": "Contains spam",
      "status": "PENDING",
      "reporter": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "reportedUser": {
        "firstName": "Bad",
        "lastName": "User"
      },
      "createdAt": "2025-10-06T09:00:00.000Z"
    }
  ],
  "pageNumber": 0,
  "totalElements": 15
}
```

---

### 🔒 **38. Review Report**
```
POST /admin/reports/:id/review
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "RESOLVED",
  "adminNotes": "User has been warned and content removed"
}
```

**Status có thể dùng:**
- `REVIEWED` - Đã xem
- `RESOLVED` - Đã giải quyết
- `DISMISSED` - Bác bỏ

**Response (200):**
```json
{
  "id": 1,
  "status": "RESOLVED",
  "adminNotes": "User has been warned and content removed",
  "reviewedBy": 1,
  "updatedAt": "2025-10-06T10:30:00.000Z"
}
```

---

### 🔒 **39. Danh sách tất cả Users**
```
GET /admin/users?page=0&size=20
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CLIENT_USER",
      "active": true,
      "createdAt": "2025-10-01T10:00:00.000Z"
    }
  ],
  "pageNumber": 0,
  "totalElements": 150
}
```

---

### 🔒 **40. Kích hoạt/Vô hiệu hóa User**
```
PUT /admin/users/:id/toggle-active
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 10,
  "email": "user@example.com",
  "active": false,
  "updatedAt": "2025-10-06T10:30:00.000Z"
}
```

---

## 📸 MEDIA APIs

### 🔒 **41. Lấy Presigned URL để upload lên S3**
```
POST /media/presigned-url
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fileName": "gym-photo.jpg",
  "fileType": "image/jpeg"
}
```

**Response (200):**
```json
{
  "presignedUrl": "https://easybody-media.s3.amazonaws.com/uploads/1/abc123.jpg?signature=...",
  "publicUrl": "https://easybody-media.s3.amazonaws.com/uploads/1/abc123.jpg",
  "key": "uploads/1/abc123.jpg",
  "expiresIn": 300
}
```

**Flow upload image:**
1. Gọi API này để lấy presignedUrl
2. Upload file trực tiếp lên presignedUrl bằng PUT request
3. Gọi API confirm upload (optional)
4. Dùng publicUrl để lưu vào database

---

### 🔒 **42. Xác nhận upload hoàn tất**
```
POST /media/upload-complete
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "key": "uploads/1/abc123.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Upload confirmed",
  "url": "https://easybody-media.s3.amazonaws.com/uploads/1/abc123.jpg"
}
```

---

## ❤️ HEALTH CHECK

### ✅ **43. Health Check**
```
GET /health
```

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2025-10-06T10:30:00.000Z",
  "environment": "development"
}
```

---

## 📊 TỔNG KẾT

### **Tổng số APIs: 43 endpoints**

**Public APIs (không cần token): 14**
- Health check: 1
- Auth (register, login): 2
- Gyms: 4
- PT Users: 3
- Offers: 3
- Search: 1

**Protected APIs (cần token): 29**
- Auth (profile, change password): 3
- Gyms (create, update, delete, assign PT): 4
- PT Users (create, update, delete): 3
- Offers (create, update, delete): 3
- Ratings (create, update, delete): 3
- Reports (create, my reports): 2
- Admin (moderation, user management): 9
- Media (upload): 2

---

## 🎯 Sample Data có sẵn (sau khi seed)

**Users:**
- `admin@easybody.com` / `Password123` (ADMIN)
- `gym@easybody.com` / `Password123` (GYM_STAFF)
- `pt@easybody.com` / `Password123` (PT_USER)
- `client@easybody.com` / `Password123` (CLIENT_USER)

**Gyms:** 2 gyms
**PTs:** 1 PT profile
**Offers:** 4 offers (approved)

---

## 🚀 Test nhanh với cURL/PowerShell

```powershell
# Login
$body = @{ email = "admin@easybody.com"; password = "Password123" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.token

# Get Gyms
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/gyms"

# Get My Profile
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/me" -Headers @{Authorization = "Bearer $token"}
```

---

**🎉 ĐÃ HOÀN THÀNH! Frontend có thể bắt đầu tích hợp ngay!**
# 📡 DANH SÁCH ĐẦY ĐỦ API ENDPOINTS - EASY BODY BACKEND

## 🌐 Base URL
```
Development: http://localhost:8080/api/v1
Production: https://api.easybody.com/api/v1
```

---

## 🔐 AUTHENTICATION APIs

### ✅ **1. Đăng ký User mới**
```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+84901234567",
  "role": "CLIENT_USER"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CLIENT_USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Roles có thể dùng:**
- `CLIENT_USER` - Khách hàng
- `GYM_STAFF` - Nhân viên gym
- `PT_USER` - Personal Trainer
- `ADMIN` - Quản trị viên

---

### ✅ **2. Đăng nhập**
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CLIENT_USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 🔒 **3. Lấy thông tin User hiện tại**
```
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+84901234567",
  "role": "CLIENT_USER",
  "active": true,
  "profileImageUrl": null
}
```

---

### 🔒 **4. Cập nhật Profile**
```
PUT /auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Johnny",
  "lastName": "Doe",
  "phoneNumber": "+84909876543",
  "profileImageUrl": "https://example.com/image.jpg"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "Johnny",
  "lastName": "Doe",
  "phoneNumber": "+84909876543",
  "role": "CLIENT_USER"
}
```

---

### 🔒 **5. Đổi Password**
```
POST /auth/change-password
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

## 🏋️ GYM APIs

### ✅ **6. Danh sách Gyms (Public)**
```
GET /gyms?page=0&size=20
```

**Query Parameters:**
- `page` (optional): Số trang, bắt đầu từ 0 (default: 0)
- `size` (optional): Số items mỗi trang (default: 20, max: 100)

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Fitness Pro Gym",
      "description": "Premium gym with modern equipment",
      "phoneNumber": "+84901234567",
      "email": "info@fitnesspro.com",
      "website": "https://fitnesspro.com",
      "logoUrl": "https://example.com/logo.jpg",
      "active": true,
      "verified": true,
      "averageRating": 4.5,
      "ratingCount": 120,
      "location": {
        "id": 1,
        "latitude": 10.7769,
        "longitude": 106.7009,
        "address": "123 Nguyen Hue Street",
        "city": "Ho Chi Minh City",
        "country": "Vietnam"
      },
      "owner": {
        "id": 2,
        "firstName": "John",
        "lastName": "Owner"
      }
    }
  ],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 50,
  "totalPages": 3,
  "first": true,
  "last": false
}
```

---

### ✅ **7. Tìm kiếm Gyms (Public)**
```
GET /gyms/search?query=fitness&latitude=10.7769&longitude=106.7009&radiusKm=10
```

**Query Parameters:**
- `query` (optional): Tìm kiếm theo tên hoặc mô tả
- `latitude` (optional): Vĩ độ để tìm kiếm theo location
- `longitude` (optional): Kinh độ để tìm kiếm theo location
- `radiusKm` (optional): Bán kính tìm kiếm (km) (default: 10, max: 100)
- `page` (optional): Số trang (default: 0)
- `size` (optional): Số items (default: 20)

**Response (200):** Giống như GET /gyms

---

### ✅ **8. Chi tiết Gym (Public)**
```
GET /gyms/:id
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Fitness Pro Gym",
  "description": "Premium gym with modern equipment",
  "phoneNumber": "+84901234567",
  "email": "info@fitnesspro.com",
  "website": "https://fitnesspro.com",
  "averageRating": 4.5,
  "ratingCount": 120,
  "location": {
    "id": 1,
    "latitude": 10.7769,
    "longitude": 106.7009,
    "address": "123 Nguyen Hue Street",
    "city": "Ho Chi Minh City"
  },
  "owner": {
    "id": 2,
    "firstName": "John",
    "lastName": "Owner",
    "email": "john@example.com"
  }
}
```

---

### 🔒 **9. Tạo Gym mới** (GYM_STAFF, ADMIN only)
```
POST /gyms
