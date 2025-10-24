# Design Document: Email Confirmation Flow

## Overview

This design implements a complete email confirmation flow for user registration, handling the "User is not confirmed" error from AWS Cognito. The solution provides a seamless UX for email verification while maintaining compatibility with both Mock Cognito (development) and Real Cognito (production). The design includes a dedicated confirmation page, resend code functionality, error handling, and automatic sign-in after successful confirmation.

## Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Registration Flow                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  User Submits Form    │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  cognito.signUp()     │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │  Mock Mode?           │
         └───┬───────────────┬───┘
             │               │
    Yes      │               │      No
             │               │
             ▼               ▼
   ┌─────────────────┐  ┌──────────────────────┐
   │ Auto-confirm    │  │ Redirect to          │
   │ Skip confirm UI │  │ Confirmation Page    │
   │ Auto sign-in    │  │ /auth/confirm        │
   └─────────────────┘  └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ User Enters Code     │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ confirmSignUp()      │
                        └──────────┬───────────┘
                                   │
                        ┌──────────▼───────────┐
                        │ Success?             │
                        └──┬───────────────┬───┘
                           │               │
                  Yes      │               │      No
                           │               │
                           ▼               ▼
                ┌──────────────────┐  ┌──────────────┐
                │ Auto sign-in     │  │ Show Error   │
                │ Redirect to      │  │ Allow Retry  │
                │ Dashboard        │  │              │
                └──────────────────┘  └──────────────┘
```

### Login Flow with Unconfirmed User

```
┌─────────────────────────────────────────────────────────┐
│                    Login Flow                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  User Submits Login   │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  cognito.signIn()     │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │  Error?               │
         └───┬───────────────┬───┘
             │               │
    No       │               │      Yes
             │               │
             ▼               ▼
   ┌─────────────────┐  ┌──────────────────────┐
   │ Success         │  │ UserNotConfirmed?    │
   │ Redirect        │  └──────────┬───────────┘
   └─────────────────┘             │
                          ┌────────▼────────┐
                          │ Yes             │
                          └────────┬────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ Redirect to          │
                        │ /auth/confirm        │
                        │ with email param     │
                        └──────────────────────┘
```

## Components and Interfaces

### 1. Confirmation Page Component

**File:** `app/auth/confirm/page.tsx`

**Purpose:** Dedicated page for email confirmation after registration

**Key Features:**
- 6-digit code input with auto-focus
- Auto-submit when 6 digits entered
- Resend code button with 60-second cooldown
- Error display with retry capability
- Loading states for all async operations
- Success message before redirect

**Component Structure:**

```typescript
'use client';

interface ConfirmPageProps {
  searchParams: {
    email?: string;
  };
}

