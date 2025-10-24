# Basic Auth Mode - Implementation Complete ✅

## Summary

Successfully implemented Basic Auth mode for direct API testing without Cognito. All API requests automatically inject Basic Auth header when `NEXT_PUBLIC_USE_COGNITO=false`.

## Implementation Date

**Completed:** January 2025

## What Was Implemented

### 1. Environment Configuration ✅

**File:** `.env.local`

**Added:**
```bash
NEXT_PUBLIC_USE_COGNITO=false
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_BASIC_USER=local-admin
NEXT_PUBLIC_BASIC_PASS=local-password
```

**Purpose:**
- Control authentication mode
- Provide Basic Auth credentials
- Enable direct API testing

### 2. API Client Interceptor ✅

**File:** `lib/api.ts`

**Changes:**
- Added Basic Auth mode detection
- Inject Basic Auth header when `NEXT_PUBLIC_USE_COGNITO=false`
- Support both browser (btoa) and Node.js (Buffer) environments
- Console logging for debugging

**Implementation:**
```typescript
private setupInterceptors() {
  this.client.interceptors.request.use(
    async (config) => {
      const useCognito = process.env.NEXT_PUBLIC_USE_COGNITO !== 'false';
      
      if (!useCognito) {
        // Basic Auth mode
        const username = process.env.NEXT_PUBLIC_BASIC_USER || 'local-admin';
        const password = process.env.NEXT_PUBLIC_BASIC_PASS || 'local-password';
        
        const credentials = typeof window !== 'undefined'
          ? btoa(`${username}:${password}`)
          : Buffer.from(`${username}:${password}`).toString('base64');
        
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Basic ${credentials}`;
        
        console.log('[API] Using Basic Auth mode');
        return config;
      }
      
      // Cognito/Mock Auth mode (existing code)
      // ...
    }
  );
}
```

### 3. Environment Template ✅

**File:** `.env.local.example`

**Updated:**
- Documented 3 authentication modes
- Added Basic Auth configuration
- Added testing checklist
- Added backend configuration notes

**Modes:**
1. **Basic Auth**: Direct API testing, no Cognito
2. **Mock Cognito**: localStorage-based auth for development
3. **Real Cognito**: Production AWS Cognito

### 4. Documentation ✅

**File:** `BASIC_AUTH_QUICKSTART.md`

**Contents:**
- Quick setup guide
- How it works
- API endpoints reference
- Testing different roles
- Common issues and solutions
- Testing workflow
- Advantages and disadvantages
- When to use each mode
- Environment variables reference
- Backend configuration reference
- Console logs examples

## Authentication Modes

### Mode 1: Basic Auth (NEW)

**Use Case:** Direct API testing without Cognito

**Configuration:**
```bash
NEXT_PUBLIC_USE_COGNITO=false
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_BASIC_USER=local-admin
NEXT_PUBLIC_BASIC_PASS=local-password
```

**Flow:**
```
Request → Interceptor → Inject Basic Auth → Backend → Response
```

**Features:**
- ✅ No login required
- ✅ Direct API access
- ✅ Role controlled by backend
- ✅ Fast iteration
- ✅ Simple debugging

### Mode 2: Mock Cognito (EXISTING)

**Use Case:** Full auth flow testing with UI

**Configuration:**
```bash
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

**Flow:**
```
Login UI → Mock Cognito → localStorage → JWT Token → API
```

**Features:**
- ✅ Login/Register UI
- ✅ Token management
- ✅ Multiple users
- ✅ User-specific data
- ✅ Email confirmation flow

### Mode 3: Real Cognito (EXISTING)

**Use Case:** Production deployment

**Configuration:**
```bash
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_COGNITO_USER_POOL_ID=...
NEXT_PUBLIC_COGNITO_CLIENT_ID=...
```

**Flow:**
```
Login UI → AWS Cognito → JWT Token → API
```

**Features:**
- ✅ Real AWS authentication
- ✅ Email verification
- ✅ Password reset
- ✅ MFA support
- ✅ Production-ready

## Files Modified

1. `.env.local` - Added Basic Auth configuration
2. `lib/api.ts` - Added Basic Auth interceptor
3. `.env.local.example` - Updated with 3 modes documentation
4. `BASIC_AUTH_QUICKSTART.md` - New quick start guide
5. `docs/BASIC_AUTH_IMPLEMENTATION_COMPLETE.md` - This file

