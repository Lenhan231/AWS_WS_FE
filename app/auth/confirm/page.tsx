'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cognito } from '@/lib/cognito';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Dumbbell,
  Shield,
  RefreshCw
} from 'lucide-react';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();

  // Get email from URL params or sessionStorage
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState(''); // Store password for auto sign-in
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize email from URL or sessionStorage
  useEffect(() => {
    const emailParam = searchParams.get('email');
    const storedEmail = typeof window !== 'undefined' 
      ? sessionStorage.getItem('pending_confirmation_email')
      : null;
    const storedPassword = typeof window !== 'undefined'
      ? sessionStorage.getItem('pending_confirmation_password')
      : null;

    setEmail(emailParam || storedEmail || '');
    setPassword(storedPassword || '');
  }, [searchParams]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (code.length === 6 && !isLoading) {
      handleConfirm();
    }
  }, [code]);

  // Error message mapping
  const getErrorMessage = (error: any): string => {
    const errorMessage = error?.message || error?.toString() || '';
    
    if (errorMessage.includes('CodeMismatch') || errorMessage.includes('Invalid')) {
      return 'Invalid confirmation code. Please check and try again.';
    }
    if (errorMessage.includes('ExpiredCode') || errorMessage.includes('expired')) {
      return 'Confirmation code expired. Please request a new one.';
    }
    if (errorMessage.includes('LimitExceeded') || errorMessage.includes('Too many')) {
      return 'Too many attempts. Please request a new code.';
    }
    if (errorMessage.includes('UserNotFound')) {
      return 'User not found. Please register first.';
    }
    if (errorMessage.includes('NotAuthorized')) {
      return 'Invalid email or password.';
    }
    if (errorMessage.includes('NetworkError') || errorMessage.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    return errorMessage || 'An error occurred. Please try again.';
  };

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
      // Step 1: Confirm sign up
      console.log('[CONFIRM] Confirming email for:', email);
      const confirmResult = await cognito.confirmSignUp(email, code);

      if (!confirmResult.success) {
        setError(getErrorMessage(confirmResult.error));
        setIsLoading(false);
        return;
      }

      console.log('[CONFIRM] Email confirmed successfully');
      setSuccessMessage('Email confirmed successfully! Signing you in...');

      // Step 2: Auto sign-in after confirmation
      // If we have password from sessionStorage, use it
      if (password) {
        console.log('[CONFIRM] Auto signing in with stored password');
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
          const expires = new Date();
          expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
          document.cookie = `auth_token=${tokens.idToken};expires=${expires.toUTCString()};path=/`;
          
          // Clear pending confirmation data
          sessionStorage.removeItem('pending_confirmation_email');
          sessionStorage.removeItem('pending_confirmation_password');
        }

        // Update auth store
        setUser(user);

        // Step 3: Register with backend
        try {
          console.log('[CONFIRM] Registering user profile in backend');
          await api.auth.register({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            role: user.role,
          });
          console.log('[CONFIRM] Backend registration successful');
        } catch (backendError) {
          console.warn('[CONFIRM] Backend registration failed, but user is authenticated');
        }

        // Redirect based on role
        setTimeout(() => {
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
        }, 1500);
      } else {
        // No password stored, redirect to login
        setSuccessMessage('Email confirmed successfully! Please login to continue.');
        setTimeout(() => router.push('/auth/login'), 2000);
      }

    } catch (error: any) {
      console.error('[CONFIRM] Confirmation error:', error);
      setError(getErrorMessage(error));
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Email address is required');
      return;
    }

    setIsResending(true);
    setError('');

    try {
      console.log('[CONFIRM] Resending confirmation code to:', email);
      const resendResult = await cognito.resendConfirmationCode(email);

      if (!resendResult.success) {
        setError(getErrorMessage(resendResult.error));
        setIsResending(false);
        return;
      }

      console.log('[CONFIRM] Confirmation code resent successfully');
      setSuccessMessage(`New code sent to ${resendResult.data?.destination || email}`);
      setResendCooldown(60); // Start 60-second cooldown
      setIsResending(false);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error: any) {
      console.error('[CONFIRM] Resend error:', error);
      setError(getErrorMessage(error));
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden py-12">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh opacity-10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary-600/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary-700/3 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md mx-auto px-4 sm:px-6 relative z-10">
        {/* Form Card */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-primary-600/20">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="relative h-16 w-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl flex items-center justify-center">
                  <Dumbbell className="text-white h-8 w-8" />
                </div>
              </div>
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary-500/30 mb-6">
              <Shield className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-400 font-bold uppercase tracking-wider">Verify Your Email</span>
            </div>

            <h2 className="text-3xl font-black text-white mb-3">
              Confirm Your <span className="text-gradient">Email</span>
            </h2>
            <p className="text-gray-400">
              We sent a confirmation code to
            </p>
            <p className="text-primary-400 font-bold mt-1">{email || 'your email'}</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-400">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Confirmation Form - Placeholder for now */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                Confirmation Code
              </label>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(value);
                  setError('');
                }}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Enter the 6-digit code from your email
              </p>
            </div>

            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading || code.length !== 6}
              className="w-full btn-primary btn-lg group"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                  <span>Confirming...</span>
                </div>
              ) : (
                <>
                  <span className="font-black tracking-wider">CONFIRM EMAIL</span>
                  <CheckCircle className="ml-3 h-5 w-5" />
                </>
              )}
            </Button>

            {/* Resend Code */}
            <div className="text-center pt-4 border-t border-dark-700/50">
              <p className="text-gray-400 mb-3 text-sm">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                onClick={handleResendCode}
                variant="outline"
                disabled={isResending || resendCooldown > 0}
                className="btn-outline"
              >
                {isResending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500 mr-2" />
                    <span>Sending...</span>
                  </div>
                ) : resendCooldown > 0 ? (
                  <span>Resend Code ({resendCooldown}s)</span>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    <span>Resend Code</span>
                  </>
                )}
              </Button>
            </div>

            {/* Back to Login */}
            <div className="text-center pt-4">
              <Link href="/auth/login" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
