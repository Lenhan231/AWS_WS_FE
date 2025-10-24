# Basic Auth Mode - Quick Start Guide

## What is Basic Auth Mode?

Basic Auth mode allows you to test the backend API directly without any login UI or Cognito setup. Perfect for:
- Backend API development and testing
- Quick verification of endpoints
- Testing with different user roles
- Debugging API issues

## Setup (Already Done!)

Your `.env.local` is already configured for Basic Auth mode:

```env
NEXT_PUBLIC_USE_COGNITO=false
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_BASIC_USER=local-admin
NEXT_PUBLIC_BASIC_PASS=local-password
```

## How It Works

1. **No Login UI**: You don't need to use the login page
2. **Automatic Auth**: Every API request automatically includes Basic Auth header
3. **Direct Backend Access**: All requests go to `http://localhost:8080/api/v1`
4. **Admin Access**: You're authenticated as admin with full permissions

## Usage

### Start the Frontend

```bash
npm run dev
# or
yarn dev
```

### Navigate Directly to Dashboard

Just go to: `http://localhost:3000/dashboard/admin`

No login needed! The app will:
1. Call `/api/v1/auth/me` with Basic Auth header
2. Load your user profile from backend
3. Display the admin dashboard with real data

### Test API Endpoints

All API calls automatically include Basic Auth:

```typescript
// This works automatically - no manual auth needed
const response = await api.admin.getPendingOffers();
const gyms = await api.gyms.getAll();
const trainers = await api.ptUsers.getAll();
```

## Verify Backend Connection

Test the backend directly:

```bash
curl -i -u local-admin:local-password http://localhost:8080/api/v1/auth/me
```

Expected response: `HTTP/1.1 200` with user JSON

## Troubleshooting

### "Request aborted" errors?

**Restart the frontend dev server** after changing `.env.local`:
```bash
# Stop with Ctrl+C, then:
npm run dev
```

### Still seeing errors?

1. **Check backend is running**: `http://localhost:8080`
2. **Verify Basic Auth is enabled** in backend `application.properties`:
   ```properties
   app.auth.basic.enabled=true
   app.auth.basic.username=local-admin
   app.auth.basic.password=local-password
   ```
3. **Check CORS**: Backend should allow `http://localhost:3000`

### 401 Unauthorized?

The Basic Auth credentials might be wrong. Check:
- Frontend `.env.local`: `NEXT_PUBLIC_BASIC_USER` and `NEXT_PUBLIC_BASIC_PASS`
- Backend `application.properties`: `app.auth.basic.username` and `app.auth.basic.password`

### 403 Forbidden?

Your user role doesn't have permission. Check backend:
```properties
app.auth.basic.role=ADMIN
```

## Switching to Other Modes

### Switch to Mock Cognito (Login UI)

Edit `.env.local`:
```env
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

Then restart dev server. Now you'll have login UI with test users.

### Switch to Real Cognito (Production)

Edit `.env.local`:
```env
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_REGION=us-east-1
```

Then restart dev server.

## What's Different in Basic Auth Mode?

| Feature          | Basic Auth         | Mock Cognito   | Real Cognito |
| ---------------- | ------------------ | -------------- | ------------ |
| Login UI         | ❌ No               | ✅ Yes          | ✅ Yes        |
| Backend Required | ✅ Yes              | ✅ Yes          | ✅ Yes        |
| AWS Setup        | ❌ No               | ❌ No           | ✅ Yes        |
| User Roles       | Backend controlled | Mock users     | Real users   |
| Best For         | API testing        | UI development | Production   |

## Current Status

✅ Basic Auth mode is **ACTIVE**
✅ API client configured correctly
✅ Auth store updated to handle Basic Auth
✅ All API calls will use Basic Auth header

**Next step**: Restart your frontend dev server and navigate to `/dashboard/admin`