## How It Works

### Request Flow

```
1. Frontend makes API request
   ↓
2. Axios interceptor checks NEXT_PUBLIC_USE_COGNITO
   ↓
3. If false: Inject Basic Auth header
   If true: Use Cognito/Mock token
   ↓
4. Request sent to backend
   ↓
5. Backend validates credentials
   ↓
6. Backend assigns role from LOCAL_BASIC_AUTH_ROLE
   ↓
7. Response returned
```

### Header Injection

```typescript
// Browser environment
const credentials = btoa(`${username}:${password}`);
// Result: "bG9jYWwtYWRtaW46bG9jYWwtcGFzc3dvcmQ="

// Node.js environment
const credentials = Buffer.from(`${username}:${password}`).toString('base64');
// Result: "bG9jYWwtYWRtaW46bG9jYWwtcGFzc3dvcmQ="

// Header
Authorization: Basic bG9jYWwtYWRtaW46bG9jYWwtcGFzc3dvcmQ=
```

## Testing Different Roles

### Test as ADMIN

```yaml
# Backend: application-local.yml
LOCAL_BASIC_AUTH_ROLE: ADMIN
```

**Can access:**
- All admin endpoints
- User management
- Gym management
- Moderation
- Analytics

### Test as GYM_STAFF

```yaml
LOCAL_BASIC_AUTH_ROLE: GYM_STAFF
```

**Can access:**
- Gym management
- Trainer approvals
- Offers
- Bookings

### Test as PT_USER

```yaml
LOCAL_BASIC_AUTH_ROLE: PT_USER
```

**Can access:**
- Trainer profile
- Availability
- Offers
- Clients

### Test as CLIENT_USER

```yaml
LOCAL_BASIC_AUTH_ROLE: CLIENT_USER
```

**Can access:**
- Browse gyms/trainers
- Book sessions
- Leave reviews
- Manage profile

## API Endpoints

### Correct Endpoints

✅ **Auth:**
- `POST /auth/register` - Register user profile
- `GET /auth/me` - Get current user

✅ **Search:**
- `POST /search/offers` - Search offers with filters
- `GET /search/offers?page=0&size=10` - Search offers with pagination

✅ **Gyms:**
- `GET /gyms?page=0&size=10` - Get all gyms
- `GET /gyms/{id}` - Get gym by ID
- `POST /gyms` - Create gym
- `PUT /gyms/{id}` - Update gym

✅ **Trainers:**
- `GET /trainers?page=0&size=10` - Get all trainers
- `GET /trainers/{id}` - Get trainer by ID
- `POST /trainers` - Create trainer profile
- `PUT /trainers/{id}` - Update trainer profile

### Incorrect Endpoints

❌ **Don't use:**
- `POST /auth/login` - Backend doesn't have this endpoint
- `GET /offers` - Use `/search/offers` instead

## Common Issues

### Issue: 401 Unauthorized

**Symptoms:**
- API requests fail with 401
- No auth header in request

**Solutions:**
1. Check `NEXT_PUBLIC_USE_COGNITO=false` in `.env.local`
2. Restart dev server: `npm run dev`
3. Check console: `[API] Using Basic Auth mode`
4. Verify backend has `app.auth.basic.enabled=true`

### Issue: 403 Forbidden

**Symptoms:**
- API requests fail with 403
- Auth header present but access denied

**Solutions:**
1. Check endpoint required role in Swagger
2. Update `LOCAL_BASIC_AUTH_ROLE` in backend
3. Restart backend
4. Test again

### Issue: CORS Error

**Symptoms:**
- Browser blocks request
- CORS policy error in console

**Solutions:**
```yaml
# Backend: application-local.yml
app:
  cors:
    allowed-origins:
      - http://localhost:3000
```

## Testing Results

### ✅ All Tests Passed

- ✅ No TypeScript errors
- ✅ No linting errors
- ✅ Basic Auth header injected correctly
- ✅ Browser environment works (btoa)
- ✅ Node.js environment works (Buffer)
- ✅ Console logging works
- ✅ Fallback to Cognito mode works

### Manual Testing

- ✅ Set `NEXT_PUBLIC_USE_COGNITO=false`
- ✅ Restart dev server
- ✅ Make API request
- ✅ Check console: `[API] Using Basic Auth mode`
- ✅ Check network tab: `Authorization: Basic ...`
- ✅ Backend receives correct header
- ✅ Backend validates credentials
- ✅ Backend assigns role
- ✅ API response successful

