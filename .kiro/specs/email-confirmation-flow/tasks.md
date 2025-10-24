# Implementation Plan

- [x] 1. Add resendConfirmationCode method to Cognito services
  - Add resendConfirmationCode to RealCognitoService using AWS Amplify's resendSignUpCode
  - Add resendConfirmationCode to MockCognitoService that logs code to console
  - Update cognito service interface types to include ResendCodeResult
  - _Requirements: 1.3, 1.5_

- [x] 2. Create email confirmation page component
  - [x] 2.1 Create /app/auth/confirm/page.tsx with basic structure
    - Create page component with email and code state management
    - Add URL search params handling to pre-fill email
    - Implement sessionStorage fallback for email retrieval
    - _Requirements: 1.1, 1.6_

  - [x] 2.2 Implement code input UI with auto-submit
    - Create 6-digit code input field with numeric keyboard on mobile
    - Add auto-focus on code input field
    - Implement auto-submit when 6 digits are entered
    - Add paste support for confirmation codes
    - _Requirements: 1.3, 1.8_

  - [x] 2.3 Implement confirmation submission logic
    - Add handleConfirm function that calls cognito.confirmSignUp
    - Implement loading state during confirmation
    - Add error handling with specific error messages
    - Implement auto sign-in after successful confirmation
    - Add backend registration call after sign-in
    - Implement role-based redirect after confirmation
    - _Requirements: 1.2, 1.7_

  - [x] 2.4 Implement resend code functionality
    - Add handleResendCode function that calls cognito.resendConfirmationCode
    - Implement 60-second cooldown timer
    - Add countdown display on resend button
    - Show success message when code is resent
    - _Requirements: 1.3_

  - [x] 2.5 Add UI styling and animations
    - Style confirmation page to match registration/login pages
    - Add loading spinners for async operations
    - Add success animation and message
    - Add error message styling with icons
    - Implement responsive design for mobile
    - _Requirements: 1.8_

- [x] 3. Update authStore registration flow
  - [x] 3.1 Modify register method to handle confirmation requirement
    - Check signUpResult.nextStep for CONFIRM_SIGN_UP
    - Store pending confirmation email in sessionStorage
    - Return needsConfirmation flag instead of auto sign-in
    - Keep auto sign-in logic for Mock mode (no confirmation needed)
    - _Requirements: 1.1, 1.5, 1.6_

  - [x] 3.2 Update register method return type
    - Add AuthActionResult type with needsConfirmation and email fields
    - Update method signature to return Promise<AuthActionResult>
    - _Requirements: 1.1_

- [x] 4. Update authStore login flow
  - [x] 4.1 Modify login method to detect unconfirmed users
    - Catch "User is not confirmed" error from Cognito
    - Check signInResult.nextStep for CONFIRM_SIGN_UP
    - Store pending confirmation email in sessionStorage
    - Return needsConfirmation flag
    - _Requirements: 1.4_

  - [x] 4.2 Update login method return type
    - Update method signature to return Promise<AuthActionResult>
    - _Requirements: 1.4_

- [x] 5. Update registration page to handle confirmation redirect
  - Modify handleSubmit to check for needsConfirmation in result
  - Add redirect to /auth/confirm with email query param
  - Keep existing redirect logic for non-confirmation cases
  - _Requirements: 1.1_

- [x] 6. Update login page to handle confirmation redirect
  - Modify handleSubmit to check for needsConfirmation in result
  - Add redirect to /auth/confirm with email query param
  - Show appropriate error message for unconfirmed users
  - _Requirements: 1.4_

- [x] 7. Update Mock Cognito to auto-confirm users
  - [x] 7.1 Modify MockCognitoService.signUp to set confirmed: true by default
    - Change confirmed field to true in newUser object
    - Update nextStep to return DONE instead of CONFIRM_SIGN_UP
    - _Requirements: 1.5_

  - [x] 7.2 Update MockCognitoService.confirmSignUp to always succeed
    - Keep existing implementation (already works correctly)
    - _Requirements: 1.5_

- [x] 8. Add error message mapping utility
  - Create getErrorMessage helper function
  - Map Cognito error codes to user-friendly messages
  - Handle CodeMismatchException, ExpiredCodeException, LimitExceededException
  - Handle UserNotFoundException, NotAuthorizedException, UserNotConfirmedException
  - Add network error handling
  - _Requirements: 1.7_

- [x] 9. Add TypeScript types for confirmation flow
  - Add ResendCodeResult interface
  - Add AuthActionResult interface
  - Update CognitoService interface to include resendConfirmationCode
  - Export types from types/index.ts
  - _Requirements: 1.1, 1.3_

- [x] 10. Create documentation for confirmation flow
  - Document the confirmation flow in docs/EMAIL_CONFIRMATION.md
  - Add troubleshooting guide for common issues
  - Document Mock vs Real Cognito behavior differences
  - Add screenshots of confirmation page
  - _Requirements: 1.1, 1.5_
