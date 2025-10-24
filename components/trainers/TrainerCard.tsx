import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Star, MapPin, Clock, Award, Heart, Calendar } from 'lucide-react';
import { PersonalTrainer } from '@/types';

interface TrainerCardProps {
  trainer: PersonalTrainer;
}

export function TrainerCard({ trainer }: TrainerCardProps) {
  const getAvailabilityText = () => {
    const today = new Date().getDay();
    const todayAvailability = trainer.availability.find(a => a.dayOfWeek === today);
    
    if (!todayAvailability || !todayAvailability.isAvailable) {
      return 'Not available today';
    }
    
    return `Available today ${todayAvailability.startTime} - ${todayAvailability.endTime}`;
  };

  const getSpecialtiesText = () => {
    if (trainer.specialties.length <= 3) {
      return trainer.specialties.join(', ');
    }
    return `${trainer.specialties.slice(0, 3).join(', ')} +${trainer.specialties.length - 3} more`;
  };

  return (
    <div className="group animate-fade-in">
      <div className="bg-dark-900 border border-dark-700 rounded-lg overflow-hidden hover:border-primary-600 transition-colors duration-150">
        
        {/* Profile Section with Epic Effects */}
        <div className="relative p-8 pb-4">
          <div className="text-center">
            {/* Profile Image */}
            <div className="relative mx-auto w-24 h-24 mb-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary-600">
                <img
                  src={trainer.profileImageUrl || '/api/placeholder/200/200'}
                  alt={`${trainer.firstName} ${trainer.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Availability Status */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-dark-900 border border-green-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-green-400 font-semibold">Available</span>
                </div>
              </div>
            </div>

            {/* Name and Title */}
            <h3 className="text-xl font-bold text-white mb-1">
              {trainer.firstName} {trainer.lastName}
            </h3>
            
            <p className="text-primary-400 text-sm mb-3">
              {trainer.specialties[0]} Specialist
            </p>

            {/* Experience Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-dark-800 border border-dark-700 mb-4">
              <Award className="w-4 h-4 text-primary-500" />
              <span className="text-xs text-primary-400">
                {trainer.experience} Years Experience
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Rating */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${
                    i < Math.floor(trainer.averageRating || 0) 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-white font-semibold">{trainer.averageRating}</span>
            <span className="text-gray-500 text-sm">({trainer.totalRatings})</span>
          </div>

          {/* Bio */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {trainer.bio}
          </p>

          {/* Specialties Pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {trainer.specialties.slice(0, 3).map((specialty) => (
              <span 
                key={specialty}
                className="text-xs px-2 py-1 rounded bg-primary-600/20 text-primary-400 border border-primary-600"
              >
                {specialty}
              </span>
            ))}
            {trainer.specialties.length > 3 && (
              <span className="text-xs px-2 py-1 rounded bg-dark-800 text-gray-400 border border-dark-700">
                +{trainer.specialties.length - 3}
              </span>
            )}
          </div>

          {/* Certifications */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Award className="h-4 w-4 text-primary-500" />
              <span className="text-sm">{trainer.certifications.length} certifications</span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500">
                ${trainer.hourlyRate}
              </div>
              <div className="text-xs text-gray-500">per hour</div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-dark-800 border border-dark-700 p-2 rounded-lg hover:border-primary-600 transition-colors">
                <Heart className="h-5 w-5 text-primary-500 mx-auto" />
              </button>
              
              <Link href={`/trainers/${trainer.id}`} className="flex-[3]">
                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>View Profile</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

