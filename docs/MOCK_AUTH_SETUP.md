# Mock Authentication Setup Guide

## Overview

This project supports **two authentication modes**:

1. **Mock Authentication** - For local development without AWS Cognito
2. **Real AWS Cognito** - For production and staging environments

## Quick Start (Mock Authentication)

### 1. Enable Mock Mode

Create `.env.local` file:

```bash
NEXT_PUBLIC_USE_MOCK_AUTH=true
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

### 2. Configure Backend

In your backend `application-local.yml` or environment variables:

```yaml
aws:
  enabled: false  # Disable AWS Cognito validation

app:
  auth:
    basic:
      enabled: true  # Enable Basic Auth for local dev
      username: local-admin
      password: local-password
```

### 3. Start Development

```bash
npm run dev
```

### 4. Use Test Accounts

Mock authentication comes with pre-seeded test users:

| Email | Password | Role |
|-------|----------|------|
| `client@test.com` | `password123` | CLIENT_USER |
| `gym@test.com` | `password123` | GYM_STAFF |
| `trainer@test.com` | `password123` | PT_USER |
| `admin@test.com` | `password123` | ADMIN |

## How Mock Authentication Works

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend Application                   │
│  (React Components, authStore, API Client)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Uses cognito service
                     │
┌────────────────────▼────────────────────────────────────┐
│              Cognito Service Factory                     │
│  (lib/cognito.ts)                                       │
│  Checks NEXT_PUBLIC_USE_MOCK_AUTH                       │
└────────┬───────────────────────────────┬────────────────┘
         │                               │
         │ Mock Mode                     │ Production Mode
         │                               │
┌────────▼──────────────┐    ┌──────────▼─────────────────┐
│  MockCognitoService   │    │  RealCognitoService        │
│  (lib/mockCognito.ts) │    │  (lib/realCognito.ts)      │
│                       │    │                            │
│  - localStorage       │    │  - AWS Amplify             │
│  - Mock JWT tokens    │    │  - Real Cognito            │
│  - Pre-seeded users   │    │  - Real JWT tokens         │
└───────────────────────┘    └────────────────────────────┘
```

### Authentication Flow

#### Registration Flow (Mock Mode)

```
1. User fills registration form
   ↓
2. Frontend → MockCognito.signUp()
   - Validates email and password
   - Stores user in localStorage
   - Returns success
   ↓
3. Frontend → MockCognito.signIn()
   - Validates credentials
   - Generates mock JWT tokens
   - Stores session in localStorage
   ↓
4. Frontend → Backend /api/v1/auth/register (with JWT in header)
   - Backend validates JWT (or uses Basic Auth in dev)
   - Creates user profile in database
   ↓
5. ✅ User registered and authenticated
```

#### Login Flow (Mock Mode)

```
1. User enters email and password
   ↓
2. Frontend → MockCognito.signIn()
   - Validates credentials from localStorage
   - Generates mock JWT tokens
   - Stores session in localStorage
   ↓
3. Frontend stores JWT token
   ↓
4. All API calls include JWT in Authorization header
   ↓
5. ✅ User authenticated
```

### Mock JWT Token Structure

Mock tokens follow standard JWT format:

```
header.payload.signature
```

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload (ID Token):**
```json
{
  "sub": "mock-user-1234567890",
  "email": "client@test.com",
  "given_name": "Test",
  "family_name": "Client",
  "phone_number": "+1234567890",
  "custom:role": "CLIENT_USER",
  "iat": 1234567890,
  "exp": 1234571490,
  "iss": "mock-cognito"
}
```

**Signature:**
Random base64 string (for realism, not cryptographically validated)

### LocalStorage Keys

Mock authentication uses these localStorage keys:

- `mock_users` - Array of registered users
- `mock_session` - Current user session with tokens
- `mock_current_user` - Current user data
- `mock_reset_codes` - Password reset codes

### Features

✅ **Sign Up** - Register new users with email validation  
✅ **Sign In** - Authenticate with email and password  
✅ **Sign Out** - Clear session  
✅ **Email Verification** - Accepts any 6-digit code (except "000000" for testing errors)  
✅ **Password Reset** - Generates code and logs to console  
✅ **Session Management** - Persists across page refreshes  
✅ **Token Expiration** - 1 hour for access tokens  
✅ **Pre-seeded Users** - Ready-to-use test accounts  
✅ **Console Logging** - All operations logged with `[MOCK AUTH]` prefix  

## Backend Configuration

### Option 1: Basic Auth (Recommended for Local Dev)

**Backend Configuration:**

```yaml
# application-local.yml
aws:
  enabled: false

app:
  auth:
    basic:
      enabled: true
      username: local-admin
      password: local-password
```

**How it works:**
- Backend accepts `Authorization: Basic <base64(local-admin:local-password)>`
- No Cognito validation
- Perfect for local development

### Option 2: Disable Authentication (Not Recommended)

```yaml
# application-local.yml
aws:
  enabled: false

app:
  auth:
    basic:
      enabled: false
```

**Note:** This will make all endpoints public. Only use for testing.

