
'use client';

import { Construction, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden flex items-center justify-center">
      {/* Epic Background */}
      <div className="absolute inset-0 bg-mesh opacity-20" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[150px] animate-float" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[130px] animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 text-center px-4 animate-fade-in-up">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 mb-8 shadow-neon animate-float">
          <Construction className="w-16 h-16 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
          COMING <span className="text-gradient">SOON</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
          We're working hard to bring you this feature. Stay tuned for something <span className="text-primary-400 font-bold">amazing</span>!
        </p>

        {/* Back Button */}
        <Link href="/dashboard">
          <Button className="btn-primary btn-lg group">
            <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            <span className="font-black">BACK TO DASHBOARD</span>
          </Button>
        </Link>
      </div>
    </div>

