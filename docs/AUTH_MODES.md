# Authentication Modes Guide

## Overview

Ứng dụng hỗ trợ 3 modes authentication khác nhau, mỗi mode phù hợp với một use case cụ thể.

## Mode Comparison

| Feature | Basic Auth | Mock Cognito | Real Cognito |
|---------|-----------|--------------|--------------|
| **Use Case** | API testing | Development | Production |
| **Login UI** | ❌ No | ✅ Yes | ✅ Yes |
| **Email Confirmation** | ❌ No | ❌ No | ✅ Yes |
| **AWS Required** | ❌ No | ❌ No | ✅ Yes |
| **Backend Auth** | Basic Auth | Basic Auth | JWT (Cognito) |
| **User Management** | Backend only | localStorage | AWS Cognito |
| **Pre-seeded Users** | ❌ No | ✅ Yes | ❌ No |

## Mode 1: Basic Auth (Direct API Testing)

### When to Use
- Testing API endpoints directly
- Backend development
- No need for login UI
- Quick testing without auth complexity

### Configuration

```env
# .env.local
NEXT_PUBLIC_USE_COGNITO=false
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_BASIC_USER=local-admin
NEXT_PUBLIC_BASIC_PASS=local-password
```

### Backend Configuration

```properties
# application.properties
AWS_ENABLED=false
app.auth.basic.enabled=true
LOCAL_BASIC_AUTH_ROLE=ADMIN
```

### How It Works

1. **No Login UI**: Users don't need to login
2. **Direct API Access**: All requests include Basic Auth header
3. **Fixed Role**: Role determined by backend `LOCAL_BASIC_AUTH_ROLE`
4. **No Token**: No JWT tokens, just Basic Auth

### API Request Example

```typescript
// Automatic Basic Auth header
Authorization: Basic bG9jYWwtYWRtaW46bG9jYWwtcGFzc3dvcmQ=
```

### Features Available
- ✅ All API endpoints
- ✅ Role-based access control
- ❌ No login/register UI
- ❌ No user profile management
- ❌ No email confirmation

### Testing

```bash
# Test API directly
curl -H "Authorization: Basic bG9jYWwtYWRtaW46bG9jYWwtcGFzc3dvcmQ=" \
  http://localhost:8080/api/v1/gyms
```

## Mode 2: Mock Cognito (Development)

### When to Use
- Frontend development
- Testing auth flows
- No AWS credentials available
- Need login UI without AWS setup

### Configuration

```env
# .env.local
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

### Backend Configuration

```properties
# application.properties
AWS_ENABLED=false
app.auth.basic.enabled=true
```

### How It Works

1. **Login UI Available**: Full registration and login pages
2. **localStorage Storage**: Users stored in browser localStorage
3. **Mock JWT Tokens**: Realistic JWT tokens generated
4. **Auto-Confirmation**: Users auto-confirmed (no email needed)
5. **Pre-seeded Users**: Test users available immediately

### Pre-seeded Test Users

```
Email: client@test.com
Password: password123
Role: CLIENT_USER

Email: gym@test.com
Password: password123
Role: GYM_STAFF

Email: trainer@test.com
Password: password123
Role: PT_USER

Email: admin@test.com
Password: password123
Role: ADMIN
```

### Features Available
- ✅ Login/Register UI
- ✅ User profile management
- ✅ Role-based access control
- ✅ Session management
- ✅ Mock JWT tokens
- ❌ No email confirmation (auto-confirmed)
- ❌ No real email sending

### User Flow

```
Register → Auto-confirm → Auto sign-in → Dashboard
```

### Console Logs

```
[MOCK AUTH] User created and auto-confirmed: john@example.com
[AUTH] Step 2: Auto signing in (no confirmation needed)...
✅ Registration successful! User role: CLIENT_USER
```

## Mode 3: Real Cognito (Production)

### When to Use
- Production environment
- Staging environment
- Need real email verification
- Need AWS Cognito features

### Configuration

```env
# .env.local
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_REGION=us-east-1
```

### Backend Configuration

```properties
# application.properties
AWS_ENABLED=true
app.auth.basic.enabled=false
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
COGNITO_JWKS_URL=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXXXXXXX/.well-known/jwks.json
```

### How It Works

1. **Login UI Available**: Full registration and login pages
2. **AWS Cognito Storage**: Users stored in AWS Cognito
3. **Real JWT Tokens**: Tokens issued by AWS Cognito
4. **Email Confirmation Required**: Users must confirm email
5. **Real Email Sending**: Emails sent via AWS SES

### Features Available
- ✅ Login/Register UI
- ✅ User profile management
- ✅ Role-based access control
- ✅ Session management
- ✅ Real JWT tokens
- ✅ Email confirmation flow
- ✅ Real email sending
- ✅ Password reset
- ✅ MFA (if configured)

### User Flow

```
Register → Email Confirmation Page → Enter Code → 
Confirm → Auto sign-in → Dashboard
```

### Email Confirmation

**When Required:**
- New user registration
- Unconfirmed user login attempt

**Confirmation Page:**
- URL: `/auth/confirm?email=user@example.com`
- 6-digit code input
- Auto-submit when 6 digits entered
- Resend code button (60s cooldown)
- Auto sign-in after confirmation

**Email Example:**
```
Subject: Your verification code