### Option 3: Mock JWT Validation (Advanced)

If your backend can accept mock JWT tokens without validating against Cognito:

```yaml
# application-local.yml
aws:
  enabled: false  # Don't validate with Cognito
  
jwt:
  validation:
    enabled: false  # Skip signature validation
```

## Switching to Real Cognito

### 1. Update Frontend Configuration

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_REGION=us-east-1
```

### 2. Update Backend Configuration

```yaml
# application.yml or environment variables
aws:
  enabled: true
  cognito:
    userPoolId: us-east-1_XXXXXXXXX
    clientId: xxxxxxxxxxxxxxxxxxxxxxxxxx
    jwksUrl: https://cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXXXXXXX/.well-known/jwks.json

app:
  auth:
    basic:
      enabled: false  # Disable Basic Auth
```

### 3. Restart Application

```bash
npm run dev
```

### 4. Register Real Users

Users must register through AWS Cognito (email verification required).

## Development Mode Indicators

When mock mode is active, you'll see:

### Console Warnings

```
⚠️ MOCK AUTHENTICATION ACTIVE
🔧 This should only be used in development!
```

### Available Test Users

```
┌─────────────────────┬──────────────┬─────────────┐
│ Email               │ Password     │ Role        │
├─────────────────────┼──────────────┼─────────────┤
│ client@test.com     │ password123  │ CLIENT_USER │
│ gym@test.com        │ password123  │ GYM_STAFF   │
│ trainer@test.com    │ password123  │ PT_USER     │
│ admin@test.com      │ password123  │ ADMIN       │
└─────────────────────┴──────────────┴─────────────┘
```

### Operation Logs

All mock auth operations are logged:

```
[MOCK AUTH] SignUp attempt for: newuser@test.com
[MOCK AUTH] User created successfully: newuser@test.com
[MOCK AUTH] SignIn attempt for: newuser@test.com
[MOCK AUTH] Generated JWT tokens for: newuser@test.com
[MOCK AUTH] SignIn successful: newuser@test.com
```

## Troubleshooting

### "Auth UserPool not configured" Error

**Cause:** Backend is trying to validate Cognito but credentials are missing.

**Solution:**
```yaml
# Backend: application-local.yml
aws:
  enabled: false  # Disable Cognito validation
```

### "401 Unauthorized" on API Calls

**Cause:** Backend requires authentication but token is invalid.

**Solutions:**

1. **Enable Basic Auth:**
```yaml
app:
  auth:
    basic:
      enabled: true
```

2. **Check JWT token is being sent:**
```javascript
// Browser console
localStorage.getItem('auth_token')
```

3. **Verify API client includes token:**
```typescript
// lib/api.ts should have interceptor
config.headers.Authorization = `Bearer ${token}`;
```

### Mock Users Not Appearing

**Cause:** localStorage not initialized.

**Solution:**
```javascript
// Browser console
localStorage.clear()
// Refresh page
```

### Session Expired

**Cause:** Mock tokens expire after 1 hour.

**Solution:**
```javascript
// Sign in again
// Or clear localStorage and refresh
localStorage.clear()
```

## Testing

### Manual Testing Checklist

- [ ] Enable mock mode in `.env.local`
- [ ] Verify console warning appears
- [ ] Sign in with pre-seeded user
- [ ] Verify session persists after refresh
- [ ] Register new user
- [ ] Test password reset flow
- [ ] Sign out and verify session cleared
- [ ] Switch to real Cognito mode
- [ ] Verify no mock indicators appear

### Automated Testing

```bash
# Run tests with mock auth
NEXT_PUBLIC_USE_MOCK_AUTH=true npm test

# Run tests with real Cognito
NEXT_PUBLIC_USE_MOCK_AUTH=false npm test
```

## Security Notes

⚠️ **IMPORTANT:**

1. **Never use mock auth in production**
   - Set `NEXT_PUBLIC_USE_MOCK_AUTH=false` in production
   - Use real AWS Cognito for production

2. **Mock passwords are not secure**
   - Base64 encoding is NOT encryption
   - Only for development purposes

3. **Mock tokens are not validated**
   - Backend should use Basic Auth or disable validation in dev
   - Never accept mock tokens in production

4. **Clear localStorage regularly**
   - Mock data persists in browser
   - Clear when switching between projects

## Best Practices

✅ **DO:**
- Use mock auth for local development
- Clear localStorage when switching modes
- Test with different user roles
- Log all mock operations for debugging

❌ **DON'T:**
- Use mock auth in production
- Commit `.env.local` to git
- Share mock credentials (they're public anyway)
- Rely on mock token security

## Support

For issues or questions:

1. Check this documentation
2. Review `docs/AUTH_FLOW_FIX.md`
3. Check console logs for `[MOCK AUTH]` messages
4. Verify backend configuration
5. Clear localStorage and try again

## Related Documentation

- [Authentication Flow Fix](./AUTH_FLOW_FIX.md)
- [API Integration Guide](./api/API_INTEGRATION.md)
- [Cognito Setup Guide](./COGNITO_SETUP_GUIDE.md)
