import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';
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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
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

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.login({ email, password });

          if (response.success && response.data) {
            const { user, token } = response.data as any;

            // Save token to localStorage AND cookie
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_token', token);
              setCookie('auth_token', token, 7);
            }
            
            set({
              user: {
                id: user.id.toString(),
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profileImageUrl: user.profileImageUrl,
                createdAt: user.createdAt || new Date().toISOString(),
                updatedAt: user.updatedAt || new Date().toISOString(),
              },
              isAuthenticated: true,
              isLoading: false 
            });

            console.log('✅ Login successful! User role:', user.role);
          } else {
            throw new Error(response.error || 'Login failed');
          }
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
          await cognito.signOut();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
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
        }
      },

      register: async (userData: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.register({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
            role: userData.role,
          });
          
          if (response.success && response.data) {
            const data = response.data as any;

            if (data.token) {
              const { user, token } = data;

              if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', token);
                setCookie('auth_token', token, 7);
              }

              set({
                user: {
                  id: user.id.toString(),
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  phoneNumber: user.phoneNumber,
                  role: user.role,
                  profileImageUrl: user.profileImageUrl,
                  createdAt: user.createdAt || new Date().toISOString(),
                  updatedAt: user.updatedAt || new Date().toISOString(),
                },
                isAuthenticated: true,
                isLoading: false
              });

              console.log('✅ Registration successful! User role:', user.role);
            } else {
              // Backend requires email confirmation
              set({ isLoading: false });
              console.log('📧 Please check your email to confirm registration');
            }
          } else {
            throw new Error(response.error || 'Registration failed');
          }
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

      confirmSignUp: async (email: string, code: string) => {
        set({ isLoading: true, error: null });
        try {
          await cognito.confirmSignUp(email, code);
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Confirmation failed',
            isLoading: false
          });
          throw error;
        }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await cognito.forgotPassword(email);
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to send reset code',
            isLoading: false
          });
          throw error;
        }
      },

      resetPassword: async (email: string, code: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          await cognito.forgotPasswordSubmit(email, code, newPassword);
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to reset password',
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

          // Clear invalid token
          if (typeof window !== 'undefined') {
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
