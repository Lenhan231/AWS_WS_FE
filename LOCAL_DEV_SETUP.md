# Local Development Setup ✅

## Current Configuration

✅ **Mock Authentication Enabled**  
✅ **No AWS Cognito Required**  
✅ **Backend: Basic Auth Mode**

---

## Quick Start

### 1. Frontend is Ready! ✅

File `.env.local` đã được tạo với:
```bash
NEXT_PUBLIC_USE_MOCK_AUTH=true
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

### 2. Start Frontend

```bash
npm run dev
```

Bạn sẽ thấy:
- ⚠️ Orange banner: "DEVELOPMENT MODE: Mock Authentication Active"
- Console log: Available test users

### 3. Login với Test Users

| Email | Password | Role |
|-------|----------|------|
| `client@test.com` | `password123` | CLIENT_USER |
| `gym@test.com` | `password123` | GYM_STAFF |
| `trainer@test.com` | `password123` | PT_USER |
| `admin@test.com` | `password123` | ADMIN |

### 4. Backend Configuration

Backend đã ở chế độ local (`AWS_ENABLED=false`), nhưng cần đảm bảo Basic Auth enabled:

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

---

## How It Works

### Frontend (Mock Cognito)
```
User Login
    ↓
MockCognito.signIn()
    ↓
Validates credentials from localStorage
    ↓
Generates mock JWT token
    ↓
Stores in localStorage
    ↓
✅ Authenticated!
```

### Backend (Basic Auth)
```
API Request
    ↓
Includes JWT token in header
    ↓
Backend accepts Basic Auth (local-admin:local-password)
    ↓
✅ Request authorized!
```

---

## Features Available

✅ **User Registration** - Creates users in localStorage  
✅ **User Login** - Validates against localStorage  
✅ **Session Persistence** - Survives page refresh  
✅ **Password Reset** - Simulated with console logs  
✅ **Email Verification** - Accepts any 6-digit code  
✅ **JWT Tokens** - Realistic mock tokens  
✅ **Role-Based Access** - All 4 roles supported  

---

## Testing

### Test Registration
1. Go to `/auth/register`
2. Fill form with new email
3. Submit
4. ✅ User created in localStorage
5. ✅ Auto logged in

### Test Login
1. Go to `/auth/login`
2. Use: `client@test.com` / `password123`
3. Submit
4. ✅ Logged in with mock JWT

### Test Session
1. Login
2. Refresh page
3. ✅ Still logged in (session persists)

### Test Logout
1. Click logout
2. ✅ Session cleared
3. ✅ Redirected to login

---

## Troubleshooting

### "Auth UserPool not configured"

**Cause:** RealCognito is being used instead of MockCognito

**Fix:** Verify `.env.local` has:
```bash
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

Then restart dev server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### "401 Unauthorized" from Backend

**Cause:** Backend not accepting requests

**Fix:** Check backend `application-local.yml`:
```yaml
app:
  auth:
    basic:
      enabled: true
```

### Mock Users Not Showing

**Cause:** localStorage not initialized

**Fix:** Open browser console and run:
```javascript
localStorage.clear()
// Refresh page
```

### Session Expired

**Cause:** Mock tokens expire after 1 hour

**Fix:** Just login again!

---

## Console Logs

You'll see helpful logs:

```
⚠️ MOCK AUTHENTICATION ACTIVE
🔧 This should only be used in development!

[MOCK AUTH] Initialized default test users
┌─────────────────────┬──────────────┬─────────────┐
│ Email               │ Password     │ Role        │
├─────────────────────┼──────────────┼─────────────┤
│ client@test.com     │ password123  │ CLIENT_USER │
│ gym@test.com        │ password123  │ GYM_STAFF   │
│ trainer@test.com    │ password123  │ PT_USER     │
│ admin@test.com      │ password123  │ ADMIN       │
└─────────────────────┴──────────────┴─────────────┘

[MOCK AUTH] SignIn attempt for: client@test.com
[MOCK AUTH] Generated JWT tokens for: client@test.com
[MOCK AUTH] SignIn successful: client@test.com
```

---

## Switching to Real Cognito (Later)

When you're ready to use real AWS Cognito:

### 1. Update `.env.local`
```bash
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_REGION=us-east-1
```

### 2. Update Backend
```yaml
aws:
  enabled: true
  cognito:
    userPoolId: us-east-1_XXXXXXXXX
    clientId: xxxxxxxxxxxxxxxxxxxxxxxxxx
    jwksUrl: https://cognito-idp.us-east-1.amazonaws.com/...
```

### 3. Restart Both
```bash
# Frontend
npm run dev

# Backend
./gradlew bootRun
```

---

## Current Status

✅ Mock Cognito implemented  
✅ Pre-seeded test users ready  
✅ localStorage-based authentication  
✅ Mock JWT token generation  
✅ Session management  
✅ Development mode indicators  
✅ `.env.local` configured  

**You're ready to develop!** 🚀

---

## Quick Commands

```bash
# Start frontend
npm run dev

# Clear mock data
# Open browser console:
localStorage.clear()

# View mock users
# Open browser console:
JSON.parse(localStorage.getItem('mock_users'))

# View current session
# Open browser console:
JSON.parse(localStorage.getItem('mock_session'))
```

---

## Documentation

- **Full Setup Guide:** `docs/MOCK_AUTH_SETUP.md`
- **Quick Start:** `MOCK_AUTH_QUICKSTART.md`
- **Implementation Details:** `docs/MOCK_AUTH_IMPLEMENTATION_COMPLETE.md`

---

**Happy Coding!** 🎉
