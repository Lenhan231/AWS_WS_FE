# Authentication Flow Fix

## Problem Identified

The previous authentication flow was incorrect and would fail with 401 errors from the backend.

### Old (Incorrect) Flow

```
Frontend → api.auth.register() → Backend (401 ❌)
Frontend → api.auth.login() → Backend (401 ❌)
```

**Issue:** Backend requires JWT token for ALL `/api/v1/auth/*` endpoints (including register), but we can't get a JWT without authenticating first. This is a chicken-and-egg problem.

## Solution

### Correct Authentication Flow

The backend uses **Cognito for authentication** and only stores user profiles. The correct flow is:

#### Registration Flow
```
1. Frontend → Cognito SignUp (email + password)
   ↓ Creates user in Cognito
   
2. Frontend → Cognito SignIn (email + password)
   ↓ Returns JWT tokens
   
3. Frontend → Backend /auth/register (with JWT in header)
   ↓ Creates user profile in database
   
✅ User registered and authenticated
```

#### Login Flow
```
1. Frontend → Cognito SignIn (email + password)
   ↓ Returns JWT tokens + user data
   
2. Store JWT token in localStorage/cookie
   
3. All subsequent API calls include JWT in Authorization header
   
✅ User authenticated
```

## Changes Made

### 1. Fixed `store/authStore.ts`

#### Register Method
```typescript
register: async (userData: any) => {
  // Step 1: Sign up with Cognito (creates user with password)
  const signUpResult = await cognito.signUp(email, password, userData);
  
  // Step 2: Auto sign-in to get JWT token
  const signInResult = await cognito.signIn(email, password);
  const { user, tokens } = signInResult.data;
  
  // Step 3: Register profile in backend (with JWT token)
  localStorage.setItem('auth_token', tokens.idToken);
  await api.auth.register({ email, firstName, lastName, role });
  
  // Success!
  setUser(user);
}
```

#### Login Method
```typescript
login: async (email: string, password: string) => {
  // Sign in with Cognito to get JWT token
  const signInResult = await cognito.signIn(email, password);
  const { user, tokens } = signInResult.data;
  
  // Save token for API calls
  localStorage.setItem('auth_token', tokens.idToken);
  
  // Success!
  setUser(user);
}
```

### 2. Updated `types/index.ts`

Made `password` optional in `RegisterData` since it's not sent to backend:

```typescript
export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password?: string; // Optional: only for Cognito, not backend
  phoneNumber?: string;
  role: UserRole;
  profileImageUrl?: string;
}
```

### 3. Updated Task List

Added new task 5.1 to document the authStore fixes and added context about the authentication flow at the top of the task list.

## Backend Authentication

The backend uses Spring Security with two authentication methods:

### Production: JWT (Cognito)
```
Authorization: Bearer <jwt_token>
```
- JWT contains `sub` (user ID) and `custom:role`
- Backend validates JWT with Cognito
- Used for all production environments

### Development: Basic Auth (Optional)
```
Authorization: Basic <base64(username:password)>
```
- Enabled with `app.auth.basic.enabled=true` in `application-local.yml`
- Default credentials: `local-admin:local-password`
- Only for local testing without Cognito

## Mock Cognito Requirements

The Mock Cognito service must:

1. **Store users with passwords** in localStorage (replaces Cognito user pool)
2. **Generate realistic JWT tokens** that backend can accept
3. **Return same data structure** as real Cognito:
   ```typescript
   {
     success: true,
     data: {
       user: User,
       tokens: {
         accessToken: string,
         idToken: string,
         refreshToken: string
       }
     }
   }
   ```
4. **Maintain session** across page refreshes
5. **Support all Cognito methods**: signUp, signIn, signOut, getCurrentUser, etc.

## Testing

### With Mock Cognito (Development)
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

1. Register new user → stored in localStorage
2. Auto sign-in → generates mock JWT
3. Backend register → uses mock JWT
4. All API calls → include mock JWT

### With Real Cognito (Production)
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
```

1. Register new user → creates in AWS Cognito
2. Auto sign-in → gets real JWT from Cognito
3. Backend register → uses real JWT
4. All API calls → include real JWT

## Benefits

✅ **No 401 errors** - JWT token is obtained before calling backend  
✅ **Consistent flow** - Same flow for mock and real Cognito  
✅ **Secure** - Password only sent to Cognito, never to backend  
✅ **Maintainable** - Clear separation of concerns  
✅ **Testable** - Can switch between mock and real easily  

## Next Steps

1. Implement Mock Cognito service (`lib/mockCognito.ts`)
2. Refactor real Cognito to separate file (`lib/realCognito.ts`)
3. Create factory pattern (`lib/cognito.ts`)
4. Test registration and login flows
5. Add development mode indicators
