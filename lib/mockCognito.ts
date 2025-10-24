import { User, UserRole, ResendCodeResult } from '@/types';

// Mock user storage interface
interface MockUser {
  id: string;
  email: string;
  password: string; // Base64 encoded
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  profileImageUrl?: string;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock session interface
interface MockSession {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp
  user: User;
}

// Mock reset code interface
interface MockResetCode {
  email: string;
  code: string;
  expiresAt: number; // Unix timestamp
}

// Result types matching real Cognito
interface SignUpResult {
  success: boolean;
  data?: {
    userSub: string;
    user: any;
    isSignUpComplete: boolean;
    nextStep: any;
  };
  error?: string;
}

interface SignInResult {
  success: boolean;
  data?: {
    user: User;
    tokens: {
      accessToken: string;
      idToken: string;
      refreshToken: string;
    };
  };
  error?: string;
  nextStep?: any;
}

interface ConfirmResult {
  success: boolean;
  data?: {
    confirmed: boolean;
    nextStep: any;
  };
  error?: string;
}

interface SignOutResult {
  success: boolean;
  error?: string;
}

interface ForgotPasswordResult {
  success: boolean;
  data?: {
    codeSent: boolean;
    nextStep: any;
  };
  error?: string;
}

interface ResetPasswordResult {
  success: boolean;
  data?: {
    passwordReset: boolean;
  };
  error?: string;
}

// LocalStorage keys
const STORAGE_KEYS = {
  USERS: 'mock_users',
  SESSION: 'mock_session',
  CURRENT_USER: 'mock_current_user',
  RESET_CODES: 'mock_reset_codes',
};

// Pre-seeded default users for testing
const DEFAULT_MOCK_USERS: MockUser[] = [
  {
    id: 'mock-user-client',
    email: 'client@test.com',
    password: btoa('password123'),
    firstName: 'Test',
    lastName: 'Client',
    phoneNumber: '+1234567890',
    role: 'CLIENT_USER',
    confirmed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-user-gym',
    email: 'gym@test.com',
    password: btoa('password123'),
    firstName: 'Test',
    lastName: 'Gym',
    phoneNumber: '+1234567891',
    role: 'GYM_STAFF',
    confirmed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-user-pt',
    email: 'trainer@test.com',
    password: btoa('password123'),
    firstName: 'Test',
    lastName: 'Trainer',
    phoneNumber: '+1234567892',
    role: 'PT_USER',
    confirmed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-user-admin',
    email: 'admin@test.com',
    password: btoa('password123'),
    firstName: 'Test',
    lastName: 'Admin',
    phoneNumber: '+1234567893',
    role: 'ADMIN',
    confirmed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class MockCognitoService {
  /**
   * Initialize mock users if not already present
   */
  private static initializeUsers(): void {
    if (typeof window === 'undefined') return;

    const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!existingUsers) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_MOCK_USERS));
      console.log('%c[MOCK AUTH] Initialized default test users', 'color: #2196f3; font-weight: bold;');
      console.table(
        DEFAULT_MOCK_USERS.map((u) => ({
          Email: u.email,
          Password: 'password123',
          Role: u.role,
        }))
      );
    }
  }

  /**
   * Get all users from localStorage
   */
  private static getUsers(): MockUser[] {
    if (typeof window === 'undefined') return [];
    this.initializeUsers();
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  }

  /**
   * Save users to localStorage
   */
  private static saveUsers(users: MockUser[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  /**
   * Generate mock JWT tokens
   */
  private static generateMockTokens(user: MockUser): {
    accessToken: string;
    idToken: string;
    refreshToken: string;
  } {
    const now = Math.floor(Date.now() / 1000);
    const accessExpiry = now + 3600; // 1 hour
    const refreshExpiry = now + 86400; // 24 hours

    // JWT Header
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    // JWT Payload for ID token (includes user claims)
    const idPayload = {
      sub: user.id,
      email: user.email,
      given_name: user.firstName,
      family_name: user.lastName,
      phone_number: user.phoneNumber,
      'custom:role': user.role,
      iat: now,
      exp: accessExpiry,
      iss: 'mock-cognito',
    };

    // JWT Payload for access token
    const accessPayload = {
      sub: user.id,
      'cognito:groups': [user.role],
      iat: now,
      exp: accessExpiry,
      iss: 'mock-cognito',
    };

    // Create mock JWT tokens (header.payload.signature)
    const encodeToken = (payload: any) => {
      const encodedHeader = btoa(JSON.stringify(header));
      const encodedPayload = btoa(JSON.stringify(payload));
      // Generate random signature for realism
      const signature = btoa(Math.random().toString(36).substring(2));
      return `${encodedHeader}.${encodedPayload}.${signature}`;
    };

    const accessToken = encodeToken(accessPayload);
    const idToken = encodeToken(idPayload);
    const refreshToken = btoa(JSON.stringify({ sub: user.id, exp: refreshExpiry }));

    console.log('[MOCK AUTH] Generated JWT tokens for:', user.email);

    return { accessToken, idToken, refreshToken };
  }

  /**
   * Convert MockUser to User
   */
  private static mockUserToUser(mockUser: MockUser): User {
    return {
      id: mockUser.id,
      email: mockUser.email,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      phoneNumber: mockUser.phoneNumber,
      role: mockUser.role,
      profileImageUrl: mockUser.profileImageUrl,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
    };
  }

  /**
   * Sign up a new user
   */
  static async signUp(
    email: string,
    password: string,
    userData: {
      firstName: string;
      lastName: string;
      phoneNumber?: string;
      role: UserRole;
    }
  ): Promise<SignUpResult> {
    try {
      console.log('[MOCK AUTH] SignUp attempt for:', email);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          error: 'Invalid email format',
        };
      }

      // Validate password strength
      if (password.length < 8) {
        return {
          success: false,
          error: 'Password must be at least 8 characters long',
        };
      }

      // Check for duplicate email
      const users = this.getUsers();
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return {
          success: false,
          error: 'User already exists',
        };
      }

      // Create new user (auto-confirmed in Mock mode for dev convenience)
      const newUser: MockUser = {
        id: `mock-user-${Date.now()}`,
        email,
        password: btoa(password), // Base64 encode password
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        confirmed: true, // Auto-confirm in Mock mode
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save user
      users.push(newUser);
      this.saveUsers(users);

      console.log('[MOCK AUTH] User created and auto-confirmed:', email);

      return {
        success: true,
        data: {
          userSub: newUser.id,
          user: userData,
          isSignUpComplete: true, // Already complete in Mock mode
          nextStep: { signUpStep: 'DONE' }, // No confirmation needed
        },
      };
    } catch (error: any) {
      console.error('[MOCK AUTH] SignUp error:', error);
      return {
        success: false,
        error: error.message || 'Signup failed',
      };
    }
  }

  /**
   * Confirm sign up with verification code
   */
  static async confirmSignUp(email: string, code: string): Promise<ConfirmResult> {
    try {
      console.log('[MOCK AUTH] ConfirmSignUp for:', email);

      // Special code for error testing
      if (code === '000000') {
        return {
          success: false,
          error: 'Invalid verification code',
        };
      }

      // Accept any 6-digit code
      if (!/^\d{6}$/.test(code)) {
        return {
          success: false,
          error: 'Code must be 6 digits',
        };
      }

      // Find and confirm user
      const users = this.getUsers();
      const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

      if (userIndex === -1) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      users[userIndex].confirmed = true;
      users[userIndex].updatedAt = new Date().toISOString();
      this.saveUsers(users);

      console.log('[MOCK AUTH] User confirmed successfully:', email);

      return {
        success: true,
        data: {
          confirmed: true,
          nextStep: { signUpStep: 'DONE' },
        },
      };
    } catch (error: any) {
      console.error('[MOCK AUTH] ConfirmSignUp error:', error);
      return {
        success: false,
        error: error.message || 'Confirmation failed',
      };
    }
  }

  /**
   * Sign in user
   */
  static async signIn(email: string, password: string): Promise<SignInResult> {
    try {
      console.log('[MOCK AUTH] SignIn attempt for:', email);

      // Find user
      const users = this.getUsers();
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      // Validate password
      const encodedPassword = btoa(password);
      if (user.password !== encodedPassword) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Check if user is confirmed
      if (!user.confirmed) {
        return {
          success: false,
          error: 'User is not confirmed',
          nextStep: { signInStep: 'CONFIRM_SIGN_UP' },
        };
      }

      // Generate tokens
      const tokens = this.generateMockTokens(user);

      // Store session
      const session: MockSession = {
        ...tokens,
        expiresAt: Date.now() + 3600000, // 1 hour
        user: this.mockUserToUser(user),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(session.user));
      }

      console.log('[MOCK AUTH] SignIn successful:', email);

      return {
        success: true,
        data: {
          user: this.mockUserToUser(user),
          tokens,
        },
      };
    } catch (error: any) {
      console.error('[MOCK AUTH] SignIn error:', error);
      return {
        success: false,
        error: error.message || 'Signin failed',
      };
    }
  }

  /**
   * Sign out user
   */
  static async signOut(): Promise<SignOutResult> {
    try {
      console.log('[MOCK AUTH] SignOut');

      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }

      return { success: true };
    } catch (error: any) {
      console.error('[MOCK AUTH] SignOut error:', error);
      return {
        success: false,
        error: error.message || 'Signout failed',
      };
    }
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      if (typeof window === 'undefined') return null;

      const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!sessionData) return null;

      const session: MockSession = JSON.parse(sessionData);

      // Check if session expired
      if (Date.now() > session.expiresAt) {
        console.log('[MOCK AUTH] Session expired');
        this.signOut();
        return null;
      }

      return session.user;
    } catch (error) {
      console.error('[MOCK AUTH] GetCurrentUser error:', error);
      return null;
    }
  }

  /**
   * Get current session with tokens
   */
  static async getCurrentSession(): Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
  } | null> {
    try {
      if (typeof window === 'undefined') return null;

      const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!sessionData) return null;

      const session: MockSession = JSON.parse(sessionData);

      // Check if session expired
      if (Date.now() > session.expiresAt) {
        console.log('[MOCK AUTH] Session expired');
        this.signOut();
        return null;
      }

      return {
        accessToken: session.accessToken,
        idToken: session.idToken,
        refreshToken: session.refreshToken,
      };
    } catch (error) {
      console.error('[MOCK AUTH] GetCurrentSession error:', error);
      return null;
    }
  }

  /**
   * Get access token for API calls
   */
  static async getAccessToken(): Promise<string | null> {
    try {
      const session = await this.getCurrentSession();
      return session?.accessToken || null;
    } catch (error) {
      console.error('[MOCK AUTH] GetAccessToken error:', error);
      return null;
    }
  }

  /**
   * Forgot password
   */
  static async forgotPassword(email: string): Promise<ForgotPasswordResult> {
    try {
      console.log('[MOCK AUTH] ForgotPassword for:', email);

      // Check if user exists
      const users = this.getUsers();
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Store reset code
      if (typeof window !== 'undefined') {
        const resetCodes: MockResetCode[] = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.RESET_CODES) || '[]'
        );

        resetCodes.push({
          email,
          code,
          expiresAt: Date.now() + 600000, // 10 minutes
        });

        localStorage.setItem(STORAGE_KEYS.RESET_CODES, JSON.stringify(resetCodes));
      }

      // Log code to console (simulates email)
      console.log(
        '%c[MOCK AUTH] Password reset code for ' + email + ': ' + code,
        'background: #ff9800; color: white; font-size: 14px; padding: 4px 8px; border-radius: 4px;'
      );

      return {
        success: true,
        data: {
          codeSent: true,
          nextStep: { resetPasswordStep: 'CONFIRM_RESET_PASSWORD_WITH_CODE' },
        },
      };
    } catch (error: any) {
      console.error('[MOCK AUTH] ForgotPassword error:', error);
      return {
        success: false,
        error: error.message || 'Forgot password failed',
      };
    }
  }

  /**
   * Reset password with code
   */
  static async forgotPasswordSubmit(
    email: string,
    code: string,
    newPassword: string
  ): Promise<ResetPasswordResult> {
    try {
      console.log('[MOCK AUTH] ForgotPasswordSubmit for:', email);

      // Validate new password
      if (newPassword.length < 8) {
        return {
          success: false,
          error: 'Password must be at least 8 characters long',
        };
      }

      // Get reset codes
      if (typeof window === 'undefined') {
        return { success: false, error: 'Not in browser environment' };
      }

      const resetCodes: MockResetCode[] = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.RESET_CODES) || '[]'
      );

      // Find valid code
      const resetCodeIndex = resetCodes.findIndex(
        (rc) =>
          rc.email.toLowerCase() === email.toLowerCase() &&
          rc.code === code &&
          Date.now() < rc.expiresAt
      );

      if (resetCodeIndex === -1) {
        return {
          success: false,
          error: 'Invalid or expired verification code',
        };
      }

      // Update password
      const users = this.getUsers();
      const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

      if (userIndex === -1) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      users[userIndex].password = btoa(newPassword);
      users[userIndex].updatedAt = new Date().toISOString();
      this.saveUsers(users);

      // Remove used reset code
      resetCodes.splice(resetCodeIndex, 1);
      localStorage.setItem(STORAGE_KEYS.RESET_CODES, JSON.stringify(resetCodes));

      console.log('[MOCK AUTH] Password reset successful for:', email);

      return {
        success: true,
        data: {
          passwordReset: true,
        },
      };
    } catch (error: any) {
      console.error('[MOCK AUTH] ForgotPasswordSubmit error:', error);
      return {
        success: false,
        error: error.message || 'Reset password failed',
      };
    }
  }

  /**
   * Resend confirmation code
   */
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
}

// Initialize users on module load (client-side only)
if (typeof window !== 'undefined') {
  MockCognitoService['initializeUsers']();
}
