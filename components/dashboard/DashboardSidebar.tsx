'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  Building2,
  Calendar,
  Settings,
  BarChart3,
  Shield,
  UserCheck,
  FileText,
  LogOut,
  Menu,
  X,
  Dumbbell,
  ChevronRight,
} from 'lucide-react';

const navigation = {
  CLIENT_USER: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Bookings', href: '/dashboard/bookings', icon: Calendar },
    { name: 'Favorites', href: '/dashboard/favorites', icon: Users },
    { name: 'Profile', href: '/dashboard/profile', icon: Settings },
  ],
  PT_USER: [
    { name: 'Dashboard', href: '/dashboard/pt', icon: Home },
    { name: 'My Profile', href: '/dashboard/pt/profile', icon: UserCheck },
    { name: 'Availability', href: '/dashboard/pt/availability', icon: Calendar },
    { name: 'My Offers', href: '/dashboard/pt/offers', icon: FileText },
    { name: 'Bookings', href: '/dashboard/pt/bookings', icon: Calendar },
    { name: 'Clients', href: '/dashboard/pt/clients', icon: Users },
    { name: 'Settings', href: '/dashboard/pt/settings', icon: Settings },
  ],
  GYM_STAFF: [
    { name: 'Dashboard', href: '/dashboard/gym-staff', icon: Home },
    { name: 'Gym Management', href: '/dashboard/gym-staff/gym', icon: Building2 },
    { name: 'Trainer Approvals', href: '/dashboard/gym-staff/trainers', icon: UserCheck },
    { name: 'Offers', href: '/dashboard/gym-staff/offers', icon: FileText },
    { name: 'Bookings', href: '/dashboard/gym-staff/bookings', icon: Calendar },
    { name: 'Analytics', href: '/dashboard/gym-staff/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/gym-staff/settings', icon: Settings },
  ],
  ADMIN: [
    { name: 'Dashboard', href: '/dashboard/admin', icon: Home },
    { name: 'Users', href: '/dashboard/admin/users', icon: Users },
    { name: 'Gyms', href: '/dashboard/admin/gyms', icon: Building2 },
    { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ],
};

export function DashboardSidebar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const userNavigation = user ? navigation[user.role] : [];

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'from-red-600 to-red-800';
      case 'GYM_STAFF':
        return 'from-blue-600 to-blue-800';
      case 'PT_USER':
        return 'from-primary-600 to-primary-800';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-gray-900 to-black border-r border-primary-600/30">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-black/50 backdrop-blur hover:bg-primary-600/20 transition-all"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-shrink-0 flex items-center px-6 py-6 border-b border-primary-600/30">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-600 blur-lg opacity-50" />
                <div className={`relative h-10 w-10 bg-gradient-to-br ${getRoleBadgeColor()} rounded-xl flex items-center justify-center shadow-neon`}>
                  <Dumbbell className="text-white h-5 w-5" />
                </div>
              </div>
              <div className="ml-3">
                <div className="flex items-baseline">
                  <span className="text-xl font-black text-white">VER</span>
                  <span className="text-xl font-black text-gradient">TEX</span>
                </div>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {userNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-neon'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className={cn('h-5 w-5 mr-3 transition-transform', isActive && 'scale-110')} />
                    <span className="uppercase tracking-wider">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex-shrink-0 border-t border-primary-600/30 p-4">
            <div className="glass-card rounded-xl p-4 border border-primary-600/30">
              <div className="flex items-center">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${getRoleBadgeColor()} flex items-center justify-center shadow-neon`}>
                  <span className="text-lg font-black text-white">
                    {user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                  <p className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                    {user?.role?.replace('_', ' ')}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-red-600/20 transition-all"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:fixed lg:inset-y-0 lg:z-50">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 via-black to-gray-900 border-r border-primary-600/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-mesh opacity-10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex-shrink-0 flex items-center px-6 py-6 border-b border-primary-600/30">
                <Link href="/" className="flex items-center group">
                  <div className="relative">
                    <div className={`relative h-10 w-10 bg-gradient-to-br ${getRoleBadgeColor()} rounded-xl flex items-center justify-center`}>
                      <Dumbbell className="text-white h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="flex items-baseline">
                      <span className="text-xl font-black text-white">VER</span>
                      <span className="text-xl font-black text-gradient">TEX</span>
                    </div>
                  </div>
                </Link>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600/50 scrollbar-track-transparent">
                {userNavigation.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-colors',
                        isActive
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        <span className="uppercase tracking-wider">{item.name}</span>
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex-shrink-0 border-t border-primary-600/30 p-4">
                <div className="glass-card rounded-xl p-4 border border-primary-600/30">
                  <div className="flex items-center">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${getRoleBadgeColor()} flex items-center justify-center`}>
                      <span className="text-lg font-black text-white">
                        {user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                      <p className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                        {user?.role?.replace('_', ' ')}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-red-600/20 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 rounded-xl glass-card border border-primary-600/30 text-white hover:bg-primary-600/20 transition-all shadow-neon"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}
