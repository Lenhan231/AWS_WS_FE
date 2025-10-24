'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Search, Dumbbell, MapPin, TrendingUp, Zap, ArrowRight, Star, Users } from 'lucide-react';

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-5rem)] sm:min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32">
        <div className={`text-center space-y-4 sm:space-y-6 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

          {/* Simplified Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-dark-900 border border-primary-600 animate-fade-in">
            <Zap className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-semibold text-white">
              #1 <span className="text-primary-500">Fitness Platform</span>
            </span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white animate-fade-in-up">
            TRANSFORM YOUR
            <br />
            <span className="text-primary-500">BODY & MIND</span>
          </h1>

          {/* Subtitle */}
          <div className="max-w-3xl mx-auto animate-fade-in-up px-4">
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-3">
              Discover <span className="text-primary-400 font-semibold">premium gyms</span> and <span className="text-primary-400 font-semibold">elite personal trainers</span> near you.
            </p>
            <p className="text-sm sm:text-base text-gray-400">
              Start your fitness journey today with <span className="text-primary-500 font-bold">Vertex</span>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 py-6 sm:py-8 animate-fade-in px-4">
            {[
              { icon: Dumbbell, number: '1000+', label: 'Premium Gyms' },
              { icon: Users, number: '500+', label: 'Elite Trainers' },
              { icon: Star, number: '10K+', label: 'Active Members' }
            ].map((stat, index) => (
              <div key={index} className="bg-dark-900 border border-dark-700 rounded-lg px-4 sm:px-6 py-3 sm:py-4 hover:border-primary-600 transition-colors min-w-[100px] sm:min-w-[120px]">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-600/20 mb-2">
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-xs text-gray-400 uppercase">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto animate-fade-in px-4">
            <div className="bg-dark-900 border border-dark-700 rounded-lg p-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Enter your location..."
                    className="w-full h-10 sm:h-12 pl-10 sm:pl-12 pr-3 sm:pr-4 bg-dark-800 border border-dark-700 rounded-lg text-sm sm:text-base text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-600 transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button size="lg" className="px-6 sm:px-8 w-full sm:w-auto">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span>Search Now</span>
                </Button>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-6 sm:pt-8 animate-fade-in px-4">
            <Link href="/gyms" className="w-full sm:w-auto">
              <Button size="lg" className="px-6 sm:px-8 w-full sm:w-auto">
                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span>Find Gyms</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>

            <Link href="/trainers" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="px-6 sm:px-8 w-full sm:w-auto">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span>Find Trainers</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}

