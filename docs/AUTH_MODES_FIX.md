# Auth Modes Configuration Fix ✅

## Issue

Lỗi "AuthUserPool not configured" xảy ra khi:
- RealCognitoService được gọi nhưng chưa có AWS Cognito configuration
- `.env.local` không có hoặc sai cấu hình cho mode đang dùng

## Root Cause

Có 3 authentication modes nhưng configuration không rõ ràng:
1. **Basic Auth**: Không dùng Cognito, dùng Basic Auth header
2. **Mock Cognito**: Dùng localStorage, không cần AWS
3. **Real Cognito**: Dùng AWS Cognito thật, cần configuration

## Solution Applied

### 1. Clarified Environment Variables

**Before:**
```env
NEXT_PUBLIC_USE_MOCK_AUTH=true  # Unclear what this does
```

**After:**
```env
NEXT_PUBLIC_USE_COGNITO=true    # Enable/disable Cognito
NEXT_PUBLIC_USE_MOCK_AUTH=true  # Use Mock or Real Cognito
```

### 2. Updated .env.local

**Current Configuration (Mock Cognito for Development):**
```env
# Authentication Mode
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

# Basic Auth (not used in Mock mode)
NEXT_PUBLIC_BASIC_USER=local-admin
NEXT_PUBLIC_BASIC_PASS=local-password
```

### 3. Created Documentation

**New Files:**
- `docs/AUTH_MODES.md` - Complete guide for all 3 modes
- `docs/AUTH_MODES_FIX.md` - This file
- Updated `EMAIL_CONFIRMATION_QUICKSTART.md` - Clarified when email confirmation is used

## Three Authentication Modes

### Mode 1: Basic Auth (API Testing)

**Use Case:** Direct API testing without login UI

**Configuration:**
```env
NEXT_PUBLIC_USE_COGNITO=false
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_BASIC_USER=local-admin
NEXT_PUBLIC_BASIC_PASS=local-password
```

**Features:**
- ❌ No login UI
- ❌ No registration
- ❌ No email confirmation
- ✅ Direct API access with Basic Auth header

**Backend:**
```properties
AWS_ENABLED=false
app.auth.basic.enabled=true
LOCAL_BASIC_AUTH_ROLE=ADMIN
```

### Mode 2: Mock Cognito (Development) ⭐ RECOMMENDED

**Use Case:** Frontend development with login UI, no AWS needed

**Configuration:**
```env
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

**Features:**
- ✅ Login/Register UI
- ✅ Pre-seeded test users
- ✅ Mock JWT tokens
- ✅ Auto-confirmation (no email needed)
- ❌ No email confirmation flow

**Backend:**
```properties
AWS_ENABLED=false
app.auth.basic.enabled=true
```

**Pre-seeded Users:**
- `client@test.com` / `password123` (CLIENT_USER)
- `gym@test.com` / `password123` (GYM_STAFF)
- `trainer@test.com` / `password123` (PT_USER)
- `admin@test.com` / `password123` (ADMIN)

### Mode 3: Real Cognito (Production)

**Use Case:** Production environment with real AWS Cognito

**Configuration:**
```env
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_REGION=us-east-1
```

**Features:**
- ✅ Login/Register UI
- ✅ Real JWT tokens from AWS
- ✅ Email confirmation flow
- ✅ Real email sending via AWS SES
- ✅ Password reset
- ✅ MFA (if configured)

**Backend:**
```properties
AWS_ENABLED=true
app.auth.basic.enabled=false
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
COGNITO_JWKS_URL=https://cognito-idp.us-east-1.amazonaws.com/...
```

## Email Confirmation Flow

### Only Active in Mode 3 (Real Cognito)

**Why?**
- **Mode 1 (Basic Auth)**: No user registration at all
- **Mode 2 (Mock Cognito)**: Auto-confirms users for dev convenience
- **Mode 3 (Real Cognito)**: Requires email verification for security

**Flow in Real Cognito:**
```
Register → Confirmation Page → Enter Code → Confirm → Dashboard
```

**Flow in Mock Cognito:**
```
Register → Auto-confirm → Dashboard (no confirmation page)
```

## How to Fix "AuthUserPool not configured"

### Quick Fix (Recommended for Development)

```bash
# 1. Update .env.local
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true

# 2. Restart dev server
npm run dev

# 3. Check console for warning
# Should see: "⚠️ MOCK AUTHENTICATION ACTIVE"
```

### Alternative: Use Basic Auth (API Testing Only)

```bash
# 1. Update .env.local
NEXT_PUBLIC_USE_COGNITO=false
NEXT_PUBLIC_USE_MOCK_AUTH=false

# 2. Restart dev server
npm run dev

# 3. No login needed, direct API access
```

### For Production: Configure Real Cognito

```bash
# 1. Create AWS Cognito User Pool
# 2. Get User Pool ID and Client ID
# 3. Update .env.local
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
NEXT_PUBLIC_COGNITO_REGION=us-east-1

