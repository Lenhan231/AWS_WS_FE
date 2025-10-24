# Implementation Plan

## Context: Authentication Flow

The correct authentication flow is:
1. **Cognito SignUp** → Creates user with password in Cognito (or Mock Cognito localStorage)
2. **Cognito SignIn** → Validates credentials and returns JWT tokens
3. **Backend Register** → Uses JWT token to create user profile in database (no password needed)
4. **Backend /auth/me** → Retrieves user profile using JWT token

Mock Cognito must replicate this entire flow locally using localStorage.

- [x] 1. Create mock Cognito service with core authentication methods
  - Create `lib/mockCognito.ts` with MockCognitoService class implementing all authentication methods
  - Implement localStorage-based user storage with pre-seeded default users for all roles (CLIENT_USER, GYM_STAFF, PT_USER, ADMIN)
  - Implement signUp method with email validation, duplicate checking, and base64 password encoding
  - Implement signIn method with credential validation, session creation, and JWT token generation
  - SignIn must return user data AND tokens in the same format as real Cognito
  - Initialize default users on first access if localStorage is empty
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 4.1, 4.2, 4.3, 4.4, 4.5, 9.1, 9.2, 9.3_

- [x] 2. Implement mock JWT token generation and session management
  - Create generateMockTokens private method that produces realistic JWT structure (header.payload.signature)
  - Include all user claims in token payload (sub, email, given_name, family_name, phone_number, custom:role, iat, exp, iss)
  - Implement getCurrentUser method with localStorage retrieval and token expiration validation
  - Implement getCurrentSession method returning stored tokens from localStorage
  - Implement getAccessToken method for API client integration
  - Implement signOut method to clear mock_session and mock_current_user from localStorage
  - Store session data in localStorage with expiration timestamps (1 hour for access, 24 hours for refresh)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 3. Implement email verification and password reset flows
  - Implement confirmSignUp method accepting any 6-digit code (except "000000" for error testing)
  - Mark user as confirmed in mock_users localStorage array
  - Implement forgotPassword method that generates random 6-digit code and logs to console
  - Store reset codes in mock_reset_codes localStorage with 10-minute expiration
  - Implement forgotPasswordSubmit method with code validation, expiration check, and password update
  - Clear used reset codes after successful password reset
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 4. Refactor existing Cognito implementation into separate file
  - Create `lib/realCognito.ts` and move entire current AWS Amplify implementation from `lib/cognito.ts`
  - Keep Amplify.configure call and all imports in realCognito.ts
  - Ensure RealCognitoService class maintains exact same static method signatures as MockCognitoService
  - Verify all method return types match the interface (SignUpResult, SignInResult, etc.)
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 5. Create Cognito service factory with environment-based switching
  - Refactor `lib/cognito.ts` to act as factory that conditionally exports MockCognitoService or RealCognitoService
  - Add environment variable check: `process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true'`
  - Export cognito instance based on environment configuration
  - Add styled console warning when mock mode is active (orange background, white text)
  - Maintain backwards compatibility with existing imports (export as both `cognito` and `CognitoService`)
  - Ensure factory only runs warning on client-side (check `typeof window !== 'undefined'`)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 8.4, 8.5, 10.2_

- [x] 5.1 Fix authStore to use correct Cognito-first authentication flow
  - Update register method to call cognito.signUp → cognito.signIn → api.auth.register (with JWT)
  - Update login method to call cognito.signIn (instead of api.auth.login which doesn't exist)
  - Ensure JWT token from Cognito is stored before calling backend APIs
  - Add detailed console logging for each step of the authentication flow
  - Handle errors at each step appropriately
  - _Requirements: 8.4, 8.5_

- [x] 6. Add development mode UI indicators
  - Create `components/dev/MockAuthBanner.tsx` component with conditional rendering based on NEXT_PUBLIC_USE_MOCK_AUTH
  - Display orange warning banner with text "⚠️ DEVELOPMENT MODE: Mock Authentication Active"
  - Add banner to root layout (`app/layout.tsx`) above children
  - Implement console.table logging in MockCognitoService initialization showing available test credentials
  - Add styled console warnings with color formatting for all mock auth operations
  - Prefix all mock service console logs with "[MOCK AUTH]"
  - _Requirements: 10.1, 10.3, 10.4, 10.5, 9.4_

- [x] 7. Update environment configuration and documentation
  - Add NEXT_PUBLIC_USE_MOCK_AUTH to `.env.example` with comment explaining mock mode
  - Add documentation comment showing default test user credentials in .env.example
  - Create inline code comments in mockCognito.ts documenting the pre-seeded users
  - Update README or create docs/MOCK_AUTH_GUIDE.md with setup instructions
  - _Requirements: 1.1, 9.4_

- [ ]* 8. Create unit tests for mock Cognito service
  - Write tests for signUp flow (success, duplicate email, validation)
  - Write tests for signIn flow (success, invalid credentials, non-existent user)
  - Write tests for token generation (structure, claims, expiration)
  - Write tests for session management (persistence, expiration, retrieval)
  - Write tests for confirmSignUp (valid codes, invalid codes, error scenarios)
  - Write tests for password reset flow (code generation, validation, password update)
  - _Requirements: All requirements for validation_

- [ ]* 9. Create integration tests with authStore
  - Write tests for authStore login integration with mock service
  - Write tests for authStore registration integration with mock service
  - Write tests for session persistence across store rehydration
  - Write tests for logout clearing session properly
  - _Requirements: 8.4, 8.5_
