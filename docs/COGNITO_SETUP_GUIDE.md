# AWS Cognito Setup Guide

Complete guide to set up AWS Cognito for Easy Body authentication.

---

## 📋 Prerequisites

- AWS Account
- AWS CLI installed (optional)
- Access to AWS Console

---

## 🚀 Step 1: Create Cognito User Pool

### Via AWS Console

1. **Go to AWS Cognito Console**
   - Navigate to https://console.aws.amazon.com/cognito
   - Select your region (e.g., `us-east-1`)

2. **Create User Pool**
   - Click "Create user pool"
   - Choose "Email" as sign-in option
   - Click "Next"

3. **Configure Security Requirements**
   - Password policy:
     - Minimum length: 8
     - Require lowercase: Yes
     - Require uppercase: Yes
     - Require numbers: Yes
     - Require special characters: No (optional)
   - Multi-factor authentication: Optional (recommended for production)
   - Click "Next"

4. **Configure Sign-up Experience**
   - Self-service sign-up: Enable
   - Attribute verification: Email
   - Required attributes:
     - ✅ email
     - ✅ given_name (First Name)
     - ✅ family_name (Last Name)
     - ⬜ phone_number (Optional)
   - Custom attributes:
     - Add custom attribute: `role` (String, Mutable)
   - Click "Next"

5. **Configure Message Delivery**
   - Email provider: Cognito (for testing) or SES (for production)
   - FROM email address: no-reply@verificationemail.com (default)
   - Click "Next"

6. **Integrate Your App**
   - User pool name: `easybody-users`
   - App client name: `easybody-web-client`
   - Client secret: Don't generate (for web apps)
   - Authentication flows:
     - ✅ ALLOW_USER_PASSWORD_AUTH
     - ✅ ALLOW_REFRESH_TOKEN_AUTH
     - ✅ ALLOW_USER_SRP_AUTH
   - Click "Next"

7. **Review and Create**
   - Review all settings
   - Click "Create user pool"

---

## 🔑 Step 2: Get Credentials

After creating the user pool:

1. **User Pool ID**
   - Go to your user pool
   - Copy the "User pool ID" (e.g., `us-east-1_XXXXXXXXX`)

2. **App Client ID**
   - Go to "App integration" tab
   - Under "App clients", click your client
   - Copy the "Client ID"

3. **Region**
   - Note your AWS region (e.g., `us-east-1`)

---

## ⚙️ Step 3: Configure Frontend

### Update `.env.local`

```env
# AWS Cognito Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id-here
NEXT_PUBLIC_COGNITO_REGION=us-east-1

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

### Verify Configuration

```bash
# Check if environment variables are loaded
npm run dev

# Open browser console and check
console.log(process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID)
```

---

## 🔧 Step 4: Configure Backend

### Update Backend `.env` or `application.properties`

```properties
# AWS Cognito Configuration
aws.cognito.region=us-east-1
aws.cognito.userPoolId=us-east-1_XXXXXXXXX
aws.cognito.clientId=your-client-id-here
aws.cognito.jwksUrl=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXXXXXXX/.well-known/jwks.json

# Enable AWS
aws.enabled=true
```

### JWKS URL Format
```
https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
```

---

## 🧪 Step 5: Test Authentication

### Test Sign Up

```typescript
import { cognito } from '@/lib/cognito';

const result = await cognito.signUp(
  'test@example.com',
  'Password123',
  {
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+1234567890',
    role: 'CLIENT_USER'
  }
);

console.log('Sign up result:', result);
```

### Test Confirmation

```typescript
// Check email for verification code
const result = await cognito.confirmSignUp(
  'test@example.com',
  '123456' // Code from email
);

console.log('Confirmation result:', result);
```

### Test Sign In

```typescript
const result = await cognito.signIn(
  'test@example.com',
  'Password123'
);

if (result.success) {
  console.log('Access Token:', result.data.tokens.accessToken);
  console.log('User:', result.data.user);
}
```

### Test API Call with Token

```typescript
import { api } from '@/lib/api';

// Token is automatically added by API client
const response = await api.auth.me();
console.log('Current user:', response.data);
```

---

## 🔐 Authentication Flow

### Complete Flow Diagram

```
1. User Registration
   ↓
   Frontend: cognito.signUp()
   ↓
   Cognito: Create user (UNCONFIRMED status)
   ↓
   Cognito: Send verification email
   ↓
   User: Enter verification code
   ↓
   Frontend: cognito.confirmSignUp()
   ↓
   Cognito: Confirm user (CONFIRMED status)