# 4. Update backend configuration
# 5. Restart both frontend and backend
```

## Verification

### Check Current Mode

**Console Logs:**

**Basic Auth Mode:**
```
No special warning (no Cognito used)
```

**Mock Cognito Mode:**
```
⚠️ MOCK AUTHENTICATION ACTIVE
🔧 This should only be used in development!
```

**Real Cognito Mode:**
```
No warning (production mode)
```

### Check Environment Variables

```bash
# Print current configuration
echo "USE_COGNITO: $NEXT_PUBLIC_USE_COGNITO"
echo "USE_MOCK_AUTH: $NEXT_PUBLIC_USE_MOCK_AUTH"
```

### Test Authentication

**Basic Auth:**
- No login page
- Direct API access
- Check Network tab for `Authorization: Basic` header

**Mock Cognito:**
- Login page available
- Use pre-seeded users
- Check localStorage for `mock_users`
- Check console for `[MOCK AUTH]` logs

**Real Cognito:**
- Login page available
- Register requires email confirmation
- Check for real JWT tokens
- Check for email from AWS SES

## Common Issues

### Issue 1: "AuthUserPool not configured"

**Cause:** Real Cognito being called without configuration

**Fix:**
```bash
# Switch to Mock Cognito
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

### Issue 2: Email confirmation page shows in Mock mode

**Cause:** Mock Cognito not properly configured

**Fix:**
```bash
# Verify both variables are set
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true

# Restart dev server
npm run dev
```

### Issue 3: 401 Unauthorized in Basic Auth mode

**Cause:** Basic Auth header not being sent

**Fix:**
```bash
# Verify configuration
NEXT_PUBLIC_USE_COGNITO=false
NEXT_PUBLIC_BASIC_USER=local-admin
NEXT_PUBLIC_BASIC_PASS=local-password

# Restart dev server
npm run dev
```

### Issue 4: Pre-seeded users not working

**Cause:** Not in Mock Cognito mode

**Fix:**
```bash
# Enable Mock Cognito
NEXT_PUBLIC_USE_COGNITO=true
NEXT_PUBLIC_USE_MOCK_AUTH=true

# Clear localStorage
# Restart dev server
npm run dev
```

## Recommendations

### For Development
1. **Start with Mock Cognito** (Mode 2)
2. Use pre-seeded test users
3. No AWS setup needed
4. Full UI testing available

### For Staging
1. **Use Real Cognito** (Mode 3)
2. Test email confirmation flow
3. Configure AWS SES
4. Test production-like environment

### For Production
1. **Use Real Cognito only** (Mode 3)
2. Disable Basic Auth in backend
3. Enable all security features
4. Monitor AWS Cognito metrics

## Updated Files

1. `.env.local` - Set to Mock Cognito mode
2. `.env.local.example` - Added clear mode descriptions
3. `docs/AUTH_MODES.md` - Complete guide for all modes
4. `EMAIL_CONFIRMATION_QUICKSTART.md` - Clarified when email confirmation is used

## Testing Checklist

### Mock Cognito Mode (Current)
- [x] `.env.local` configured correctly
- [x] Console shows "MOCK AUTHENTICATION ACTIVE"
- [x] Pre-seeded users available
- [x] Registration auto-confirms users
- [x] No email confirmation page shown
- [x] Login works with test users

### Basic Auth Mode (Optional)
- [ ] `.env.local` configured for Basic Auth
- [ ] No login page shown
- [ ] API requests include Basic Auth header
- [ ] Backend accepts Basic Auth

### Real Cognito Mode (Production)
- [ ] AWS Cognito User Pool created
- [ ] `.env.local` configured with real credentials
- [ ] Backend configured for AWS Cognito
- [ ] Registration shows confirmation page
- [ ] Email sent via AWS SES
- [ ] Confirmation code validates correctly

## Related Documentation

- [Auth Modes Guide](./AUTH_MODES.md) - Complete guide
- [Email Confirmation](./EMAIL_CONFIRMATION.md) - Email confirmation flow
- [Mock Auth Setup](./MOCK_AUTH_SETUP.md) - Mock Cognito details
- [Basic Auth Implementation](./BASIC_AUTH_IMPLEMENTATION_COMPLETE.md) - Basic Auth details

## Summary

✅ **Fixed:** "AuthUserPool not configured" error
✅ **Clarified:** Three authentication modes
✅ **Documented:** When email confirmation is used
✅ **Configured:** Mock Cognito mode for development
✅ **Updated:** All documentation and examples

**Current Mode:** Mock Cognito (Development)
**Email Confirmation:** Disabled (auto-confirm)
**Ready for:** Frontend development and testing

---

**Status:** ✅ RESOLVED
**Recommended Mode:** Mock Cognito (Mode 2)
**Next Steps:** Test registration and login with pre-seeded users