## Advantages

### Development Speed
- ✅ No Cognito setup required
- ✅ No login UI needed
- ✅ Direct API testing
- ✅ Fast iteration

### Debugging
- ✅ Clear auth flow
- ✅ Easy to trace
- ✅ Console logging
- ✅ Simple troubleshooting

### Role Testing
- ✅ Easy role switching
- ✅ Test all permissions
- ✅ Quick backend restart
- ✅ No user management

### Simplicity
- ✅ Minimal configuration
- ✅ No token management
- ✅ No session handling
- ✅ Straightforward flow

## Disadvantages

### Not Production-Ready
- ❌ Only for local development
- ❌ No real authentication
- ❌ Security concerns

### Limited Features
- ❌ No user context
- ❌ No user-specific data
- ❌ No multi-user testing
- ❌ No token expiration

### Manual Role Switch
- ❌ Need backend restart
- ❌ Can't test multiple roles simultaneously
- ❌ No dynamic role assignment

## When to Use

### Use Basic Auth Mode When:
- ✅ Testing API endpoints directly
- ✅ Debugging backend integration
- ✅ Testing different role permissions
- ✅ Quick prototyping
- ✅ No need for user-specific data
- ✅ Want fast iteration

### Use Mock Cognito Mode When:
- ✅ Testing full auth flow
- ✅ Testing UI login/register
- ✅ Testing user-specific features
- ✅ Testing token management
- ✅ Need multiple users
- ✅ Testing email confirmation

### Use Real Cognito Mode When:
- ✅ Production deployment
- ✅ Staging environment
- ✅ Testing real AWS integration
- ✅ Testing email verification
- ✅ Need real user management
- ✅ Security testing

## Configuration Reference

### Frontend (.env.local)

```bash
# Basic Auth Mode
NEXT_PUBLIC_USE_COGNITO=false
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_BASIC_USER=local-admin
NEXT_PUBLIC_BASIC_PASS=local-password

# Mock Cognito Mode
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

# Real Cognito Mode
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Backend (application-local.yml)

```yaml
# Basic Auth Mode
aws:
  enabled: false

app:
  auth:
    basic:
      enabled: true
      username: local-admin
      password: local-password
  cors:
    allowed-origins:
      - http://localhost:3000

# Set role for testing
LOCAL_BASIC_AUTH_ROLE: ADMIN  # or GYM_STAFF, PT_USER, CLIENT_USER

# Real Cognito Mode
aws:
  enabled: true
  cognito:
    userPoolId: us-east-1_XXXXXXXXX
    clientId: xxxxxxxxxxxxxxxxxxxxxxxxxx
    jwksUrl: https://cognito-idp.us-east-1.amazonaws.com/...

app:
  auth:
    basic:
      enabled: false
```

## Console Logs

### Successful Request

```
[API] Using Basic Auth mode
POST http://localhost:8080/api/v1/auth/register 200 OK
```

### Failed Request (401)

```
[API] Using Basic Auth mode
GET http://localhost:8080/api/v1/auth/me 401 Unauthorized
API Error: {
  message: "Invalid credentials",
  status: 401
}
```

### Failed Request (403)

```
[API] Using Basic Auth mode
POST http://localhost:8080/api/v1/admin/users 403 Forbidden
API Error: {
  message: "Insufficient permissions",
  status: 403
}
```

## Related Documentation

- [Basic Auth Quick Start](../BASIC_AUTH_QUICKSTART.md)
- [Mock Auth Setup](../MOCK_AUTH_QUICKSTART.md)
- [Email Confirmation](../EMAIL_CONFIRMATION_QUICKSTART.md)
- [API Client Complete](./API_CLIENT_COMPLETE.md)

## Conclusion

Successfully implemented Basic Auth mode for direct API testing. The implementation provides a simple, fast way to test backend integration without Cognito complexity.

### Key Achievements
✅ Basic Auth header injection
✅ Environment-based mode switching
✅ Browser and Node.js support
✅ Console logging for debugging
✅ Comprehensive documentation
✅ Zero errors

---

**Status:** ✅ COMPLETE
**Mode:** Basic Auth (No Cognito)
**Performance:** Fast
**Complexity:** Low
**Ready for:** Local Development Testing
