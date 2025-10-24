import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  MapPin, 
  Clock, 
  Tag, 
  Heart, 
  Share2, 
  Calendar,
  Building2,
  User,
  ArrowRight
} from 'lucide-react';
import { Offer } from '@/types';

interface OfferCardProps {
  offer: Offer;
  discount?: number;
  savings?: number;
}

export function OfferCard({ offer, discount = 0, savings = 0 }: OfferCardProps) {
  const images = offer.imageUrls ? offer.imageUrls.split(',') : [];
  const isGymOffer = offer.offerType === 'GYM_OFFER';

  return (
    <div className="group animate-fade-in">
      <div className="bg-dark-900 border border-dark-700 rounded-lg overflow-hidden hover:border-primary-600 transition-colors duration-150">

        {/* Discount Badge - Top Left */}
        <div className="absolute top-3 left-3 z-30">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-600 text-white">
            <Tag className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {discount}% OFF
            </span>
          </div>
        </div>

        {/* Timer Badge - Top Right */}
        <div className="absolute top-3 right-3 z-30">
          <div className="bg-dark-900 border border-dark-700 px-3 py-1 rounded-lg">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-yellow-400 font-semibold">2 Days Left</span>
            </div>
          </div>
        </div>

        {/* SAVINGS Badge - Bottom Right over image */}
        {savings > 0 && (
          <div className="absolute bottom-3 right-3 z-30">
            <div className="bg-dark-900 border border-green-500 px-3 py-2 rounded-lg">
              <div className="text-center">
                <div className="text-sm font-semibold text-green-400">SAVE</div>
                <div className="text-lg font-bold text-green-500">${savings}</div>
              </div>
            </div>
          </div>
        )}

        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={images[0] || '/api/placeholder/400/300'}
            alt={offer.title}
            className="w-full h-full object-cover"
          />

          {/* Offer Type Badge */}
          <div className="absolute bottom-3 left-3 z-20">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-dark-900 border border-dark-700">
              {isGymOffer ? (
                <Building2 className="w-3 h-3 text-primary-500" />
              ) : (
                <User className="w-3 h-3 text-primary-500" />
              )}
              <span className="text-xs text-primary-400 font-semibold">
                {isGymOffer ? 'Gym Deal' : 'Personal Training'}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Location */}
          <div className="flex items-center text-gray-400 mb-2">
            <MapPin className="h-4 w-4 mr-2 text-primary-500" />
            <span className="text-sm">
              {isGymOffer ? 'Elite Fitness Center' : 'Professional Trainer'} • New York, NY
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-3">
            {offer.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {offer.description}
          </p>

          {/* Specialties for PT offers */}
          {!isGymOffer && (
            <div className="flex flex-wrap gap-2 mb-4">
              {['Weight Training', 'Cardio'].map((specialty) => (
                <span
                  key={specialty}
                  className="text-xs px-2 py-1 rounded bg-primary-600/20 text-primary-400 border border-primary-600"
                >
                  {specialty}
                </span>
              ))}
            </div>
          )}

          {/* Price Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary-500">
                    ${offer.price}
                  </span>
                  <span className="text-base text-gray-500 line-through">
                    ${Math.round(offer.price * 1.5)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {offer.durationDescription}
                </div>
              </div>

              {savings > 0 && (
                <div className="text-right">
                  <div className="text-lg font-bold text-green-500">
                    SAVE ${savings}
                  </div>
                  <div className="text-xs text-green-400">
                    Limited Time
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Button className="w-full">
              <Tag className="w-4 h-4 mr-2" />
              <span>Claim This Deal</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Urgency Indicator */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-600/20 border border-red-600 text-red-400">
                <Clock className="w-3 h-3" />
                <span className="text-xs font-semibold">
                  Hurry! Only 2 days left
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

