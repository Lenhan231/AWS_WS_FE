'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/Button';
import { 
  Menu, 
  X, 
  Search, 
  User, 
  LogOut, 
  Settings, 
  Heart,
  MapPin,
  Dumbbell,
  Zap
} from 'lucide-react';

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { mobileMenuOpen, toggleMobileMenu } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    switch (user.role) {
      case 'ADMIN':
        return '/dashboard/admin';
      case 'GYM_STAFF':
        return '/dashboard/gym-staff';
      case 'PT_USER':
        return '/dashboard/pt';
      case 'CLIENT_USER':
        return '/profile';
      default:
        return '/profile';
    }
  };

  const getDashboardLabel = () => {
    if (!user) return 'Dashboard';
    if (user.role === 'CLIENT_USER') {
      return 'Profile';
    }
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-50 bg-black/95 border-b border-dark-700">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Dumbbell className="text-white h-6 w-6" />
              </div>
              <div className="ml-3 hidden sm:block">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-white">VER</span>
                  <span className="text-2xl font-bold text-primary-500">TEX</span>
                </div>
                <div className="text-xs text-gray-400 uppercase">Fitness Platform</div>
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-500" />
                <input
                  type="text"
                  className="block w-full h-10 pl-10 pr-4 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors"
                  placeholder="Search gyms, trainers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/gyms">
              <Button variant="ghost" size="sm">
                <Dumbbell className="w-4 h-4 mr-2" />
                <span className="hidden lg:inline">Gyms</span>
              </Button>
            </Link>
            <Link href="/trainers">
              <Button variant="ghost" size="sm">
                <Zap className="w-4 h-4 mr-2" />
                <span className="hidden lg:inline">Trainers</span>
              </Button>
            </Link>
            <Link href="/offers">
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                <span className="hidden lg:inline">Offers</span>
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-dark-700">
                <Link href={getDashboardLink()}>
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 lg:mr-2" />
                    <span className="hidden lg:inline">{user?.firstName || getDashboardLabel()}</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-dark-700">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="hidden lg:inline-flex">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-primary-500" />
              ) : (
                <Menu className="h-6 w-6 text-primary-500" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-dark-700 bg-dark-900 animate-slide-up">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-500" />
                <input
                  type="text"
                  className="block w-full h-10 pl-10 pr-4 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-600 transition-colors"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <nav className="space-y-1">
              <Link href="/gyms" className="block">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Dumbbell className="w-4 h-4 mr-3" />
                  Gyms
                </Button>
              </Link>
              <Link href="/trainers" className="block">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Zap className="w-4 h-4 mr-3" />
                  Trainers
                </Button>
              </Link>
              <Link href="/offers" className="block">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Heart className="w-4 h-4 mr-3" />
                  Offers
                </Button>
              </Link>
            </nav>

            {/* Mobile Auth Buttons */}
            {isAuthenticated ? (
              <div className="space-y-1 pt-3 border-t border-dark-700">
                <Link href={getDashboardLink()} className="block">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <User className="w-4 h-4 mr-3" />
                    {user?.firstName || getDashboardLabel()}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-2 pt-3 border-t border-dark-700">
                <Link href="/auth/login" className="block">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" className="block">
                  <Button className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
