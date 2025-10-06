'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Dumbbell,
  Star,
  Target,
  Trophy,
  Zap,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'CLIENT_USER' as const,
  });

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
      console.log('Starting registration...');

      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      });

      console.log('✅ Registration successful!');

      // Get user to determine redirect
      const { user } = useAuthStore.getState();

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
    } catch (error: any) {
      console.error('Registration failed:', error);
      const message = error?.response?.data?.message || error?.message || 'Registration failed. Please try again.';
      setErrorMessage(message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (errorMessage) setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden py-12">
      {/* Epic Background */}
      <div className="absolute inset-0 bg-mesh opacity-30" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] bg-primary-600/8 rounded-full blur-[160px] animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-primary-700/10 rounded-full blur-[140px] animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-primary-800/8 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Left Side - Epic Brand Showcase */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 animate-fade-in-up">
          {/* Brand Logo */}
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-600 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative h-20 w-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl flex items-center justify-center shadow-neon group-hover:shadow-neon-lg transition-all duration-500">
                  <Dumbbell className="text-white h-10 w-10 group-hover:rotate-180 transition-transform duration-500" />
                </div>
              </div>
              <div className="ml-6">
                <div className="flex items-baseline">
                  <span className="text-6xl font-black text-white tracking-tighter">VER</span>
                  <span className="text-6xl font-black text-gradient tracking-tighter">TEX</span>
                </div>
                <div className="text-base text-gray-400 font-bold tracking-wider uppercase">Join The Revolution</div>
              </div>
            </Link>
          </div>

          <div className="space-y-10">
            <div>
              <h1 className="text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                START YOUR
                <br />
                <span className="text-neon">TRANSFORMATION</span>
                <br />
                <span className="text-gradient">TODAY</span>
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                Join <span className="text-primary-400 font-black text-2xl">10,000+</span> warriors who have already transformed their lives with our <span className="text-primary-400 font-bold">elite fitness platform</span>.
              </p>
            </div>

            {/* Epic Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Star, number: '4.9/5', label: 'User Rating', color: 'from-yellow-600 to-yellow-800' },
                { icon: Trophy, number: '1000+', label: 'Success Stories', color: 'from-purple-600 to-purple-800' },
                { icon: Target, number: '24/7', label: 'Support', color: 'from-blue-600 to-blue-800' },
                { icon: Shield, number: '100%', label: 'Secure', color: 'from-green-600 to-green-800' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group perspective-1000 animate-fade-in-up"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="glass-card rounded-2xl p-4 text-center shadow-3d group-hover:shadow-glow border border-primary-600/20 group-hover:border-primary-600/40 transform-3d transition-all duration-500 hover:scale-110">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} mb-3 shadow-glow group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-black text-white mb-1 text-gradient">{stat.number}</div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-full max-w-md">

            {/* Form Card */}
            <div className="glass-card rounded-3xl p-8 sm:p-12 border border-primary-600/20 shadow-3d">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-green-500/50 mb-6 shadow-glow">
                  <Star className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-400 font-bold uppercase tracking-wider">Join Elite Community</span>
                </div>

                <h2 className="text-3xl font-black text-white mb-3">
                  Create Your <span className="text-gradient">Account</span>
                </h2>
                <p className="text-gray-400">
                  Start your fitness transformation journey with Vertex
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{errorMessage}</p>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500 z-10" />
                      <Input
                        type="text"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="pl-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500 z-10" />
                    <Input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="pl-12"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500 z-10" />
                    <Input
                      type="tel"
                      name="phoneNumber"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="pl-12"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                    I am a...
                  </label>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="CLIENT_USER">Fitness Enthusiast</option>
                    <option value="PT_USER">Personal Trainer</option>
                    <option value="GYM_STAFF">Gym Owner/Staff</option>
                  </Select>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500 z-10" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="pl-12 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-500 transition-colors z-10"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500 z-10" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="pl-12 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-500 transition-colors z-10"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-5 h-5 rounded border-2 border-primary-600/50 bg-dark-800/50 text-primary-600 focus:ring-primary-600 focus:ring-2 mt-0.5"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400 leading-relaxed">
                    I agree to the <Link href="/terms" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">Terms of Service</Link> and <Link href="/privacy" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">Privacy Policy</Link>
                  </label>
                </div>

                {/* Epic Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary btn-lg group"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-black tracking-wider">CREATE ACCOUNT</span>
                      <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              {/* Sign In Link */}
              <div className="text-center mt-8 pt-6 border-t border-dark-700/50">
                <p className="text-gray-400 mb-4">
                  Already have an account?
                </p>
                <Link href="/auth/login">
                  <Button variant="outline" className="btn-outline group">
                    <span className="font-bold group-hover:text-white transition-colors">Sign In Instead</span>
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
