# Email Confirmation Flow

## Overview

This document describes the email confirmation flow implemented for user registration with AWS Cognito. The flow handles the "User is not confirmed" error and provides a seamless experience for email verification.

## Flow Diagram

```
Registration → Sign Up → Confirmation Required? 
                              ↓ Yes              ↓ No
                    Confirmation Page      Auto Sign-in
                              ↓
                    Enter Code → Confirm
                              ↓
                    Auto Sign-in → Dashboard
```

## Components

### 1. Confirmation Page (`/auth/confirm`)

**Location:** `app/auth/confirm/page.tsx`

**Features:**
- 6-digit code input with auto-submit
- Auto-focus on code input field
- Resend code button with 60-second cooldown
- Error handling with user-friendly messages
- Success message before redirect
- Auto sign-in after successful confirmation
- Role-based redirect after confirmation

**URL Parameters:**
- `email` (optional): Pre-fills the email address

**Session Storage:**
- `pending_confirmation_email`: Stores email during confirmation
- `pending_confirmation_password`: Stores password for auto sign-in

### 2. Updated Registration Flow

**Location:** `store/authStore.ts` - `register` method

**Changes:**
1. Checks `signUpResult.nextStep.signUpStep` for `CONFIRM_SIGN_UP`
2. If confirmation needed:
   - Stores email and password in sessionStorage
   - Returns `{ needsConfirmation: true, email }`
3. If no confirmation needed (Mock mode):
   - Proceeds with auto sign-in
   - Registers with backend
   - Returns `{ needsConfirmation: false }`

**Location:** `app/auth/register/page.tsx` - `handleSubmit`

**Changes:**
1. Checks result for `needsConfirmation` flag
2. If true, redirects to `/auth/confirm?email=...`
3. If false, proceeds with normal role-based redirect

### 3. Updated Login Flow

**Location:** `store/authStore.ts` - `login` method

**Changes:**
1. Catches "User is not confirmed" error
2. Checks error message and `nextStep` for confirmation requirement
3. If unconfirmed:
   - Stores email and password in sessionStorage
   - Returns `{ needsConfirmation: true, email }`
4. If confirmed:
   - Proceeds with normal login
   - Returns `{ needsConfirmation: false }`

**Location:** `app/auth/login/page.tsx` - `handleSubmit`

**Changes:**
1. Checks result for `needsConfirmation` flag
2. If true, redirects to `/auth/confirm?email=...`
3. If false, proceeds with normal role-based redirect

### 4. Mock Cognito Auto-Confirmation

**Location:** `lib/mockCognito.ts` - `signUp` method

**Changes:**
1. Sets `confirmed: true` by default for new users
2. Returns `isSignUpComplete: true`
3. Returns `nextStep: { signUpStep: 'DONE' }`
4. Logs "User created and auto-confirmed" message

**Behavior:**
- Mock mode skips confirmation page entirely
- Users are immediately signed in after registration
- No email verification required in development

## User Flows

### Flow 1: New User Registration (Real Cognito)

1. User fills out registration form
2. User submits form
3. System calls `cognito.signUp()`
4. Cognito creates user with `UNCONFIRMED` status
5. System detects `nextStep.signUpStep === 'CONFIRM_SIGN_UP'`
6. System stores email and password in sessionStorage
7. System redirects to `/auth/confirm?email=...`
8. User enters 6-digit code from email
9. System calls `cognito.confirmSignUp()`
10. Cognito confirms user
11. System auto signs in user
12. System registers user profile in backend
13. System redirects to dashboard based on role

### Flow 2: New User Registration (Mock Cognito)

1. User fills out registration form
2. User submits form
3. System calls `cognito.signUp()`
4. Mock Cognito creates user with `confirmed: true`
5. System detects `nextStep.signUpStep === 'DONE'`
6. System proceeds with auto sign-in
7. System registers user profile in backend
8. System redirects to dashboard based on role

### Flow 3: Unconfirmed User Login

1. User enters email and password
2. User submits login form
3. System calls `cognito.signIn()`
4. Cognito returns "User is not confirmed" error
5. System detects unconfirmed status
6. System stores email and password in sessionStorage
7. System redirects to `/auth/confirm?email=...`
8. User enters 6-digit code from email
9. System calls `cognito.confirmSignUp()`
10. Cognito confirms user
11. System auto signs in user
12. System redirects to dashboard based on role

## Error Handling

### Error Messages

| Error Code | User-Friendly Message |
|------------|----------------------|
| `CodeMismatchException` | Invalid confirmation code. Please check and try again. |
| `ExpiredCodeException` | Confirmation code expired. Please request a new one. |
| `LimitExceededException` | Too many attempts. Please request a new code. |
| `UserNotFoundException` | User not found. Please register first. |
| `NotAuthorizedException` | Invalid email or password. |
| `NetworkError` | Network error. Please check your connection and try again. |

### Error Handling Logic

**Location:** `app/auth/confirm/page.tsx` - `getErrorMessage` function

```typescript
const getErrorMessage = (error: any): string => {
  const errorMessage = error?.message || error?.toString() || '';
  
  if (errorMessage.includes('CodeMismatch') || errorMessage.includes('Invalid')) {
    return 'Invalid confirmation code. Please check and try again.';
  }
  // ... more error checks
  
  return errorMessage || 'An error occurred. Please try again.';
};
```

## Resend Code Functionality

### Features
- 60-second cooldown between resend requests
- Countdown timer displayed on button
- Success message shows destination email
- Logs code to console in Mock mode

### Implementation

**Location:** `app/auth/confirm/page.tsx` - `handleResendCode` function

