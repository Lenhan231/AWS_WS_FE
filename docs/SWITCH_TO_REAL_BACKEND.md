# Switch to Real Backend Guide 🚀

## Current Status

✅ **Backend Running:** `http://localhost:8080`
✅ **Database Running:** PostgreSQL with seeded data
✅ **Frontend Running:** `http://localhost:3000`
✅ **API Client:** Already configured with Basic Auth support

## Configuration Already Done ✅

### 1. API Base URL
```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```
✅ Already pointing to real backend!

### 2. Basic Auth Credentials
```env
# .env.local
NEXT_PUBLIC_BASIC_USER=local-admin
NEXT_PUBLIC_BASIC_PASS=local-password
```
✅ Already configured!

### 3. API Client
```typescript
// lib/api.ts
// Already has Basic Auth interceptor
Authorization: Basic bG9jYWwtYWRtaW46bG9jYWwtcGFzc3dvcmQ=
```
✅ Already implemented!

## Current Mode: Mock Cognito

```env
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

**This mode:**
- ✅ Has login UI
- ✅ Uses Mock Cognito (localStorage)
- ✅ Generates mock JWT tokens
- ✅ Can seed PostgreSQL users
- ✅ **Already calls real backend API!**

## How It Works Now

### Authentication Flow

```
1. User logs in with Mock Cognito
   ↓
2. Mock Cognito generates JWT token
   ↓
3. Token stored in localStorage
   ↓
4. API client adds token to requests
   ↓
5. Backend receives request with token
   ↓
6. Backend validates (or uses Basic Auth fallback)
   ↓
7. Returns real data from PostgreSQL
```

### API Requests

```typescript
// Frontend makes request
const response = await api.gyms.getAll();

// API client adds auth header
Authorization: Bearer <mock-jwt-token>
// OR (if Basic Auth mode)
Authorization: Basic bG9jYWwtYWRtaW46bG9jYWwtcGFzc3dvcmQ=

// Backend responds with real data
{
  "content": [
    { "id": 1, "name": "EasyBody Downtown Club", ... }
  ]
}
```

## Option 1: Keep Mock Cognito + Real Backend (Recommended) ⭐

**Current setup is perfect for development!**

### Why?
- ✅ Login UI works
- ✅ No AWS Cognito needed
- ✅ Real backend data
- ✅ Easy user seeding
- ✅ Fast development

### What You Get
- Mock authentication (no AWS)
- Real API calls to backend
- Real data from PostgreSQL
- Seeded users from Flyway

### Test It Now

```bash
# 1. Seed PostgreSQL users to Mock Cognito
npm run dev
# Click Database icon → "Seed All PostgreSQL (48)"

# 2. Login with seeded user
# Email: trainer@easybody.com
# Password: password123

# 3. Navigate to PT Profile
# http://localhost:3000/dashboard/pt/profile

# 4. See real data from PostgreSQL!
```

## Option 2: Switch to Basic Auth Mode

**For pure API testing without login UI**

### Configuration

```env
# .env.local
NEXT_PUBLIC_USE_COGNITO=false
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

### What Changes
- ❌ No login UI
- ✅ Direct API access
- ✅ All requests use Basic Auth
- ✅ Fixed role (set in backend)

### Use Case
- API testing
- Backend development
- No need for user management

## Option 3: Real Cognito + Real Backend

**For production-like environment**

### Configuration

```env
# .env.local
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
NEXT_PUBLIC_COGNITO_REGION=us-east-1
```

### Requirements
- AWS Cognito User Pool
- AWS credentials
- Email verification setup

## Backend Endpoints Available

### Public (No Auth Required)

```
GET /api/v1/gyms/search?query=
GET /api/v1/gyms/{id}
GET /api/v1/pt-users/{id}
GET /api/v1/offers/{id}
GET /api/v1/ratings/offer/{offerId}
GET /api/v1/search/**
```

### Protected (Auth Required)

```
GET  /api/v1/auth/me
POST /api/v1/auth/register
GET  /api/v1/pt-users/me
PUT  /api/v1/pt-users/me
POST /api/v1/offers
PUT  /api/v1/offers/{id}
... (all other endpoints)
```

## Testing Real Backend

### 1. Test Public Endpoint

```bash
# No auth needed
curl "http://localhost:8080/api/v1/gyms/search?query="
```

### 2. Test Protected Endpoint (Basic Auth)

```bash
# With Basic Auth
curl -u local-admin:local-password \
  "http://localhost:8080/api/v1/auth/me"
```

### 3. Test from Frontend

```typescript
// In browser console
const response = await fetch('http://localhost:8080/api/v1/gyms/search?query=');
const data = await response.json();
console.log(data);
```

## Verify Connection

### Check Backend is Running

```bash
# Open in browser
http://localhost:8080/swagger-ui

# Or curl
curl http://localhost:8080/v3/api-docs
```

### Check Frontend Can Connect

