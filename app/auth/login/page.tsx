'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Dumbbell,
  Zap,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const result = await login(formData.email, formData.password);

      // Check if confirmation is needed
      if (result?.needsConfirmation) {
        console.log('[LOGIN] User not confirmed, redirecting to confirmation page');
        router.push(`/auth/confirm?email=${encodeURIComponent(formData.email)}`);
        return;
      }

      // Get user info after login
      const { user } = useAuthStore.getState();
      console.log('✅ Login successful! User role:', user?.role);

      // Redirect based on user role
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
    } catch (error) {
      console.error('Login failed:', error);
      const message = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      setErrorMessage(message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (errorMessage) setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Epic Background */}
      <div className="absolute inset-0 bg-mesh opacity-30" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-600/8 rounded-full blur-[150px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary-700/10 rounded-full blur-[140px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Left Side - Brand & Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 animate-fade-in-up">
          {/* Brand Logo */}
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-600 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative h-16 w-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl flex items-center justify-center shadow-neon group-hover:shadow-neon-lg transition-all duration-500">
                  <Dumbbell className="text-white h-8 w-8 group-hover:rotate-180 transition-transform duration-500" />
                </div>
              </div>
              <div className="ml-4">
                <div className="flex items-baseline">
                  <span className="text-5xl font-black text-white tracking-tighter">VER</span>
                  <span className="text-5xl font-black text-gradient tracking-tighter">TEX</span>
                </div>
                <div className="text-sm text-gray-400 font-bold tracking-wider uppercase">Fitness Revolution</div>
              </div>
            </Link>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                Welcome Back to Your
                <br />
                <span className="text-gradient">FITNESS JOURNEY</span>
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                Sign in to access your personalized dashboard and continue your transformation with <span className="text-primary-400 font-bold">elite trainers</span> and <span className="text-primary-400 font-bold">premium facilities</span>.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {[
                { icon: CheckCircle, text: 'Access to 1000+ premium gyms' },
                { icon: CheckCircle, text: 'Connect with elite personal trainers' },
                { icon: CheckCircle, text: 'Exclusive member deals & offers' },
                { icon: CheckCircle, text: 'Track your fitness progress' }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 animate-fade-in-up"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-glow">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-300 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-full max-w-md">

            {/* Form Card */}
            <div className="glass-card rounded-3xl p-8 sm:p-12 border border-primary-600/20 shadow-3d">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary-600/30 mb-6">
                  <Shield className="w-4 h-4 text-primary-500" />
                  <span className="text-sm text-primary-400 font-bold uppercase tracking-wider">Secure Login</span>
                </div>

                <h2 className="text-3xl font-black text-white mb-3">
                  Welcome <span className="text-gradient">Back</span>
                </h2>
                <p className="text-gray-400">
                  Sign in to your Vertex account to continue your fitness journey
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{errorMessage}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-12"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-12 pr-12"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary btn-lg group"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-black tracking-wider">LOGIN</span>
                      <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center mt-8 pt-6 border-t border-dark-700/50">
                <p className="text-gray-400 mb-4">
                  Don't have an account yet?
                </p>
                <Link href="/auth/register">
                  <Button variant="outline" className="btn-outline group">
                    <span className="font-bold group-hover:text-white transition-colors">Create Account</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