```typescript
const handleResendCode = async () => {
  const resendResult = await cognito.resendConfirmationCode(email);
  
  if (resendResult.success) {
    setSuccessMessage(`New code sent to ${resendResult.data?.destination}`);
    setResendCooldown(60); // Start 60-second cooldown
  }
};
```

### Cooldown Timer

**Location:** `app/auth/confirm/page.tsx` - `useEffect` hook

```typescript
useEffect(() => {
  if (resendCooldown > 0) {
    const timer = setTimeout(() => {
      setResendCooldown(resendCooldown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }
}, [resendCooldown]);
```

## Auto Sign-in After Confirmation

### Process

1. User confirms email with code
2. System retrieves password from sessionStorage
3. System calls `cognito.signIn(email, password)`
4. System stores JWT token in localStorage and cookie
5. System updates auth store with user data
6. System registers user profile in backend (if not already done)
7. System clears sessionStorage
8. System redirects to dashboard based on role

### Fallback

If password is not available in sessionStorage:
1. System shows success message
2. System redirects to login page after 2 seconds
3. User must manually log in

## Mock vs Real Cognito Behavior

| Feature | Mock Cognito | Real Cognito |
|---------|--------------|--------------|
| Auto-confirm on signup | ✅ Yes | ❌ No |
| Confirmation page shown | ❌ No | ✅ Yes |
| Email sent | ❌ No (logs to console) | ✅ Yes |
| Code validation | Any 6-digit code | Real validation |
| Resend code | Logs to console | Sends email |

## Testing

### Manual Testing Checklist

#### Real Cognito Mode

- [ ] Register new user with real email
- [ ] Verify redirect to confirmation page
- [ ] Receive confirmation email from Cognito
- [ ] Enter correct code and confirm
- [ ] Verify auto sign-in works
- [ ] Verify redirect to correct dashboard
- [ ] Test resend code functionality
- [ ] Test invalid code error
- [ ] Test expired code error
- [ ] Try to login before confirming
- [ ] Verify redirect to confirmation page

#### Mock Cognito Mode

- [ ] Register new user
- [ ] Verify auto-confirmation (skip confirmation page)
- [ ] Verify auto sign-in works
- [ ] Verify no confirmation email needed
- [ ] Verify redirect to correct dashboard
- [ ] Test that confirmSignUp accepts any 6-digit code
- [ ] Test resend code logs to console

### Test Credentials (Mock Mode)

Pre-seeded users (already confirmed):
- `client@test.com` / `password123` (CLIENT_USER)
- `gym@test.com` / `password123` (GYM_STAFF)
- `trainer@test.com` / `password123` (PT_USER)
- `admin@test.com` / `password123` (ADMIN)

## Troubleshooting

### Issue: User stuck on confirmation page

**Symptoms:**
- User enters code but nothing happens
- Error message not displayed

**Solutions:**
1. Check browser console for errors
2. Verify email is stored in sessionStorage
3. Check network tab for API calls
4. Try resending code
5. Clear sessionStorage and try again

### Issue: "User is not confirmed" error persists

**Symptoms:**
- User confirmed email but still gets error on login

**Solutions:**
1. Check Cognito User Pool console
2. Verify user status is `CONFIRMED`
3. If not, manually confirm user in console
4. Or use AWS CLI: `aws cognito-idp admin-confirm-sign-up --user-pool-id <POOL_ID> --username <EMAIL>`

### Issue: Confirmation code not received

**Symptoms:**
- User doesn't receive email with code

**Solutions:**
1. Check spam/junk folder
2. Verify email address is correct
3. Check Cognito email configuration
4. Use resend code button
5. Check AWS SES sending limits
6. Verify email is verified in SES (if in sandbox mode)

### Issue: Mock mode not auto-confirming

**Symptoms:**
- Mock mode shows confirmation page

**Solutions:**
1. Verify `NEXT_PUBLIC_USE_MOCK_AUTH=true` in `.env.local`
2. Restart development server
3. Clear browser localStorage
4. Check console for mock auth warning

## Configuration

### Environment Variables

```env
# Enable Mock Cognito (development only)
NEXT_PUBLIC_USE_MOCK_AUTH=true

# Real Cognito Configuration (production)
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
```

### Cognito User Pool Settings

**Email Verification:**
- Verification method: Code
- Code expiration: 24 hours (default)
- Code length: 6 digits

**Email Configuration:**
- From email: noreply@yourdomain.com
- Reply-to email: support@yourdomain.com
- Email subject: "Your verification code"

## Security Considerations

### Password Storage

- Password is stored in sessionStorage temporarily
- Only used for auto sign-in after confirmation
- Cleared immediately after successful sign-in
- Never sent to backend
- Only stored in browser memory

### Session Storage

- Used only for confirmation flow
- Cleared after successful confirmation
- Not accessible across tabs
- Cleared on browser close

### Token Storage

- JWT token stored in localStorage
- Also stored in httpOnly cookie (if possible)
- Token validated on every API request
- Token expires after 1 hour (default)

## Future Enhancements

1. **SMS Confirmation**: Support phone number verification
2. **Email Link Confirmation**: Click link in email instead of entering code
3. **QR Code**: Generate QR code for mobile confirmation
4. **Biometric Confirmation**: Use device biometrics for confirmation
5. **Multi-language Support**: Translate confirmation messages
6. **Custom Email Templates**: Branded confirmation emails
7. **Rate Limiting**: Prevent abuse of resend code
8. **Analytics**: Track confirmation success rates

## Related Documentation

- [Mock Auth Setup](./MOCK_AUTH_SETUP.md)
- [Auth Flow Fix](./AUTH_FLOW_FIX.md)
- [Cognito Setup Guide](./COGNITO_SETUP_GUIDE.md)
- [API Client Complete](./API_CLIENT_COMPLETE.md)