export default function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const router = useRouter();
  const [email, setEmail] = useState(searchParams.email || '');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (code.length === 6) {
      handleConfirm();
    }
  }, [code]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleConfirm = async () => {
    // Validation and confirmation logic
  };

  const handleResendCode = async () => {
    // Resend code logic
  };

  return (
    // UI implementation
  );
}
```

### 2. Updated Registration Flow

**File:** `store/authStore.ts`

**Changes to `register` method:**

```typescript
register: async (userData: any) => {
  set({ isLoading: true, error: null });
  try {
    // Step 1: Sign up with Cognito
    const signUpResult = await cognito.signUp(
      userData.email,
      userData.password,
      {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
      }
    );

    if (!signUpResult.success) {
      throw new Error(signUpResult.error || 'Signup failed');
    }

    // Check if confirmation is required
    const needsConfirmation = signUpResult.data?.nextStep?.signUpStep === 'CONFIRM_SIGN_UP';

    if (needsConfirmation) {
      // Store email in sessionStorage for confirmation page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pending_confirmation_email', userData.email);
      }
      
      set({ isLoading: false });
      
      // Return special flag to indicate confirmation needed
      return { needsConfirmation: true, email: userData.email };
    }

    // If no confirmation needed (Mock mode), proceed with auto sign-in
    const signInResult = await cognito.signIn(userData.email, userData.password);

    if (!signInResult.success || !signInResult.data) {
      throw new Error(signInResult.error || 'Auto sign-in failed');
    }

    const { user: cognitoUser, tokens } = signInResult.data;

    // Store token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', tokens.idToken);
      setCookie('auth_token', tokens.idToken, 7);
    }

    // Register with backend
    try {
      await api.auth.register({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
      });
    } catch (backendError) {
      console.warn('[AUTH] Backend registration failed, but Cognito user exists');
    }

    set({
      user: cognitoUser,
      isAuthenticated: true,
      isLoading: false
    });

    return { needsConfirmation: false };
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    set({
      error: error?.message || 'Registration failed',
      isLoading: false
    });
    throw error;
  }
},
```

### 3. Updated Login Flow

**File:** `store/authStore.ts`

**Changes to `login` method:**

```typescript
login: async (email: string, password: string) => {
  set({ isLoading: true, error: null });
  try {
    const signInResult = await cognito.signIn(email, password);

    if (!signInResult.success) {
      // Check if user is not confirmed
      if (signInResult.error?.includes('not confirmed') || 
          signInResult.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        
        // Store email for confirmation page
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('pending_confirmation_email', email);
        }
        
        set({ isLoading: false });
        
        // Return special flag
        return { needsConfirmation: true, email };
      }
      
      throw new Error(signInResult.error || 'Sign in failed');
    }

    const { user, tokens } = signInResult.data!;

    // Save token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', tokens.idToken);
      setCookie('auth_token', tokens.idToken, 7);
    }
    
    set({
      user,
      isAuthenticated: true,
      isLoading: false 
    });

    return { needsConfirmation: false };
  } catch (error) {
    console.error('❌ Login error:', error);
    set({
      error: error instanceof Error ? error.message : 'Login failed',
      isLoading: false 
    });
    throw error;
  }
},
```

### 4. Confirmation Methods in Cognito Services

**Already implemented in `lib/realCognito.ts`:**

```typescript
static async confirmSignUp(email: string, code: string): Promise<ConfirmResult> {
  try {
    const confirmInput: ConfirmSignUpInput = {
      username: email,
      confirmationCode: code,
    };

    const { isSignUpComplete, nextStep } = await amplifyConfirmSignUp(confirmInput);

    return {
      success: true,
      data: {
        confirmed: isSignUpComplete,
        nextStep,
      },
    };
  } catch (error: any) {
    console.error('Cognito confirm signup error:', error);
    return {
      success: false,
      error: error.message || 'Confirmation failed',
    };
  }
}
```

**Need to add resendConfirmationCode to both services:**

```typescript
// lib/realCognito.ts
import { resendSignUpCode } from '@aws-amplify/auth';

static async resendConfirmationCode(email: string): Promise<ResendCodeResult> {
  try {
    const output = await resendSignUpCode({ username: email });
    
    return {
      success: true,
      data: {
        codeSent: true,
        destination: output.destination,
      },
    };
  } catch (error: any) {
    console.error('Resend confirmation code error:', error);
    return {
      success: false,
      error: error.message || 'Resend failed',
    };
  }
}

// lib/mockCognito.ts
static async resendConfirmationCode(email: string): Promise<ResendCodeResult> {
  try {
    console.log('[MOCK AUTH] ResendConfirmationCode for:', email);

    // Check if user exists
    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Generate new 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Log code to console (simulates email)
    console.log(
      '%c[MOCK AUTH] Confirmation code for ' + email + ': ' + code,
      'background: #4caf50; color: white; font-size: 14px; padding: 4px 8px; border-radius: 4px;'
    );

    return {
      success: true,
      data: {
        codeSent: true,
        destination: email,
      },
    };
  } catch (error: any) {
    console.error('[MOCK AUTH] ResendConfirmationCode error:', error);
    return {
      success: false,
      error: error.message || 'Resend failed',
    };
  }
}
```

### 5. Updated Register Page

**File:** `app/auth/register/page.tsx`

**Changes to `handleSubmit`:**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMessage('');

  // Validate passwords match
  if (formData.password !== formData.confirmPassword) {
    setErrorMessage('Passwords do not match');
    return;
  }

  // Validate password strength
  if (formData.password.length < 8) {
    setErrorMessage('Password must be at least 8 characters long');
    return;
  }

  try {
    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      role: formData.role,
    });

    // Check if confirmation is needed
    if (result?.needsConfirmation) {
      // Redirect to confirmation page
      router.push(`/auth/confirm?email=${encodeURIComponent(formData.email)}`);
      return;
    }

    // If no confirmation needed, redirect based on role
    const { user } = useAuthStore.getState();
    if (user) {
      if (user.role === 'CLIENT_USER') {
        router.push('/');
      } else {
        switch (user.role) {
          case 'ADMIN':
            router.push('/dashboard/admin');
            break;
          case 'GYM_STAFF':
            router.push('/dashboard/gym-staff');
            break;
          case 'PT_USER':
            router.push('/dashboard/pt');
            break;
          default:
            router.push('/dashboard');
        }
      }
    }
  } catch (error: any) {
    console.error('Registration failed:', error);
    const message = error?.message || 'Registration failed. Please try again.';
    setErrorMessage(message);
  }
};
```

