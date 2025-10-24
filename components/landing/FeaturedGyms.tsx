import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star, MapPin, Clock, Users, Building2, Heart, ArrowRight } from 'lucide-react';

// Mock data - in real app, this would come from API
const featuredGyms = [
	{
		id: '1',
		name: 'FitLife Gym',
		location: 'Downtown, New York',
		rating: 4.8,
		reviewCount: 124,
		price: 89,
		image: '/api/placeholder/300/200',
		amenities: ['Parking', 'Pool', 'Sauna', 'Group Classes'],
		description:
			'State-of-the-art fitness facility with premium equipment and expert trainers.',
	},
	{
		id: '2',
		name: 'PowerHouse Fitness',
		location: 'Midtown, Los Angeles',
		rating: 4.6,
		reviewCount: 89,
		price: 75,
		image: '/api/placeholder/300/200',
		amenities: ['Parking', 'Locker Rooms', 'Personal Training'],
		description:
			'Professional training environment focused on strength and conditioning.',
	},
	{
		id: '3',
		name: 'Zen Wellness Center',
		location: 'Westside, San Francisco',
		rating: 4.9,
		reviewCount: 156,
		price: 120,
		image: '/api/placeholder/300/200',
		amenities: ['Yoga Studio', 'Meditation Room', 'Spa Services'],
		description:
			'Holistic approach to fitness with yoga, pilates, and wellness programs.',
	},
];

export function FeaturedGyms() {
	return (
		<section className="py-20 bg-black relative overflow-hidden">

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="text-center mb-16 animate-fade-in">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-900 border border-primary-600 mb-6">
						<Building2 className="w-5 h-5 text-primary-500" />
						<span className="text-sm font-semibold text-white">
							Premium <span className="text-primary-500">Facilities</span>
						</span>
					</div>

					<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
						FEATURED <span className="text-primary-500">GYMS</span>
					</h2>
					<p className="text-lg text-gray-400 max-w-3xl mx-auto">
						Train at the most{' '}
						<span className="text-primary-400 font-semibold">elite facilities</span> with
						state-of-the-art equipment and world-class amenities
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{featuredGyms.map((gym) => (
						<div key={gym.id} className="group animate-fade-in">
							<div className="bg-dark-900 border border-dark-700 rounded-lg overflow-hidden hover:border-primary-600 transition-colors duration-150">

									{/* Image */}
									<div className="relative h-48 overflow-hidden">
										<img
											src={gym.image}
											alt={gym.name}
											className="w-full h-full object-cover"
										/>

										{/* Badges */}
										<div className="absolute top-3 left-3 z-20">
											<div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-dark-900 border border-dark-700">
												<Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
												<span className="text-sm font-semibold text-white">{gym.rating}</span>
											</div>
										</div>
									</div>

									{/* Content */}
									<div className="p-6">
										<h3 className="text-xl font-bold text-white mb-2">
											{gym.name}
										</h3>

										<div className="flex items-center text-gray-400 mb-3">
											<MapPin className="h-4 w-4 mr-2 text-primary-500" />
											<span className="text-sm">{gym.location}</span>
										</div>

										<p className="text-gray-400 text-sm mb-4 line-clamp-2">
											{gym.description}
										</p>

										{/* Amenities */}
										<div className="flex flex-wrap gap-2 mb-4">
											{gym.amenities.slice(0, 3).map((amenity) => (
												<span
													key={amenity}
													className="text-xs px-2 py-1 rounded bg-primary-600/20 text-primary-400 border border-primary-600"
												>
													{amenity}
												</span>
											))}
											{gym.amenities && gym.amenities.length > 3 && (
												<span className="text-xs px-2 py-1 rounded bg-dark-800 text-gray-400 border border-dark-700">
													+{gym.amenities.length - 3}
												</span>
											)}
										</div>

										{/* Price and CTA */}
										<div className="flex items-center justify-between">
											<div>
												<div className="text-2xl font-bold text-primary-500">
													${gym.price}
												</div>
												<div className="text-xs text-gray-500">
													per month
												</div>
											</div>

											<Link href={`/gyms/${gym.id}`}>
												<Button size="sm">
													<span>View Details</span>
													<ArrowRight className="w-4 h-4 ml-2" />
												</Button>
											</Link>
										</div>
									</div>
								</div>
						</div>
					))}
				</div>

				{/* View All Button */}
				<div className="text-center mt-12 animate-fade-in">
					<Link href="/gyms">
						<Button size="lg" className="px-12">
							<Building2 className="w-5 h-5 mr-3" />
							<span>View All Gyms</span>
							<ArrowRight className="w-5 h-5 ml-3" />
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}

