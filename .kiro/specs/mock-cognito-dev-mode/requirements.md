# Requirements Document

## Introduction

This feature implements a development mode for the authentication system that uses a mock/fake Cognito service instead of real AWS Cognito. This allows developers to work on the application without needing AWS credentials or dealing with 403 errors during local development. The mock service will simulate Cognito's behavior including sign up, sign in, token generation, and session management, while maintaining the same API interface as the real Cognito service.

## Requirements

### Requirement 1: Development Mode Configuration

**User Story:** As a developer, I want to enable/disable mock authentication mode via environment variable, so that I can easily switch between real and mock Cognito without code changes.

#### Acceptance Criteria

1. WHEN the environment variable `NEXT_PUBLIC_USE_MOCK_AUTH` is set to "true" THEN the system SHALL use the mock Cognito service
2. WHEN the environment variable `NEXT_PUBLIC_USE_MOCK_AUTH` is not set or set to "false" THEN the system SHALL use the real AWS Cognito service
3. WHEN switching between modes THEN the system SHALL maintain the same API interface for all authentication methods
4. WHEN in mock mode THEN the system SHALL log a clear warning message to the console indicating mock authentication is active

### Requirement 2: Mock User Registration

**User Story:** As a developer, I want to register mock users locally, so that I can test registration flows without AWS Cognito.

#### Acceptance Criteria

1. WHEN a user calls signUp with valid credentials THEN the mock service SHALL store the user data in localStorage
2. WHEN a user calls signUp with an email that already exists THEN the mock service SHALL return an error "User already exists"
3. WHEN a user calls signUp THEN the mock service SHALL return a success response with a mock user ID
4. WHEN a user is registered THEN the mock service SHALL store the password securely (hashed or encoded)
5. WHEN a user is registered THEN the mock service SHALL store all user attributes (email, firstName, lastName, phoneNumber, role)

### Requirement 3: Mock Email Verification

**User Story:** As a developer, I want to simulate email verification, so that I can test confirmation flows without sending real emails.

#### Acceptance Criteria

1. WHEN confirmSignUp is called with any 6-digit code THEN the mock service SHALL accept it as valid
2. WHEN confirmSignUp is called for a non-existent user THEN the mock service SHALL return an error "User not found"
3. WHEN confirmSignUp succeeds THEN the mock service SHALL mark the user as confirmed in localStorage
4. WHEN a special code "000000" is used THEN the mock service SHALL simulate an invalid code error for testing error handling

### Requirement 4: Mock User Sign In

**User Story:** As a developer, I want to sign in with mock credentials, so that I can test authentication flows without AWS Cognito.

#### Acceptance Criteria

1. WHEN signIn is called with valid email and password THEN the mock service SHALL return a success response with mock tokens
2. WHEN signIn is called with invalid credentials THEN the mock service SHALL return an error "Invalid email or password"
3. WHEN signIn is called for a non-existent user THEN the mock service SHALL return an error "User not found"
4. WHEN signIn succeeds THEN the mock service SHALL generate mock JWT tokens (accessToken, idToken, refreshToken)
5. WHEN signIn succeeds THEN the mock service SHALL return user data matching the registered user

### Requirement 5: Mock Token Generation

**User Story:** As a developer, I want the mock service to generate realistic JWT tokens, so that the API client can use them without modification.

#### Acceptance Criteria

1. WHEN a user signs in THEN the mock service SHALL generate a mock JWT access token with user claims
2. WHEN a user signs in THEN the mock service SHALL generate a mock JWT ID token with user attributes
3. WHEN tokens are generated THEN they SHALL include standard JWT structure (header.payload.signature)
4. WHEN tokens are generated THEN the payload SHALL include user ID, email, role, and other custom attributes
5. WHEN getAccessToken is called THEN the mock service SHALL return the stored access token from localStorage

### Requirement 6: Mock Session Management

**User Story:** As a developer, I want mock sessions to persist across page refreshes, so that I don't have to re-authenticate constantly during development.

#### Acceptance Criteria

1. WHEN a user signs in THEN the mock service SHALL store the session in localStorage
2. WHEN getCurrentUser is called and a valid session exists THEN the mock service SHALL return the user data
3. WHEN getCurrentSession is called and a valid session exists THEN the mock service SHALL return the tokens
4. WHEN signOut is called THEN the mock service SHALL clear the session from localStorage
5. WHEN the page is refreshed and a valid session exists THEN the mock service SHALL restore the user session

### Requirement 7: Mock Password Reset

**User Story:** As a developer, I want to simulate password reset flows, so that I can test forgot password functionality without AWS Cognito.

#### Acceptance Criteria

1. WHEN forgotPassword is called with a valid email THEN the mock service SHALL return success and log a mock verification code to the console
2. WHEN forgotPassword is called with a non-existent email THEN the mock service SHALL return an error "User not found"
3. WHEN forgotPasswordSubmit is called with the correct code THEN the mock service SHALL update the user's password in localStorage
4. WHEN forgotPasswordSubmit is called with an incorrect code THEN the mock service SHALL return an error "Invalid verification code"
5. WHEN the password is reset THEN the mock service SHALL store the new password securely

### Requirement 8: Mock Service Interface Compatibility

**User Story:** As a developer, I want the mock service to have the exact same interface as the real Cognito service, so that no code changes are needed when switching modes.

#### Acceptance Criteria

1. WHEN the mock service is used THEN it SHALL implement all methods from CognitoService class
2. WHEN any method is called THEN the mock service SHALL return responses in the same format as the real service
3. WHEN errors occur THEN the mock service SHALL return error objects matching the real Cognito error format
4. WHEN the mock service is active THEN the existing authStore SHALL work without modifications
5. WHEN the mock service is active THEN the API client SHALL receive valid tokens for authorization headers

### Requirement 9: Pre-seeded Mock Users

**User Story:** As a developer, I want pre-configured mock users for different roles, so that I can quickly test role-based features without manual registration.

#### Acceptance Criteria

1. WHEN the mock service initializes THEN it SHALL create default users for each role (CLIENT_USER, GYM_OWNER, PT_USER, ADMIN)
2. WHEN default users are created THEN they SHALL have predictable credentials (e.g., admin@test.com / password123)
3. WHEN a developer signs in with default credentials THEN the mock service SHALL authenticate successfully
4. WHEN the application starts in mock mode THEN the console SHALL log the available test user credentials
5. WHEN localStorage is cleared THEN the mock service SHALL re-seed default users on next initialization

### Requirement 10: Development Mode Indicators

**User Story:** As a developer, I want clear visual indicators when mock authentication is active, so that I don't confuse mock data with production data.

#### Acceptance Criteria

1. WHEN mock mode is active THEN the system SHALL display a visible banner or indicator in the UI
2. WHEN mock mode is active THEN all console logs related to authentication SHALL be prefixed with "[MOCK AUTH]"
3. WHEN a user signs in with mock credentials THEN the console SHALL log the generated mock tokens for debugging
4. WHEN mock mode is active THEN the browser console SHALL show a warning on application load
5. WHEN mock mode is disabled THEN no mock-related indicators SHALL be displayed