### 6. Updated Login Page

**File:** `app/auth/login/page.tsx`

**Changes to `handleSubmit`:**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMessage('');

  try {
    const result = await login(formData.email, formData.password);

    // Check if confirmation is needed
    if (result?.needsConfirmation) {
      // Redirect to confirmation page
      router.push(`/auth/confirm?email=${encodeURIComponent(formData.email)}`);
      return;
    }

    // Success - redirect based on role
    const { user } = useAuthStore.getState();
    if (user) {
      if (user.role === 'CLIENT_USER') {
        router.push('/');
      } else {
        switch (user.role) {
          case 'ADMIN':
            router.push('/dashboard/admin');
            break;
          case 'GYM_STAFF':
            router.push('/dashboard/gym-staff');
            break;
          case 'PT_USER':
            router.push('/dashboard/pt');
            break;
          default:
            router.push('/dashboard');
        }
      }
    }
  } catch (error: any) {
    console.error('Login failed:', error);
    const message = error?.message || 'Login failed. Please try again.';
    setErrorMessage(message);
  }
};
```

## Data Models

### Session Storage Schema

```typescript
// Key: 'pending_confirmation_email'
// Value: string (email address)
// Purpose: Store email during confirmation flow
// Lifecycle: Set on registration/login, cleared after successful confirmation

sessionStorage.setItem('pending_confirmation_email', 'user@example.com');
```

### Confirmation Result Types

```typescript
interface ConfirmResult {
  success: boolean;
  data?: {
    confirmed: boolean;
    nextStep: any;
  };
  error?: string;
}

interface ResendCodeResult {
  success: boolean;
  data?: {
    codeSent: boolean;
    destination: string; // Email or phone where code was sent
  };
  error?: string;
}

interface AuthActionResult {
  needsConfirmation?: boolean;
  email?: string;
}
```

## Error Handling

### Error Messages Mapping

```typescript
const ERROR_MESSAGES: Record<string, string> = {
  // Confirmation errors
  'CodeMismatchException': 'Invalid confirmation code. Please check and try again.',
  'ExpiredCodeException': 'Confirmation code expired. Please request a new one.',
  'LimitExceededException': 'Too many attempts. Please request a new code.',
  'UserNotFoundException': 'User not found. Please register first.',
  'NotAuthorizedException': 'Invalid email or password.',
  'UserNotConfirmedException': 'Please confirm your email to continue.',
  
  // Network errors
  'NetworkError': 'Network error. Please check your connection and try again.',
  
  // Generic
  'default': 'An error occurred. Please try again.',
};