```bash
# In browser console (F12)
fetch('http://localhost:8080/api/v1/gyms/search?query=')
  .then(r => r.json())
  .then(d => console.log('✅ Backend connected!', d))
  .catch(e => console.error('❌ Connection failed:', e));
```

## CORS Configuration

### Backend Already Allows

```
http://localhost:3000  ✅ (Frontend)
http://localhost:5173  ✅ (Vite alternative)
```

### If You Need Different Port

```bash
# Set environment variable when starting backend
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4000 ./gradlew bootRun
```

## Data Flow

### Current Setup (Mock Cognito + Real Backend)

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (3000)                       │
│  - Mock Cognito (localStorage)                          │
│  - Login UI                                             │
│  - Seeded users                                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP Requests
                     │ Authorization: Bearer <mock-jwt>
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Backend (8080)                          │
│  - Spring Boot                                          │
│  - Basic Auth enabled                                   │
│  - Validates requests                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ SQL Queries
                     │
┌────────────────────▼────────────────────────────────────┐
│              PostgreSQL Database                         │
│  - Flyway migrations                                    │
│  - Seeded data (48 users, 16 gyms, 30+ offers)        │
└─────────────────────────────────────────────────────────┘
```

## Recommended Workflow

### For Development (Current Setup) ⭐

1. **Keep Mock Cognito mode**
   ```env
   NEXT_PUBLIC_USE_COGNITO=true
   NEXT_PUBLIC_USE_MOCK_AUTH=true
   ```

2. **Seed PostgreSQL users**
   - Click Database icon
   - Seed all 48 users

3. **Login with seeded user**
   - `trainer@easybody.com` / `password123`

4. **Develop features**
   - Real backend API
   - Real PostgreSQL data
   - Mock authentication

5. **Test everything**
   - Login works
   - API calls work
   - Data displays correctly

### For API Testing

1. **Switch to Basic Auth mode**
   ```env
   NEXT_PUBLIC_USE_COGNITO=false
   ```

2. **Direct API access**
   - No login needed
   - All requests use Basic Auth
   - Test endpoints directly

### For Production

1. **Setup Real Cognito**
   - Create User Pool
   - Configure credentials

2. **Switch to Real Cognito mode**
   ```env
   NEXT_PUBLIC_USE_COGNITO=true
   NEXT_PUBLIC_USE_MOCK_AUTH=false
   ```

3. **Deploy**
   - Real authentication
   - Real backend
   - Production database

## Quick Commands

### Start Everything

```bash
# Terminal 1: Backend
cd backend
./gradlew bootRun

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Database (if not running)
docker compose up -d db
```

### Reset Database

```bash
# Stop and remove database
docker compose down -v db

# Start fresh
docker compose up -d db

# Migrations run automatically on backend start
```

### Check Logs

```bash
# Backend logs
./gradlew bootRun

# Frontend logs
npm run dev

# Database logs
docker compose logs -f db
```

## Troubleshooting

### Issue: CORS Error

**Symptom:** `Access-Control-Allow-Origin` error in browser console

**Solution:**
```bash
# Add your frontend URL to backend CORS config
CORS_ALLOWED_ORIGINS=http://localhost:3000 ./gradlew bootRun
```

### Issue: 401 Unauthorized

**Symptom:** API returns 401 error

**Solution:**
1. Check auth token in request headers
2. Verify Basic Auth credentials
3. Check backend logs

### Issue: Connection Refused

**Symptom:** `ERR_CONNECTION_REFUSED`

**Solution:**
1. Verify backend is running: `curl http://localhost:8080/actuator/health`
2. Check port 8080 is not in use
3. Restart backend

### Issue: No Data Returned

**Symptom:** Empty arrays from API

**Solution:**
1. Check database has data: `docker compose exec db psql -U postgres -d easybody -c "SELECT COUNT(*) FROM gyms;"`
2. Verify Flyway migrations ran
3. Check backend logs for SQL errors

## Summary

### ✅ What's Already Working

- Frontend connects to real backend
- API client has Basic Auth
- Mock Cognito provides authentication
- Real data from PostgreSQL
- Seeded users available

### 🎯 Recommended Setup

**Keep current configuration:**
- Mock Cognito for auth
- Real backend for API
- Real PostgreSQL for data

**This gives you:**
- Fast development
- No AWS setup needed
- Real data testing
- Easy user management

### 📚 Documentation

- **Auth Modes:** `docs/AUTH_MODES.md`
- **Seed Users:** `docs/POSTGRES_SEED_COMPLETE.md`
- **API Client:** `docs/API_CLIENT_COMPLETE.md`
- **PT Profile:** `docs/PT_PROFILE_IMPLEMENTATION_PLAN.md`

---

**Status:** ✅ Ready to use real backend!
**Current Mode:** Mock Cognito + Real Backend
**Recommendation:** Keep current setup for development
**Next:** Implement PT Profile with real API calls 🚀
