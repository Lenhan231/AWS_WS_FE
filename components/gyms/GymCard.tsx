import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Star, MapPin, Clock, Phone, Globe, Heart, Building2, ArrowRight } from 'lucide-react';
import { Gym } from '@/types';

interface GymCardProps {
  gym: Gym;
  viewMode?: 'grid' | 'list';
}

export function GymCard({ gym, viewMode }: GymCardProps) {
  // Use placeholder images since Gym type doesn't have imageUrls
  const defaultImage = '/api/placeholder/400/300';
  const images = [defaultImage];

  if (viewMode === 'list') {
    return (
      <div className="group animate-fade-in">
        <div className="bg-dark-900 border border-dark-700 rounded-lg overflow-hidden hover:border-primary-600 transition-colors duration-150">

          <div className="flex flex-col md:flex-row">
            {/* Image Section with Parallax */}
            <div className="md:w-80 flex-shrink-0 relative overflow-hidden">
              <div className="relative h-64 md:h-full">
                <img
                  src={images[0] || '/api/placeholder/400/300'}
                  alt={gym.name}
                  className="w-full h-full object-cover"
                />

                {/* Rating Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-dark-900 border border-dark-700 px-3 py-1 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-yellow-400 font-semibold">{gym.averageRating}</span>
                      <span className="text-gray-400 text-xs">({gym.totalRatings})</span>
                    </div>
                  </div>
                </div>

                {/* Heart Button */}
                <div className="absolute top-4 right-4 z-20">
                  <button className="w-10 h-10 bg-dark-900 border border-dark-700 rounded-lg flex items-center justify-center hover:border-primary-600 transition-colors">
                    <Heart className="w-5 h-5 text-primary-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-8 relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {gym.name}
                  </h3>
                  <div className="flex items-center text-gray-400 mb-3">
                    <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                    <span className="text-sm">{gym.address}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-500">
                    $89
                  </div>
                  <div className="text-xs text-gray-500">per month</div>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                {gym.description}
              </p>

              {/* Amenities Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {['Parking', 'Locker Rooms', 'Showers', 'Sauna'].map((amenity) => (
                  <span
                    key={amenity}
                    className="text-xs px-2 py-1 rounded bg-primary-600/20 text-primary-400 border border-primary-600"
                  >
                    {amenity}
                  </span>
                ))}
                <span className="text-xs px-2 py-1 rounded bg-dark-800 text-gray-400 border border-dark-700">
                  +5 more
                </span>
              </div>

              {/* CTA Button */}
              <Link href={`/gyms/${gym.id}`}>
                <Button>
                  <Building2 className="w-4 h-4 mr-2" />
                  <span>View Details</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="group animate-fade-in">
      <div className="bg-dark-900 border border-dark-700 rounded-lg overflow-hidden hover:border-primary-600 transition-colors duration-150">

        {/* Image with Epic Effects */}
        <div className="relative overflow-hidden">
          <div className="aspect-w-16 aspect-h-12 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img
              src={images[0] || '/api/placeholder/400/300'}
              alt={gym.name}
              className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* Floating Rating Badge */}
          <div className="absolute top-6 left-6 z-20">
            <div className="glass-card px-4 py-2 rounded-xl border border-yellow-500/50 shadow-glow">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-yellow-400 font-black">{gym.averageRating}</span>
                <span className="text-gray-400 text-xs">({gym.totalRatings})</span>
              </div>
            </div>
          </div>

          {/* Heart Button */}
          <div className="absolute top-6 right-6 z-20">
            <button className="w-12 h-12 glass-card rounded-xl flex items-center justify-center border border-primary-600/30 hover:border-primary-600 hover:shadow-glow transition-all duration-300 group/heart">
              <Heart className="w-5 h-5 text-primary-500 group-hover/heart:scale-125 group-hover/heart:text-primary-400 transition-all duration-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-8">
          <h3 className="text-2xl font-black text-white mb-3 group-hover:text-gradient transition-all duration-300">
            {gym.name}
          </h3>

          <div className="flex items-center text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
            <MapPin className="h-4 w-4 mr-2 text-primary-500" />
            <span className="text-sm font-medium">{gym.address}</span>
          </div>

          <p className="text-gray-500 text-sm mb-6 line-clamp-3 group-hover:text-gray-400 transition-colors">
            {gym.description}
          </p>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['Parking', 'Showers', 'Sauna'].map((amenity, i) => (
              <span
                key={amenity}
                className="text-xs px-3 py-1 rounded-full bg-primary-600/10 text-primary-400 border border-primary-600/30 font-bold uppercase tracking-wider hover:bg-primary-600/20 hover:scale-110 transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {amenity}
              </span>
            ))}
            <span className="text-xs px-3 py-1 rounded-full bg-dark-700/50 text-gray-400 border border-dark-600 font-bold">
              +6
            </span>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-black text-gradient">
                $89
              </div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">per month</div>
            </div>

            <Link href={`/gyms/${gym.id}`}>
              <Button className="btn-primary shadow-glow group/btn relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 font-bold">VIEW DETAILS</span>
                <ArrowRight className="w-4 h-4 ml-2 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