function getErrorMessage(error: any): string {
  const errorCode = error?.name || error?.code;
  return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.default;
}
```

### Error Handling in Confirmation Page

```typescript
const handleConfirm = async () => {
  if (!email || !code) {
    setError('Please enter your email and confirmation code');
    return;
  }

  if (code.length !== 6) {
    setError('Confirmation code must be 6 digits');
    return;
  }

  setIsLoading(true);
  setError('');

  try {
    // Confirm sign up
    const confirmResult = await cognito.confirmSignUp(email, code);

    if (!confirmResult.success) {
      setError(getErrorMessage(confirmResult.error));
      setIsLoading(false);
      return;
    }

    // Show success message
    setSuccessMessage('Email confirmed successfully! Signing you in...');

    // Auto sign-in after confirmation
    const signInResult = await cognito.signIn(email, password);

    if (!signInResult.success || !signInResult.data) {
      setError('Confirmation successful, but auto sign-in failed. Please login manually.');
      setIsLoading(false);
      setTimeout(() => router.push('/auth/login'), 2000);
      return;
    }

    const { user, tokens } = signInResult.data;

    // Store token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', tokens.idToken);
      sessionStorage.removeItem('pending_confirmation_email');
    }

    // Update auth store
    useAuthStore.getState().setUser(user);

    // Register with backend
    try {
      await api.auth.register({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
      });
    } catch (backendError) {
      console.warn('[AUTH] Backend registration failed');
    }

    // Redirect based on role
    setTimeout(() => {
      if (user.role === 'CLIENT_USER') {
        router.push('/');
      } else {
        router.push('/dashboard');
      }
    }, 1500);

  } catch (error: any) {
    console.error('Confirmation error:', error);
    setError(getErrorMessage(error));
    setIsLoading(false);
  }
};
```

## Testing Strategy

### Unit Tests

**Test File:** `app/auth/confirm/__tests__/page.test.tsx`

**Test Cases:**

1. **Rendering Tests**
   - Should render confirmation form with email input
   - Should render 6-digit code input
   - Should render resend button
   - Should pre-fill email from URL params

2. **Code Input Tests**
   - Should accept only numeric input
   - Should limit input to 6 digits
   - Should auto-submit when 6 digits entered
   - Should handle paste events correctly

3. **Confirmation Tests**
   - Should call confirmSignUp with correct params
   - Should show loading state during confirmation
   - Should show success message on success
   - Should show error message on failure
   - Should redirect after successful confirmation

4. **Resend Code Tests**
   - Should call resendConfirmationCode
   - Should show success message
   - Should start 60-second cooldown
   - Should disable button during cooldown
   - Should show countdown timer

5. **Error Handling Tests**
   - Should display error for invalid code
   - Should display error for expired code
   - Should display error for network issues
   - Should allow retry after error

### Integration Tests

**Test File:** `store/__tests__/authStore.confirm.test.ts`

**Test Cases:**

1. Should integrate registration with confirmation flow
2. Should integrate login with confirmation redirect
3. Should handle unconfirmed user login attempt
4. Should auto sign-in after successful confirmation

### Manual Testing Checklist

#### Real Cognito Mode
- [ ] Register new user with real email
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
- [ ] Test that confirmSignUp accepts any 6-digit code
- [ ] Test resend code logs to console

## UI/UX Design

### Confirmation Page Layout

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│                    [VERTEX LOGO]                         │
│                                                          │
│              Confirm Your Email Address                  │
│                                                          │
│   We sent a confirmation code to:                        │
│   user@example.com                                       │
│                                                          │
│   ┌──────────────────────────────────────────┐          │
│   │  Enter 6-digit code                      │          │
│   │  [_] [_] [_] [_] [_] [_]                │          │
│   └──────────────────────────────────────────┘          │
│                                                          │
│   [✓ Confirm Email]                                     │
│                                                          │
│   Didn't receive the code?                              │
│   [Resend Code (60s)]                                   │
│                                                          │
│   ─────────────────────────────────────────             │
│                                                          │
│   Need help? Contact support                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Loading States

1. **Confirming Code**: Button shows spinner, input disabled
2. **Resending Code**: Resend button shows spinner
3. **Success**: Green checkmark, success message, then redirect

### Error States

1. **Invalid Code**: Red border on input, error message below
2. **Expired Code**: Error message with "Request new code" link
3. **Network Error**: Error message with "Try again" button

### Success State

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│                    [✓ SUCCESS]                           │
│                                                          │
│         Email Confirmed Successfully!                    │
│                                                          │
│         Signing you in...                               │
│                                                          │
│         [Loading spinner]                               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Accessibility

1. **Keyboard Navigation**: Full keyboard support for all inputs
2. **Screen Readers**: Proper ARIA labels and announcements
3. **Focus Management**: Auto-focus on code input, focus on error messages
4. **Error Announcements**: Errors announced to screen readers
5. **Loading States**: Loading states announced to screen readers
6. **Mobile Support**: Numeric keyboard for code input on mobile

## Performance Considerations

1. **Auto-submit**: Reduces friction by auto-submitting when 6 digits entered
2. **Debouncing**: Prevent multiple rapid submissions
3. **Cooldown Timer**: Prevent spam of resend requests
4. **Session Storage**: Lightweight storage for pending confirmation state
5. **Optimistic UI**: Show success message before redirect completes

## Security Considerations

1. **Code Validation**: Server-side validation of confirmation codes
2. **Rate Limiting**: Cognito handles rate limiting for code attempts
3. **Code Expiration**: Codes expire after 24 hours (Cognito default)
4. **Session Cleanup**: Clear pending confirmation data after success
5. **No Password Storage**: Never store password in sessionStorage

## Future Enhancements

1. **SMS Confirmation**: Support phone number confirmation
2. **Email Link Confirmation**: Click link in email instead of entering code
3. **QR Code**: Generate QR code for mobile confirmation
4. **Biometric Confirmation**: Use device biometrics for confirmation
5. **Multi-language Support**: Translate confirmation messages
6. **Custom Email Templates**: Branded confirmation emails
