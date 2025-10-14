'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import type {
  NearbyGymResult,
  NearbyPTResult,
  NearbySearchParams,
  NearbySearchResponse,
  NearbySearchResult,
} from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { MapPin, Navigation, Loader, Search, Star, Phone, Mail, Globe, Award, Briefcase, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface NearbySearchProps {
  onResultsFound?: (results: NearbySearchResult[]) => void;
}

export function NearbySearch({ onResultsFound }: NearbySearchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchData, setSearchData] = useState<NearbySearchResponse | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [searchParams, setSearchParams] = useState({
    address: '',
    radius: 5,
    type: '' as '' | 'gym' | 'pt',
    page: 0,
    size: 20,
  });

  // Validate coordinates
  const validateCoordinates = (lat: number, lon: number): boolean => {
    if (lat < -90 || lat > 90) {
      setError('Invalid latitude. Must be between -90 and 90');
      return false;
    }
    if (lon < -180 || lon > 180) {
      setError('Invalid longitude. Must be between -180 and 180');
      return false;
    }
    return true;
  };

  // Validate radius
  const validateRadius = (radius: number): boolean => {
    if (radius <= 0 || radius > 100) {
      setError('Radius must be between 0 and 100 km');
      return false;
    }
    return true;
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Please enter an address manually.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        if (validateCoordinates(lat, lon)) {
          setUserLocation({ lat, lon });
          performSearch(lat, lon);
        } else {
          setIsLoading(false);
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location. ';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage += 'Please enable location permission and try again, or enter an address manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage += 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMessage += 'Location request timed out.';
        }
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Perform nearby search
  const performSearch = async (lat: number, lon: number) => {
    if (!validateRadius(searchParams.radius)) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const params: NearbySearchParams = {
        lat,
        lon,
        radius: searchParams.radius,
        page: searchParams.page,
        size: searchParams.size,
      };

      if (searchParams.type) {
        params.type = searchParams.type;
      }

      const response = await api.search.nearby(params);

      if (response.success && response.data) {
        const data = response.data;
        setSearchData(data);

        if (data.results.length === 0) {
          setError(`No results found within ${searchParams.radius} km. Try increasing the radius.`);
        }

        if (onResultsFound) {
          onResultsFound(data.results);
        }
      } else {
        setError(response.error || 'Failed to fetch nearby results');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'An error occurred while searching';
      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Search by address (using geocoding)
  const searchByAddress = async () => {
    if (!searchParams.address.trim()) {
      setError('Please enter an address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use OpenStreetMap Nominatim (free, no API key required)
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchParams.address
      )}&limit=1`;

      const geocodeResponse = await fetch(geocodeUrl, {
        headers: {
          'User-Agent': 'Vertex-Fitness-App/1.0'
        }
      });
      const geocodeData = await geocodeResponse.json();

      if (geocodeData && geocodeData.length > 0) {
        const lat = parseFloat(geocodeData[0].lat);
        const lon = parseFloat(geocodeData[0].lon);

        if (validateCoordinates(lat, lon)) {
          setUserLocation({ lat, lon });
          await performSearch(lat, lon);
        } else {
          setIsLoading(false);
        }
      } else {
        setError('Address not found. Please try a different address or be more specific.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Failed to geocode address. Please check your internet connection and try again.');
      console.error('Geocoding error:', err);
      setIsLoading(false);
    }
  };

  // Render gym card
  const renderGymCard = (gym: NearbyGymResult) => {
    const averageRating = typeof gym.averageRating === 'number' ? gym.averageRating : 0;
    const ratingCount = typeof gym.ratingCount === 'number' ? gym.ratingCount : 0;

    return (
      <div className="glass-card rounded-xl p-5 border border-primary-600/20 hover:border-primary-600/40 transition-all duration-300 hover:shadow-glow group">
        {/* Header with logo and type badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            {gym.logoUrl ? (
              <img src={gym.logoUrl} alt={gym.name} className="w-12 h-12 rounded-lg object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h5 className="text-lg font-bold text-white truncate">{gym.name}</h5>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold uppercase">
                  GYM
                </span>
                <span className="text-primary-400 text-sm font-bold">
                  📍 {gym.distance.toFixed(2)} km
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {gym.description && (
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">{gym.description}</p>
        )}

        {/* Location */}
        <div className="mb-3">
          <p className="text-sm text-gray-400 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{gym.location.formattedAddress || gym.location.address}</span>
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-3">
          {gym.phoneNumber && (
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-500" />
              <a href={`tel:${gym.phoneNumber}`} className="hover:text-primary-400 transition-colors">
                {gym.phoneNumber}
              </a>
            </p>
          )}
          {gym.email && (
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-500" />
              <a href={`mailto:${gym.email}`} className="hover:text-primary-400 transition-colors">
                {gym.email}
              </a>
            </p>
          )}
          {gym.website && (
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <a href={gym.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors truncate">
                Visit Website
              </a>
            </p>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-white">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">({ratingCount} reviews)</span>
          </div>
          <Link href={`/gyms/${gym.id}`}>
            <Button size="sm" className="btn-primary text-xs group-hover:shadow-glow">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  // Render PT card
  const renderPTCard = (pt: NearbyPTResult) => {
    const averageRating = typeof pt.averageRating === 'number' ? pt.averageRating : 0;
    const ratingCount = typeof pt.ratingCount === 'number' ? pt.ratingCount : 0;

    return (
      <div className="glass-card rounded-xl p-5 border border-primary-600/20 hover:border-primary-600/40 transition-all duration-300 hover:shadow-glow group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h5 className="text-lg font-bold text-white mb-1">{pt.name}</h5>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-400 text-xs font-bold uppercase">
                TRAINER
              </span>
              <span className="text-primary-400 text-sm font-bold">
                📍 {pt.distance.toFixed(2)} km
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {pt.bio && (
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">{pt.bio}</p>
        )}

        {/* Details */}
        <div className="space-y-2 mb-3">
          {pt.specializations && (
            <p className="text-sm text-gray-400 flex items-start gap-2">
              <Award className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
              <span>{pt.specializations}</span>
            </p>
          )}
          {pt.certifications && (
            <p className="text-sm text-gray-400 flex items-start gap-2">
              <Award className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>{pt.certifications}</span>
            </p>
          )}
          {typeof pt.experience === 'number' && (
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-green-500" />
              <span>{pt.experience} years experience</span>
            </p>
          )}
          {typeof pt.hourlyRate === 'number' && (
            <p className="text-sm text-primary-400 flex items-center gap-2 font-bold">
              <DollarSign className="w-4 h-4" />
              <span>{pt.hourlyRate.toLocaleString()} VND/hour</span>
            </p>
          )}
        </div>

        {/* Location */}
        <div className="mb-3">
          <p className="text-sm text-gray-400 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{pt.location.formattedAddress || pt.location.address}</span>
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-white">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">({ratingCount} reviews)</span>
          </div>
          <Link href={`/trainers/${pt.id}`}>
            <Button size="sm" className="btn-primary text-xs group-hover:shadow-glow">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <div className="glass-card rounded-2xl p-6 border border-primary-600/20 shadow-3d">
        <h3 className="text-2xl font-black text-white mb-6">
          <MapPin className="inline-block w-6 h-6 mr-2 text-primary-500" />
          Find Nearby Gyms & Trainers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Address Search */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
              Search by Address
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter address (e.g., 123 Đường ABC, Hà Nội)"
                value={searchParams.address}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, address: e.target.value })
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    searchByAddress();
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={searchByAddress}
                disabled={isLoading}
                className="btn-primary"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Radius */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
              Radius (km) - Max 100km
            </label>
            <Input
              type="number"
              min="1"
              max="100"
              value={searchParams.radius}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value > 0 && value <= 100) {
                  setSearchParams({ ...searchParams, radius: value });
                  setError('');
                }
              }}
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
              Type
            </label>
            <Select
              value={searchParams.type}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  type: e.target.value as '' | 'gym' | 'pt',
                })
              }
            >
              <option value="">All (Gyms + Trainers)</option>
              <option value="gym">Gyms Only</option>
              <option value="pt">Personal Trainers Only</option>
            </Select>
          </div>
        </div>

        {/* Use Current Location Button */}
        <Button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="w-full btn-outline group"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Navigation className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Use My Current Location
            </>
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Current Search Info */}
        {searchData && userLocation && (
          <div className="mt-4 p-4 rounded-xl bg-primary-600/10 border border-primary-600/30 text-gray-300 text-sm">
            <p className="font-bold text-white mb-1">Search Criteria:</p>
            <p>📍 Location: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}</p>
            <p>📏 Radius: {searchData.searchCriteria.radius} km</p>
            <p>
              🎯 Type:{' '}
              {!searchData.searchCriteria.type || searchData.searchCriteria.type === 'all'
                ? 'All (Gyms + Trainers)'
                : searchData.searchCriteria.type.toUpperCase()}
            </p>
          </div>
        )}
      </div>

      {/* Results Display */}
      {searchData && searchData.results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-black text-white">
              Found {searchData.pagination.total} results nearby
            </h4>
            <div className="text-sm text-gray-400">
              Page {searchData.pagination.page + 1} of {searchData.pagination.totalPages}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchData.results.map((result) => (
              <div key={`${result.type}-${result.id}`}>
                {result.type === 'gym' ? renderGymCard(result) : renderPTCard(result)}
              </div>
            ))}
          </div>

          {/* Pagination Info */}
          {searchData.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <p className="text-gray-400 text-sm">
                Showing {searchData.results.length} of {searchData.pagination.total} results
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
