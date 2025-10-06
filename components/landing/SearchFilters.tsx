'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { NearbySearch } from '@/components/search/NearbySearch';
import {
  MapPin, 
  DollarSign, 
  Star, 
  Clock, 
  Filter,
  X,
  Search,
  Navigation
} from 'lucide-react';

interface SearchFiltersProps {
  className?: string;
}

export function SearchFilters({ className = '' }: SearchFiltersProps) {
  const router = useRouter();
  const [showNearbySearch, setShowNearbySearch] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    radius: '10',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    availability: {
      dayOfWeek: '',
      startTime: '',
      endTime: '',
    },
    amenities: [] as string[],
    specialties: [] as string[],
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAvailabilityChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [key]: value
      }
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFilters(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        if (key === 'availability') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (subValue && subValue !== '') {
              params.set(`availability.${subKey}`, String(subValue));
            }
          });
        } else if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(','));
        } else if (!Array.isArray(value) && typeof value !== 'object') {
          params.set(key, String(value));
        }
      }
    });

    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      radius: '10',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      availability: {
        dayOfWeek: '',
        startTime: '',
        endTime: '',
      },
      amenities: [],
      specialties: [],
    });
  };

  const amenityOptions = [
    'Parking',
    'Locker Rooms',
    'Showers',
    'Sauna',
    'Pool',
    'Group Classes',
    'Personal Training',
    'Cardio Equipment',
    'Weight Training',
    'Yoga Studio',
  ];

  const specialtyOptions = [
    'Weight Loss',
    'Muscle Building',
    'Cardio Training',
    'Yoga',
    'Pilates',
    'CrossFit',
    'Boxing',
    'Swimming',
    'Dance',
    'Rehabilitation',
  ];

  const dayOptions = [
    { value: '', label: 'Any day' },
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
  ];

  return (
    <section className={`py-20 bg-gradient-to-b from-black via-dark-900 to-black relative ${className}`}>
      {/* Background with 3D Grid */}
      <div className="absolute inset-0 bg-mesh opacity-40" />
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(220, 38, 38, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(220, 38, 38, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        transform: 'perspective(1000px) rotateX(20deg)',
        transformOrigin: 'center top'
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Find Your Perfect <span className="text-gradient">Match</span>
          </h2>
          <p className="text-xl text-gray-400">
            Search for gyms, trainers, and offers near you
          </p>
        </div>

        {/* Toggle Nearby Search */}
        <div className="mb-8 flex justify-center">
          <Button
            onClick={() => setShowNearbySearch(!showNearbySearch)}
            className="btn-outline group"
          >
            <Navigation className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            {showNearbySearch ? 'Hide' : 'Show'} Nearby Search
          </Button>
        </div>

        {/* Nearby Search Component */}
        {showNearbySearch && (
          <div className="mb-8 animate-fade-in">
            <NearbySearch onResultsFound={(results) => console.log('Found results:', results)} />
          </div>
        )}

        {/* Regular Search Filters */}
        <div className="glass-card rounded-3xl p-8 border border-primary-600/20 shadow-3d animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Glowing border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 rounded-3xl opacity-20 animate-border-flow" />

          {/* Basic Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="group">
              <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">
                <MapPin className="inline w-4 h-4 mr-2 text-primary-500" />
                Location
              </label>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl opacity-0 group-hover:opacity-30 blur transition duration-300" />
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500" />
                  <input
                    type="text"
                    placeholder="City or ZIP code"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="input pl-12"
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">
                Radius
              </label>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl opacity-0 group-hover:opacity-30 blur transition duration-300" />
                <select
                  value={filters.radius}
                  onChange={(e) => handleFilterChange('radius', e.target.value)}
                  className="input appearance-none cursor-pointer"
                >
                  <option value="5">5 miles</option>
                  <option value="10">10 miles</option>
                  <option value="25">25 miles</option>
                  <option value="50">50 miles</option>
                </select>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">
                <DollarSign className="inline w-4 h-4 mr-2 text-primary-500" />
                Min Price
              </label>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl opacity-0 group-hover:opacity-30 blur transition duration-300" />
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500" />
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input pl-12"
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">
                <DollarSign className="inline w-4 h-4 mr-2 text-primary-500" />
                Max Price
              </label>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl opacity-0 group-hover:opacity-30 blur transition duration-300" />
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500" />
                  <input
                    type="number"
                    placeholder="1000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input pl-12"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex justify-center mb-8">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="btn-outline group px-8 py-4 text-base"
            >
              <Filter className="mr-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
              <div className="ml-3 w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            </Button>
          </div>

          {/* Advanced Filters with 3D Animation */}
          {showAdvanced && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Rating Filter */}
              <div className="group">
                <label className="block text-lg font-bold text-white mb-4 uppercase tracking-wider">
                  <Star className="inline w-5 h-5 mr-2 text-yellow-500" />
                  Minimum Rating
                </label>
                <div className="flex items-center space-x-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange('minRating', rating.toString())}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                        filters.minRating === rating.toString()
                          ? 'glass-card border border-primary-600 shadow-glow text-primary-400'
                          : 'glass border border-dark-700/50 text-gray-400 hover:border-primary-600/50 hover:text-primary-400'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                      <span className="font-bold">{rating}+</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-lg font-bold text-white mb-4 uppercase tracking-wider">
                  Availability
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    value={filters.availability.dayOfWeek}
                    onChange={(e) => handleAvailabilityChange('dayOfWeek', e.target.value)}
                    className="glass-card"
                  >
                    {dayOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500" />
                    <Input
                      type="time"
                      placeholder="Start time"
                      value={filters.availability.startTime}
                      onChange={(e) => handleAvailabilityChange('startTime', e.target.value)}
                      className="input pl-10 glass-card"
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500" />
                    <Input
                      type="time"
                      placeholder="End time"
                      value={filters.availability.endTime}
                      onChange={(e) => handleAvailabilityChange('endTime', e.target.value)}
                      className="input pl-10 glass-card"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities Filter with 3D Cards */}
              <div>
                <label className="block text-lg font-bold text-white mb-4 uppercase tracking-wider">
                  Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {amenityOptions.map((amenity, index) => (
                    <div
                      key={amenity}
                      className="group perspective-1000"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <label className="block cursor-pointer transform-3d transition-all duration-500 hover:scale-105">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="sr-only"
                        />
                        <div className={`glass-card p-4 rounded-xl border-2 transition-all duration-300 ${
                          filters.amenities.includes(amenity)
                            ? 'border-primary-600 shadow-glow text-primary-400 bg-primary-600/10'
                            : 'border-dark-700/50 text-gray-400 hover:border-primary-600/50 hover:text-primary-400'
                        }`}>
                          <div className="text-center">
                            <div className="text-sm font-bold uppercase tracking-wider">{amenity}</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specialties Filter */}
              <div>
                <label className="block text-lg font-bold text-white mb-4 uppercase tracking-wider">
                  Specialties
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {specialtyOptions.map((specialty, index) => (
                    <div
                      key={specialty}
                      className="group perspective-1000"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <label className={`block cursor-pointer transform-3d transition-all duration-500 hover:scale-105 ${
                        filters.specialties.includes(specialty) ? 'hover:rotate-y-12' : 'hover:rotate-y-6'
                      }`}>
                        <input
                          type="checkbox"
                          checked={filters.specialties.includes(specialty)}
                          onChange={() => handleSpecialtyToggle(specialty)}
                          className="sr-only"
                        />
                        <div className={`glass-card p-4 rounded-xl border-2 transition-all duration-300 ${
                          filters.specialties.includes(specialty)
                            ? 'border-primary-600 shadow-glow text-primary-400 bg-primary-600/10'
                            : 'border-dark-700/50 text-gray-400 hover:border-primary-600/50 hover:text-primary-400'
                        }`}>
                          <div className="text-center">
                            <div className="text-sm font-bold uppercase tracking-wider">{specialty}</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons with 3D Effects */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <Button
              onClick={handleSearch}
              className="btn-primary btn-lg group px-12 py-4 text-lg shadow-neon-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Search className="w-6 h-6 mr-3 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative z-10 font-black">SEARCH NOW</span>
              <div className="w-6 h-6 ml-3 relative z-10">
                <div className="absolute inset-0 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                <Search className="w-6 h-6 text-primary-700 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Button>

            <Button
              onClick={clearFilters}
              variant="outline"
              className="btn-outline btn-lg group px-12 py-4 text-lg"
            >
              <X className="w-6 h-6 mr-3 group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-bold">Clear Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