Your verification code is: 123456

This code will expire in 24 hours.
```

### Console Logs

```
[AUTH] Step 1 complete: User created in Cognito
[AUTH] Email confirmation required
[CONFIRM] Confirming email for: john@example.com
[CONFIRM] Email confirmed successfully
✅ Login successful! User role: CLIENT_USER
```

## Email Confirmation Flow

### Only Available in Mode 3 (Real Cognito)

**Why?**
- Mode 1 (Basic Auth): No user registration
- Mode 2 (Mock Cognito): Auto-confirms users for dev convenience
- Mode 3 (Real Cognito): Requires email verification for security

### Flow Diagram

```
Registration (Real Cognito)
    ↓
User fills form
    ↓
Submit → cognito.signUp()
    ↓
Cognito creates UNCONFIRMED user
    ↓
Redirect to /auth/confirm
    ↓
User receives email with code
    ↓
User enters code
    ↓
cognito.confirmSignUp()
    ↓
Cognito confirms user
    ↓
Auto sign-in
    ↓
Dashboard
```

### Skipped in Mock Mode

```
Registration (Mock Cognito)
    ↓
User fills form
    ↓
Submit → cognito.signUp()
    ↓
Mock Cognito creates CONFIRMED user
    ↓
Auto sign-in (no confirmation needed)
    ↓
Dashboard
```

## Switching Between Modes

### From Basic Auth to Mock Cognito

```bash
# 1. Update .env.local
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true

# 2. Restart dev server
npm run dev

# 3. Clear browser localStorage (optional)
# 4. Use pre-seeded test users or register new ones
```

### From Mock Cognito to Real Cognito

```bash
# 1. Update .env.local
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id

# 2. Update backend application.properties
AWS_ENABLED=true
app.auth.basic.enabled=false

# 3. Restart both frontend and backend
# 4. Register new users (will require email confirmation)
```

### From Real Cognito to Basic Auth

```bash
# 1. Update .env.local
NEXT_PUBLIC_USE_COGNITO=false
NEXT_PUBLIC_USE_MOCK_AUTH=false

# 2. Update backend application.properties
AWS_ENABLED=false
app.auth.basic.enabled=true
LOCAL_BASIC_AUTH_ROLE=ADMIN

# 3. Restart both frontend and backend
# 4. No login needed, direct API access
```

## Troubleshooting

### Issue: "AuthUserPool not configured"

**Cause:** RealCognitoService is being called but AWS Cognito not configured

**Solution:**
```bash
# Option 1: Use Mock Cognito
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true

# Option 2: Use Basic Auth
NEXT_PUBLIC_USE_COGNITO=false

# Option 3: Configure Real Cognito
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
```

### Issue: Email confirmation page shows in Mock mode

**Cause:** Mock Cognito not properly configured

**Solution:**
```bash
# Verify .env.local
NEXT_PUBLIC_USE_MOCK_AUTH=true

# Restart dev server
npm run dev

# Check console for warning
# Should see: "⚠️ MOCK AUTHENTICATION ACTIVE"
```

### Issue: 401 Unauthorized in Basic Auth mode

**Cause:** Basic Auth header not being sent

**Solution:**
1. Verify `NEXT_PUBLIC_USE_COGNITO=false`
2. Verify `NEXT_PUBLIC_BASIC_USER` and `NEXT_PUBLIC_BASIC_PASS` are set
3. Restart dev server
4. Check Network tab for `Authorization: Basic` header

## Recommendations

### Development
- **Start with Basic Auth** for API testing
- **Switch to Mock Cognito** for UI development
- **Use Real Cognito** only when testing AWS integration

### Staging
- **Use Real Cognito** to test production-like environment
- Configure AWS SES for email sending
- Test email confirmation flow

### Production
- **Use Real Cognito** only
- Disable Basic Auth in backend
- Enable all security features (MFA, password policies, etc.)

## Related Documentation

- [Email Confirmation Flow](./EMAIL_CONFIRMATION.md)
- [Mock Auth Setup](./MOCK_AUTH_SETUP.md)
- [Basic Auth Implementation](./BASIC_AUTH_IMPLEMENTATION_COMPLETE.md)
- [Cognito Setup Guide](./COGNITO_SETUP_GUIDE.md)

## Quick Reference

```bash
# Basic Auth (API testing)
NEXT_PUBLIC_USE_COGNITO=false
NEXT_PUBLIC_USE_MOCK_AUTH=false

# Mock Cognito (Development)
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true

# Real Cognito (Production)
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

---

**Current Mode:** Check `.env.local` file
**Console Warning:** Look for "MOCK AUTHENTICATION ACTIVE" or "BASIC AUTH MODE"
**Email Confirmation:** Only in Real Cognito mode
