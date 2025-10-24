# Requirements Document

## Introduction

Hiện tại khi user đăng ký tài khoản qua AWS Cognito, họ nhận được lỗi "User is not confirmed" khi cố gắng đăng nhập. Điều này xảy ra vì Cognito yêu cầu xác thực email/phone trước khi cho phép đăng nhập. Tính năng này sẽ xây dựng một flow hoàn chỉnh để xử lý email confirmation, bao gồm:

1. Hiển thị UI nhập mã xác thực sau khi đăng ký
2. Gửi lại mã xác thực nếu user không nhận được
3. Xử lý các lỗi liên quan đến confirmation
4. Tự động đăng nhập sau khi xác thực thành công
5. Hỗ trợ cả Mock Cognito (dev) và Real Cognito (production)

## Requirements

### Requirement 1: Email Confirmation UI After Registration

**User Story:** As a new user, I want to see a confirmation code input screen immediately after registration, so that I can verify my email and complete the signup process.

#### Acceptance Criteria

1. WHEN user completes registration form and submits THEN system SHALL display email confirmation screen instead of redirecting to dashboard
2. WHEN confirmation screen is displayed THEN system SHALL show user's email address and instructions to check their inbox
3. WHEN confirmation screen is displayed THEN system SHALL provide a 6-digit code input field
4. WHEN confirmation screen is displayed THEN system SHALL show a "Resend Code" button
5. IF user is in Mock Cognito mode THEN system SHALL auto-confirm and skip confirmation screen
6. IF user is in Real Cognito mode THEN system SHALL require email confirmation

### Requirement 2: Confirmation Code Submission

**User Story:** As a new user, I want to enter my confirmation code and have it validated, so that I can activate my account and start using the platform.

#### Acceptance Criteria

1. WHEN user enters 6-digit confirmation code THEN system SHALL validate the code format before submission
2. WHEN user submits valid confirmation code THEN system SHALL call Cognito confirmSignUp API
3. IF confirmation is successful THEN system SHALL automatically sign in the user
4. IF confirmation is successful THEN system SHALL redirect user to appropriate dashboard based on role
5. IF confirmation fails THEN system SHALL display error message with specific reason
6. WHEN confirmation is in progress THEN system SHALL show loading state and disable submit button
7. IF code is invalid or expired THEN system SHALL show error message "Invalid or expired code. Please request a new one."

### Requirement 3: Resend Confirmation Code

**User Story:** As a new user, I want to request a new confirmation code if I didn't receive the original one, so that I can complete my registration without being blocked.

#### Acceptance Criteria

1. WHEN user clicks "Resend Code" button THEN system SHALL call Cognito resendConfirmationCode API
2. WHEN resend is successful THEN system SHALL display success message "New code sent to your email"
3. WHEN resend is successful THEN system SHALL implement 60-second cooldown before allowing another resend
4. WHEN cooldown is active THEN system SHALL display countdown timer on the button
5. IF resend fails THEN system SHALL display error message with specific reason
6. WHEN resend is in progress THEN system SHALL show loading state on button

### Requirement 4: Handle "User Not Confirmed" Error on Login

**User Story:** As a user who registered but didn't confirm their email, I want to be redirected to the confirmation screen when I try to login, so that I can complete the verification process.

#### Acceptance Criteria

1. WHEN user attempts to login THEN system SHALL catch "UserNotConfirmedException" error
2. IF "UserNotConfirmedException" is caught THEN system SHALL redirect user to confirmation screen
3. WHEN redirected to confirmation screen THEN system SHALL pre-fill the email address
4. WHEN redirected to confirmation screen THEN system SHALL display message "Please confirm your email to continue"
5. IF user is in Mock Cognito mode THEN system SHALL not show this error (auto-confirmed)

### Requirement 5: Mock Cognito Auto-Confirmation

**User Story:** As a developer, I want Mock Cognito to auto-confirm users without requiring email verification, so that I can test the application without email infrastructure.

#### Acceptance Criteria

1. WHEN user registers in Mock Cognito mode THEN system SHALL automatically mark user as confirmed
2. WHEN user registers in Mock Cognito mode THEN system SHALL skip confirmation screen
3. WHEN user registers in Mock Cognito mode THEN system SHALL proceed directly to auto sign-in
4. IF Mock Cognito mode is enabled THEN confirmSignUp method SHALL always return success
5. IF Mock Cognito mode is enabled THEN resendConfirmationCode method SHALL return success without sending email

### Requirement 6: Confirmation State Management

**User Story:** As a user, I want my confirmation state to be properly managed, so that I don't lose my progress if I refresh the page or navigate away.

#### Acceptance Criteria

1. WHEN user is on confirmation screen THEN system SHALL store pending confirmation email in sessionStorage
2. IF user refreshes confirmation page THEN system SHALL restore email from sessionStorage
3. IF user navigates away from confirmation page THEN system SHALL clear confirmation state
4. WHEN confirmation is successful THEN system SHALL clear all confirmation-related session data
5. IF user closes browser before confirming THEN system SHALL allow them to complete confirmation on next login attempt

### Requirement 7: Error Handling and User Feedback

**User Story:** As a user, I want clear error messages and guidance when something goes wrong during confirmation, so that I know how to resolve the issue.

#### Acceptance Criteria

1. IF confirmation code is incorrect THEN system SHALL display "Invalid confirmation code. Please check and try again."
2. IF confirmation code is expired THEN system SHALL display "Confirmation code expired. Please request a new one."
3. IF network error occurs THEN system SHALL display "Network error. Please check your connection and try again."
4. IF user is already confirmed THEN system SHALL display "Account already confirmed" and redirect to login
5. IF too many failed attempts THEN system SHALL display "Too many attempts. Please request a new code."
6. WHEN any error occurs THEN system SHALL log error details to console for debugging
7. WHEN any error occurs THEN system SHALL keep user on confirmation screen to retry

### Requirement 8: Accessibility and UX

**User Story:** As a user, I want the confirmation flow to be intuitive and accessible, so that I can complete it easily regardless of my technical skill level.

#### Acceptance Criteria

1. WHEN confirmation screen is displayed THEN system SHALL use clear, simple language in all instructions
2. WHEN code input field is displayed THEN system SHALL auto-focus on the input field
3. WHEN user enters 6 digits THEN system SHALL auto-submit the form
4. WHEN user pastes code from email THEN system SHALL accept and auto-submit
5. IF user is on mobile device THEN system SHALL show numeric keyboard for code input
6. WHEN loading states are active THEN system SHALL show appropriate loading indicators
7. WHEN success occurs THEN system SHALL show success message before redirecting
