import { Amplify } from '@aws-amplify/core';
import {
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  getCurrentUser as amplifyGetCurrentUser,
  fetchAuthSession,
  resetPassword,
  confirmResetPassword,
  resendSignUpCode,
  type SignUpInput,
  type ConfirmSignUpInput,
  type SignInInput,
  type ResetPasswordInput,
  type ConfirmResetPasswordInput,
} from '@aws-amplify/auth';
import { User, UserRole, ResendCodeResult } from '@/types';

// Configure Amplify Auth
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
        given_name: {
          required: true,
        },
        family_name: {
          required: true,
        },
        phone_number: {
          required: false,
        },
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: false,
      },
    },
  },
});

export class RealCognitoService {
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
  ) {
    try {
      const signUpInput: SignUpInput = {
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: userData.firstName,
            family_name: userData.lastName,
            ...(userData.phoneNumber && { phone_number: userData.phoneNumber }),
            'custom:role': userData.role,
          },
        },
      };

      const { userId, isSignUpComplete, nextStep } = await amplifySignUp(signUpInput);

      return {
        success: true,
        data: {
          userSub: userId,
          user: userData,
          isSignUpComplete,
          nextStep,
        },
      };
    } catch (error: any) {
      console.error('Cognito signup error:', error);
      return {
        success: false,
        error: error.message || 'Signup failed',
      };
    }
  }

  /**
   * Confirm sign up with verification code
   */
  static async confirmSignUp(email: string, code: string) {
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

  /**
   * Sign in user
   */
  static async signIn(email: string, password: string) {
    try {
      const signInInput: SignInInput = {
        username: email,
        password,
      };

      const { isSignedIn, nextStep } = await amplifySignIn(signInInput);

      if (!isSignedIn) {
        return {
          success: false,
          error: 'Sign in incomplete',
          nextStep,
        };
      }

      // Get session with tokens
      const session = await fetchAuthSession();
      const tokens = session.tokens;

      if (!tokens) {
        throw new Error('No tokens received');
      }

      // Get user attributes
      const cognitoUser = await amplifyGetCurrentUser();

      // Extract user data from token
      const idTokenPayload = tokens.idToken?.payload;

      const userData: User = {
        id: cognitoUser.userId,
        email: (idTokenPayload?.email as string) || email,
        firstName: (idTokenPayload?.given_name as string) || '',
        lastName: (idTokenPayload?.family_name as string) || '',
        phoneNumber: idTokenPayload?.phone_number as string,
        role: (idTokenPayload?.['custom:role'] as UserRole) || 'CLIENT_USER',
        profileImageUrl: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: {
          user: userData,
          tokens: {
            accessToken: tokens.accessToken.toString(),
            idToken: tokens.idToken?.toString() || '',
            refreshToken: '', // Refresh token not directly accessible in Amplify v6
          },
        },
      };
    } catch (error: any) {
      console.error('Cognito signin error:', error);
      return {
        success: false,
        error: error.message || 'Signin failed',
      };
    }
  }

  /**
   * Sign out user
   */
  static async signOut() {
    try {
      await amplifySignOut();
      return { success: true };
    } catch (error: any) {
      console.error('Cognito signout error:', error);
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
      const cognitoUser = await amplifyGetCurrentUser();
      const session = await fetchAuthSession();
      const tokens = session.tokens;

      if (!tokens?.idToken) {
        return null;
      }

      const idTokenPayload = tokens.idToken.payload;

      const userData: User = {
        id: cognitoUser.userId,
        email: (idTokenPayload.email as string) || '',
        firstName: (idTokenPayload.given_name as string) || '',
        lastName: (idTokenPayload.family_name as string) || '',
        phoneNumber: idTokenPayload.phone_number as string,
        role: (idTokenPayload['custom:role'] as UserRole) || 'CLIENT_USER',
        profileImageUrl: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return userData;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Get current session with tokens
   */
  static async getCurrentSession() {
    try {
      const session = await fetchAuthSession();

      if (!session.tokens) {
        return null;
      }

      return {
        accessToken: session.tokens.accessToken.toString(),
        idToken: session.tokens.idToken?.toString() || '',
        refreshToken: '', // Refresh token not directly accessible in Amplify v6
      };
    } catch (error) {
      console.error('Get current session error:', error);
      return null;
    }
  }

  /**
   * Get access token for API calls
   */
  static async getAccessToken(): Promise<string | null> {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken.toString() || null;
    } catch (error) {
      console.error('Get access token error:', error);
      return null;
    }
  }

  /**
   * Forgot password
   */
  static async forgotPassword(email: string) {
    try {
      const resetInput: ResetPasswordInput = {
        username: email,
      };

      const output = await resetPassword(resetInput);

      return {
        success: true,
        data: {
          codeSent: true,
          nextStep: output.nextStep,
        },
      };
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.message || 'Forgot password failed',
      };
    }
  }

  /**
   * Reset password with code
   */
  static async forgotPasswordSubmit(email: string, code: string, newPassword: string) {
    try {
      const confirmInput: ConfirmResetPasswordInput = {
        username: email,
        confirmationCode: code,
        newPassword,
      };

      await confirmResetPassword(confirmInput);

      return {
        success: true,
        data: { passwordReset: true },
      };
    } catch (error: any) {
      console.error('Reset password error:', error);
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
      const output = await resendSignUpCode({ username: email });
      
      return {
        success: true,
        data: {
          codeSent: true,
          destination: output.destination || email,
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
}
