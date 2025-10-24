# Backend Connection Fix

## Problem
Frontend was showing "Request aborted" errors for all API calls:
- `/admin/offers/pending`
- `/admin/reports/pending`
- `/pt-users`
- `/gyms`

## Root Cause
Frontend was in **Mock Auth mode** which doesn't connect to the real backend. The mock system was trying to make relative URL calls that the browser couldn't resolve, causing request aborts.

## Solution Applied

### 1. Switched to Basic Auth Mode
Updated `.env.local` to use Basic Auth for direct backend testing:

```env
# MODE 1: Basic Auth (Direct API testing, no login UI) ⭐ ACTIVE
NEXT_PUBLIC_USE_COGNITO=false
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

### 2. Configuration Already Correct
The following were already properly configured:
- ✅ API Base URL: `http://localhost:8080/api/v1`
- ✅ Basic Auth credentials: `local-admin` / `local-password`
- ✅ API client interceptor handles Basic Auth automatically

### 3. Added Request Cancellation Handling
Enhanced `lib/api.ts` to silently handle cancelled requests (normal when components unmount):

```typescript
// Silently ignore cancelled/aborted requests
if (axios.isCancel(error) || error.message === 'Request aborted' || error.code === 'ERR_CANCELED') {
  return Promise.reject(error);
}
```

## Changes Made

### 1. Updated `.env.local`
Switched from Mock Auth to Basic Auth mode

### 2. Updated `store/authStore.ts`
Added Basic Auth mode support:
- `login()` now checks for Basic Auth mode and calls `/auth/me` directly
- `initializeAuth()` loads user from backend in Basic Auth mode
- No Cognito calls when `NEXT_PUBLIC_USE_COGNITO=false`

### 3. Enhanced `lib/api.ts`
Added request cancellation handling to silence normal abort errors

## Next Steps

### ⚠️ IMPORTANT: Restart Frontend Dev Server
```bash
# Stop current dev server (Ctrl+C)
npm run dev
# or
yarn dev
```

**You MUST restart for .env.local changes to take effect!**

### Verify Backend Connection
```bash
curl -i -u local-admin:local-password http://localhost:8080/api/v1/admin/offers/pending
```

Expected: `HTTP/1.1 200` with JSON response

## Current Setup

### Backend
- Running on: `http://localhost:8080`
- API prefix: `/api/v1`
- Auth: Basic Auth (local-admin / local-password)
- CORS: Allows `http://localhost:3000`

### Frontend
- Running on: `http://localhost:3000`
- Auth Mode: Basic Auth (no login UI)
- API calls: Direct to backend with Basic Auth header

## Testing

After restarting the frontend:

1. Navigate to admin dashboard: `http://localhost:3000/dashboard/admin`
2. Should see data loading from backend (no "Request aborted" errors)
3. Check browser console - should be clean
4. Check Network tab - should see successful API calls with 200 status

## Switching Back to Mock Auth

If you want to switch back to Mock Auth mode (for UI development without backend):

```env
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

Then restart the dev server.

## Auth Modes Reference

See `docs/AUTH_MODES.md` for complete details on all three authentication modes:
1. Basic Auth (current) - Direct backend testing
2. Mock Cognito - UI development with mock data
3. Real Cognito - Production authentication