2. User Login
   ↓
   Frontend: cognito.signIn()
   ↓
   Cognito: Validate credentials
   ↓
   Cognito: Return JWT tokens (access, id, refresh)
   ↓
   Frontend: Store tokens in memory
   ↓
   Frontend: Call backend API with token
   ↓
   Backend: Validate JWT signature
   ↓
   Backend: Extract user info from token
   ↓
   Backend: Create/update user in database
   ↓
   Backend: Return user data
```

---

## 🎯 Token Structure

### Access Token (for API calls)
```json
{
  "sub": "user-uuid",
  "cognito:groups": [],
  "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXXXXXXX",
  "client_id": "your-client-id",
  "origin_jti": "...",
  "event_id": "...",
  "token_use": "access",
  "scope": "aws.cognito.signin.user.admin",
  "auth_time": 1234567890,
  "exp": 1234571490,
  "iat": 1234567890,
  "jti": "...",
  "username": "user-uuid"
}
```

### ID Token (contains user attributes)
```json
{
  "sub": "user-uuid",
  "email_verified": true,
  "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXXXXXXX",
  "cognito:username": "user-uuid",
  "given_name": "John",
  "family_name": "Doe",
  "aud": "your-client-id",
  "event_id": "...",
  "token_use": "id",
  "auth_time": 1234567890,
  "custom:role": "CLIENT_USER",
  "exp": 1234571490,
  "iat": 1234567890,
  "email": "test@example.com"
}
```

---

## 🛠️ Troubleshooting

### Issue: "User pool does not exist"
**Solution:** Check User Pool ID is correct and region matches

### Issue: "Invalid client id"
**Solution:** Verify Client ID from Cognito console

### Issue: "User is not confirmed"
**Solution:** User must verify email before signing in

### Issue: "Password does not meet requirements"
**Solution:** Ensure password has:
- At least 8 characters
- Uppercase letter
- Lowercase letter
- Number

### Issue: "Token expired"
**Solution:** Implement token refresh:
```typescript
const session = await cognito.getCurrentSession();
// Amplify automatically refreshes tokens
```

### Issue: "CORS error"
**Solution:** Backend must allow frontend origin in CORS config

---

## 📱 Testing with Postman

### 1. Sign Up via Cognito Hosted UI
```
https://{your-domain}.auth.{region}.amazoncognito.com/login?client_id={client-id}&response_type=token&scope=email+openid+phone&redirect_uri={redirect-uri}
```

### 2. Get Token from URL
After login, token will be in URL:
```
https://your-app.com/#access_token=eyJraWQ...&id_token=eyJraWQ...
```

### 3. Use Token in Postman
```
Authorization: Bearer eyJraWQ...
```

---

## 🔒 Security Best Practices

### Production Checklist
- [ ] Enable MFA for admin users
- [ ] Use SES for email delivery
- [ ] Set up custom domain for Hosted UI
- [ ] Enable advanced security features
- [ ] Set up CloudWatch logging
- [ ] Implement rate limiting
- [ ] Use HTTPS only
- [ ] Rotate secrets regularly
- [ ] Monitor failed login attempts
- [ ] Set up account recovery

### Token Management
- ✅ Store tokens in memory (not localStorage)
- ✅ Use httpOnly cookies for refresh tokens
- ✅ Implement automatic token refresh
- ✅ Clear tokens on logout
- ✅ Validate tokens on backend
- ✅ Use short expiration times (1 hour)

---

## 📚 Resources

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Amplify Auth Documentation](https://docs.amplify.aws/lib/auth/getting-started/)
- [JWT.io](https://jwt.io/) - Decode and verify JWT tokens
- [Cognito Pricing](https://aws.amazon.com/cognito/pricing/)

---

## 🎉 Success!

If you can:
1. ✅ Sign up a new user
2. ✅ Receive verification email
3. ✅ Confirm email with code
4. ✅ Sign in successfully
5. ✅ Get JWT tokens
6. ✅ Call backend API with token
7. ✅ Backend validates token

**You're all set!** 🚀

---

**Next Steps:**
- [Test Authentication Flow](./QUICK_START.md)
- [API Integration](./api/FRONTEND_API_INTEGRATION.md)
- [Deploy to Production](./deployment/RAILWAY_DEPLOY.md)
