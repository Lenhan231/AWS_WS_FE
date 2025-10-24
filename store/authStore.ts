import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole, AuthActionResult } from '@/types';
import { cognito } from '@/lib/cognito';
import { api } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<AuthActionResult>;
  logout: () => void;
  register: (userData: any) => Promise<AuthActionResult>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  initializeAuth: () => Promise<void>;
}

// Helper function to set cookie
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Helper function to delete cookie
const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        error: null 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: async (email: string, password: string): Promise<AuthActionResult> => {
        set({ isLoading: true, error: null });
        try {
          // Check if using Basic Auth mode (no Cognito)
          const useCognito = process.env.NEXT_PUBLIC_USE_COGNITO !== 'false';

          if (!useCognito) {
            // Basic Auth mode - just verify with backend /auth/me
            console.log('[AUTH] Using Basic Auth mode - verifying with backend');
            
            // Set a dummy token so API client knows we're "authenticated"
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_token', 'basic-auth-mode');
              setCookie('auth_token', 'basic-auth-mode', 7);
            }

            // Get user info from backend
            const response = await api.auth.me();
            if (response.success && response.data) {
              const userData = response.data as any;
              const user: User = {
                id: userData.id?.toString() || '1',
                email: userData.email || email,
                firstName: userData.firstName || 'Admin',
                lastName: userData.lastName || 'User',
                phoneNumber: userData.phoneNumber || '',
                role: userData.role || 'ADMIN',
                profileImageUrl: userData.profileImageUrl,
                createdAt: userData.createdAt || new Date().toISOString(),
                updatedAt: userData.updatedAt || new Date().toISOString(),
              };

              set({
                user,
                isAuthenticated: true,
                isLoading: false
              });

              console.log('✅ Basic Auth login successful! User role:', user.role);
              return { needsConfirmation: false };
            } else {
              throw new Error('Failed to get user info from backend');
            }
          }

          // Cognito mode (Mock or Real)
          console.log('[AUTH] Signing in with Cognito...');
          const signInResult = await cognito.signIn(email, password);

          if (!signInResult.success) {
            // Check if user is not confirmed
            const errorMessage = signInResult.error || '';
            const isUnconfirmed = errorMessage.includes('not confirmed') || 
                                 errorMessage.includes('User is not confirmed') ||
                                 signInResult.nextStep?.signInStep === 'CONFIRM_SIGN_UP';
            
            if (isUnconfirmed) {
              // Store email and password for confirmation page
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('pending_confirmation_email', email);
                sessionStorage.setItem('pending_confirmation_password', password);
              }
              
              set({ isLoading: false });
              console.log('[AUTH] User not confirmed, redirecting to confirmation');
              
              // Return flag to indicate confirmation needed
              return { needsConfirmation: true, email };
            }
            
            throw new Error(signInResult.error || 'Sign in failed');
          }

          if (!signInResult.data) {
            throw new Error('Sign in failed - no data returned');
          }

          const { user, tokens } = signInResult.data;

          // Save JWT token
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', tokens.idToken);
            setCookie('auth_token', tokens.idToken, 7);
          }
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false 
          });

          console.log('✅ Login successful! User role:', user.role);
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

      logout: async () => {
        try {
          // Sign out from Mock Cognito
          await cognito.signOut();
          
          // Clear token from localStorage AND cookie
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            deleteCookie('auth_token');
          }

          set({
            user: null, 
            isAuthenticated: false, 
            error: null 
          });
          
          console.log('✅ Logout successful');
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      register: async (userData: any): Promise<AuthActionResult> => {
        set({ isLoading: true, error: null });
        try {
          // Step 1: Sign up with Cognito
          console.log('[AUTH] Step 1: Signing up with Cognito...');
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
            throw new Error(signUpResult.error || 'Cognito signup failed');
          }

          console.log('[AUTH] Step 1 complete: User created in Cognito');

          // Check if confirmation is required
          const needsConfirmation = signUpResult.data?.nextStep?.signUpStep === 'CONFIRM_SIGN_UP';

          if (needsConfirmation) {
            // Store email and password in sessionStorage for confirmation page
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('pending_confirmation_email', userData.email);
              sessionStorage.setItem('pending_confirmation_password', userData.password);
            }
            
            set({ isLoading: false });
            console.log('[AUTH] Email confirmation required');
            
            // Return flag to indicate confirmation needed
            return { needsConfirmation: true, email: userData.email };
          }

          // If no confirmation needed (Mock mode), proceed with auto sign-in
          console.log('[AUTH] Step 2: Auto signing in (no confirmation needed)...');
          const signInResult = await cognito.signIn(userData.email, userData.password);

          if (!signInResult.success || !signInResult.data) {
            throw new Error(signInResult.error || 'Auto sign-in failed');
          }

          const { user: cognitoUser, tokens } = signInResult.data;
          console.log('[AUTH] Step 2 complete: JWT token obtained');

          // Step 3: Register user profile in backend Postgres
          console.log('[AUTH] Step 3: Registering user profile in backend Postgres...');
          
          // Store token so API client can use it
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', tokens.idToken);
            setCookie('auth_token', tokens.idToken, 7);
          }

          try {
            await api.auth.register({
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              phoneNumber: userData.phoneNumber,
              role: userData.role,
            });
            console.log('[AUTH] Step 3 complete: User profile created in backend Postgres');
          } catch (backendError) {
            console.warn('[AUTH] Backend registration failed, but Cognito user exists');
          }

          // Success! Set user state
          set({
            user: cognitoUser,
            isAuthenticated: true,
            isLoading: false
          });

          console.log('✅ Registration successful! User role:', cognitoUser.role);
          return { needsConfirmation: false };
        } catch (error: any) {
          console.error('❌ Registration error:', error);
          const errorMessage = error?.response?.data?.message || error?.message || 'Registration failed';
          set({
            error: errorMessage,
            isLoading: false
          });
          throw error;
        }
      },



      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.role === role;
      },

      hasAnyRole: (roles: UserRole[]) => {
        const { user } = get();
        return user ? roles.includes(user.role) : false;
      },

      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          // Check if using Basic Auth mode (no Cognito)
          const useCognito = process.env.NEXT_PUBLIC_USE_COGNITO !== 'false';

          if (!useCognito) {
            // Basic Auth mode - always authenticated, get user from backend
            console.log('[AUTH] Using Basic Auth mode - getting user from backend');
            
            try {
              const response = await api.auth.me();
              if (response.success && response.data) {
                const userData = response.data as any;
                const user: User = {
                  id: userData.id?.toString() || '1',
                  email: userData.email || 'local-admin@easybody.com',
                  firstName: userData.firstName || 'Admin',
                  lastName: userData.lastName || 'User',
                  phoneNumber: userData.phoneNumber || '',
                  role: userData.role || 'ADMIN',
                  profileImageUrl: userData.profileImageUrl,
                  createdAt: userData.createdAt || new Date().toISOString(),
                  updatedAt: userData.updatedAt || new Date().toISOString(),
                };

                set({
                  user,
                  isAuthenticated: true,
                  isLoading: false
                });
                console.log('[AUTH] Basic Auth user loaded:', user.email, user.role);
              } else {
                set({ user: null, isAuthenticated: false, isLoading: false });
              }
            } catch (error) {
              console.error('[AUTH] Failed to load user in Basic Auth mode:', error);
              set({ user: null, isAuthenticated: false, isLoading: false });
            }
            return;
          }

          // Check if using Mock Auth mode
          const useMockAuth = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';
          
          if (useMockAuth) {
            // In Mock Auth mode, get user from Cognito directly (no backend verification)
            console.log('[AUTH] Using Mock Auth mode - getting user from Cognito');
            const user = await cognito.getCurrentUser();
            if (user) {
              set({
                user,
                isAuthenticated: true,
                isLoading: false
              });
              console.log('[AUTH] Mock Auth user restored:', user.email, user.role);
            } else {
              set({ user: null, isAuthenticated: false, isLoading: false });
            }
            return;
          }

          // Real Cognito mode - verify with backend
          const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
          if (token) {
            const response = await api.auth.me();
            if (response.success && response.data) {
              const userData = response.data as any;

              // Validate user data before setting
              if (userData && userData.id && userData.email) {
                set({
                  user: {
                    id: userData.id.toString(),
                    email: userData.email,
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    phoneNumber: userData.phoneNumber || '',
                    role: userData.role || 'CLIENT_USER',
                    profileImageUrl: userData.profileImageUrl,
                    createdAt: userData.createdAt || new Date().toISOString(),
                    updatedAt: userData.updatedAt || new Date().toISOString(),
                  },
                  isAuthenticated: true,
                  isLoading: false
                });
              } else {
                // Invalid user data, clear token
                console.warn('⚠️ Invalid user data received from API');
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('auth_token');
                  deleteCookie('auth_token');
                }
                set({ user: null, isAuthenticated: false, isLoading: false });
              }
            } else {
              // Token invalid or API error, clear it
              console.warn('⚠️ Auth verification failed:', response.error);
              if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                deleteCookie('auth_token');
              }
              set({ user: null, isAuthenticated: false, isLoading: false });
            }
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          // Catch any errors including backend Sequelize errors
          console.error('❌ Auth initialization error:', error);

          // In Mock Auth mode, don't clear token on error
          const useMockAuth = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';
          if (!useMockAuth && typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            deleteCookie('auth_token');
          }

          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
