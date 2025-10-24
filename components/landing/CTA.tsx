'use client';

import { Button } from '@/components/ui/Button';
import { ArrowRight, Users, Target, Shield, Zap, TrendingUp, Award, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export function CTA() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const handleStartJourney = () => {
    if (isAuthenticated && user) {
      if (user.role === 'CLIENT_USER') {
        router.push('/');
      } else {
        router.push('/dashboard');
      }
    } else {
      router.push('/auth/register');
    }
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/50 via-black to-primary-950/30" />
        <div className="absolute inset-0 bg-mesh opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-12">

          {/* Badge */}
          <div>
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full glass-card border-2 border-primary-600/50">
              <Zap className="w-6 h-6 text-primary-500" />
              <span className="text-base font-black text-white uppercase tracking-wider">
                Join The <span className="text-gradient">Revolution</span>
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-center leading-none tracking-tighter mb-8">
              <span className="block text-white">READY TO</span>
              <span className="block">
                <span className="text-gradient">DOMINATE</span>
              </span>
              <span className="block text-white">YOUR FITNESS</span>
              <span className="block">
                <span className="text-neon">GOALS?</span>
              </span>
            </h2>
          </div>

          {/* Subtitle */}
          <div>
            <p className="text-2xl md:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Join <span className="text-primary-400 font-black text-4xl">10,000+</span> warriors who have already started their transformation journey with <span className="text-gradient font-black text-3xl">Vertex</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
            <button
              onClick={handleStartJourney}
              className="inline-flex items-center justify-center btn-primary btn-lg group px-16 py-6 text-xl"
            >
              <Target className="w-7 h-7 mr-4" />
              <span className="font-black tracking-wider">
                {isAuthenticated ? (user?.role === 'CLIENT_USER' ? 'EXPLORE MORE' : 'GO TO DASHBOARD') : 'START YOUR JOURNEY'}
              </span>
              <ArrowRight className="w-7 h-7 ml-4" />
            </button>

            <Link href="/offers">
              <button className="inline-flex items-center justify-center btn-outline btn-lg group px-16 py-6 text-xl">
                <Trophy className="w-7 h-7 mr-4" />
                <span className="font-black tracking-wider">EXPLORE OFFERS</span>
                <ArrowRight className="w-7 h-7 ml-4" />
              </button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {[
              { icon: Users, number: '10,000+', label: 'Active Members', gradient: 'from-blue-600 to-blue-800' },
              { icon: TrendingUp, number: '4.9/5', label: 'Average Rating', gradient: 'from-green-600 to-green-800' },
              { icon: Award, number: '100%', label: 'Verified Partners', gradient: 'from-purple-600 to-purple-800' }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="glass-card rounded-2xl p-8 border border-primary-600/20 group-hover:border-primary-600/40 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-6`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-4xl font-black text-white mb-2 text-gradient">{stat.number}</h3>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary-600 to-transparent" />
    </section>
  );
}
