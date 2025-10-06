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
      {/* Epic Background with Multiple Layers */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/50 via-black to-primary-950/30" />
        <div className="absolute inset-0 bg-mesh opacity-40" />

        {/* Animated geometric shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-10 left-10 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[150px] animate-float opacity-60" />
          <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-primary-700/15 rounded-full blur-[120px] animate-float opacity-80" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-primary-800/20 rounded-full blur-[100px] animate-float opacity-40" style={{ animationDelay: '2s' }} />
        </div>

        {/* 3D Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(220, 38, 38, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220, 38, 38, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(1500px) rotateX(45deg)',
          transformOrigin: 'center center'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-12">

          {/* Epic Badge */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full glass-card border-2 border-primary-600/50 shadow-neon">
              <div className="relative">
                <Zap className="w-6 h-6 text-primary-500 animate-glow-pulse" />
                <div className="absolute inset-0 blur-xl bg-primary-500 opacity-50" />
              </div>
              <span className="text-base font-black text-white uppercase tracking-wider">
                Join The <span className="text-gradient">Revolution</span>
              </span>
              <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Epic Title with 3D Effect */}
          <div className="perspective-2000 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-center leading-none tracking-tighter mb-8">
              <span className="block text-white">READY TO</span>
              <span className="block">
                <span className="text-gradient">DOMINATE</span>
              </span>
              <span className="block text-white">YOUR FITNESS</span>
              <span className="block">
                <span className="text-neon animate-glow">GOALS?</span>
              </span>
            </h2>
          </div>

          {/* Subtitle with Stats */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-2xl md:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Join <span className="text-primary-400 font-black text-4xl">10,000+</span> warriors who have already started their transformation journey with <span className="text-gradient font-black text-3xl">Vertex</span>
            </p>
          </div>

          {/* Epic CTA Buttons */}
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={handleStartJourney}
              className="inline-flex items-center justify-center btn-primary btn-lg group px-16 py-6 text-xl shadow-neon-lg relative overflow-hidden transform-3d hover:scale-105 hover:-translate-y-2"
            >
              {/* Animated background layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <Target className="w-7 h-7 mr-4 relative z-10 group-hover:rotate-12 transition-transform duration-500" />
              <span className="relative z-10 font-black tracking-wider">
                {isAuthenticated ? (user?.role === 'CLIENT_USER' ? 'EXPLORE MORE' : 'GO TO DASHBOARD') : 'START YOUR JOURNEY'}
              </span>
              <ArrowRight className="w-7 h-7 ml-4 relative z-10 group-hover:translate-x-3 transition-transform duration-300" />

              {/* Epic shine effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transform translate-x-[-300%] group-hover:translate-x-[300%] transition-transform duration-1200" />
            </button>

            <Link href="/offers">
              <button className="inline-flex items-center justify-center btn-outline btn-lg group px-16 py-6 text-xl relative overflow-hidden transform-3d hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex items-center">
                  <div className="relative mr-4">
                    <Trophy className="w-7 h-7 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500" />
                    <div className="absolute inset-0 blur-lg bg-primary-500 opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                  </div>
                  <span className="font-black tracking-wider group-hover:text-white transition-colors">EXPLORE OFFERS</span>
                  <ArrowRight className="w-7 h-7 ml-4 group-hover:translate-x-3 transition-transform duration-300" />
                </div>
              </button>
            </Link>
          </div>

          {/* Stats Grid with 3D Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: Users, number: '10,000+', label: 'Active Members', gradient: 'from-blue-600 to-blue-800' },
              { icon: TrendingUp, number: '4.9/5', label: 'Average Rating', gradient: 'from-green-600 to-green-800' },
              { icon: Award, number: '100%', label: 'Verified Partners', gradient: 'from-purple-600 to-purple-800' }
            ].map((stat, index) => (
              <div
                key={index}
                className="group perspective-1000"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="relative transform-3d transition-all duration-500 hover:scale-110 hover:-translate-y-4">
                  <div className="glass-card rounded-2xl p-8 border border-primary-600/20 group-hover:border-primary-600/40 shadow-3d group-hover:shadow-neon text-center">
                    <div className="absolute inset-0 bg-primary-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-4xl font-black text-white mb-2 text-gradient">{stat.number}</h3>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">{stat.label}</p>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Epic bottom glow */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary-600 to-transparent animate-glow-pulse" />
    </section>
  );
}
