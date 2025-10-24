import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Star, MapPin, Clock, Tag, Building2, User, ArrowRight } from 'lucide-react';

// Mock data with discount calculations
const featuredOffers = [
	{
		id: '1',
		title: 'New Member Special - 50% Off First Month',
		gym: 'FitLife Gym',
		location: 'Downtown, New York',
		originalPrice: 89,
		salePrice: 45,
		discount: 50,
		type: 'gym',
		duration: '30 days',
		rating: 4.8,
		image: '/api/placeholder/300/200',
		description:
			'Join now and get 50% off your first month membership. Includes access to all facilities and group classes.',
	},
	{
		id: '2',
		title: 'Personal Training Package - 10 Sessions',
		trainer: 'Sarah Johnson',
		location: 'Los Angeles, CA',
		originalPrice: 850,
		salePrice: 750,
		discount: 12,
		type: 'trainer',
		duration: '10 sessions',
		rating: 4.9,
		image: '/api/placeholder/300/200',
		description:
			'Comprehensive personal training package with nutrition guidance and workout plans.',
	},
	{
		id: '3',
		title: 'Group Fitness Classes - Unlimited Access',
		gym: 'Zen Wellness Center',
		location: 'San Francisco, CA',
		originalPrice: 150,
		salePrice: 99,
		discount: 34,
		type: 'gym',
		duration: '30 days',
		rating: 4.7,
		image: '/api/placeholder/300/200',
		description:
			'Unlimited access to all group fitness classes including yoga, pilates, and meditation.',
	},
];

export function FeaturedOffers() {
	return (
		<section className="py-20 bg-black relative overflow-hidden">

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* Section Header */}
				<div className="text-center mb-16 animate-fade-in">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-900 border border-primary-600 mb-6">
						<Tag className="w-5 h-5 text-primary-500" />
						<span className="text-sm font-semibold text-white">
							Limited <span className="text-primary-500">Time</span>
						</span>
					</div>

					<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
						EXCLUSIVE <span className="text-primary-500">OFFERS</span>
					</h2>
					<p className="text-lg text-gray-400 max-w-3xl mx-auto">
						Don't miss out on these{' '}
						<span className="text-primary-400 font-semibold">
							limited-time deals
						</span>{' '}
						from our premium partners. Save big on memberships and training
						sessions!
					</p>
				</div>

				{/* Offers Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{featuredOffers.map((offer) => (
						<div key={offer.id} className="group animate-fade-in">
							<div className="bg-dark-900 border border-dark-700 rounded-lg overflow-hidden hover:border-primary-600 transition-colors duration-150">

									{/* Badges */}
									<div className="absolute top-3 left-3 z-20">
										<div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-600 text-white">
											<Tag className="w-3 h-3" />
											<span className="text-xs font-semibold">
												{offer.discount}% OFF
											</span>
										</div>
									</div>

									<div className="absolute top-3 right-3 z-20">
										<div className="bg-dark-900 border border-dark-700 px-3 py-1 rounded-lg">
											<div className="flex items-center gap-1">
												<Clock className="w-3 h-3 text-yellow-500" />
												<span className="text-xs text-yellow-400 font-semibold">
													2 Days Left
												</span>
											</div>
										</div>
									</div>

									{/* Image */}
									<div className="relative h-48 overflow-hidden">
										<img
											src={offer.image}
											alt={offer.title}
											className="w-full h-full object-cover"
										/>
									</div>

									{/* Content */}
									<div className="p-6">
										<div className="flex items-center gap-2 mb-2">
											{offer.type === 'gym' ? (
												<Building2 className="w-4 h-4 text-primary-500" />
											) : (
												<User className="w-4 h-4 text-primary-500" />
											)}
											<span className="text-xs text-primary-400 font-semibold">
												{offer.type === 'gym'
													? 'Gym Offer'
													: 'Personal Training'}
											</span>
										</div>

										<h3 className="text-lg font-bold text-white mb-3">
											{offer.title}
										</h3>

										<p className="text-gray-400 text-sm mb-4 line-clamp-2">
											{offer.description}
										</p>

										{/* Price */}
										<div className="flex items-center justify-between mb-4">
											<div>
												<div className="flex items-baseline gap-2">
													<span className="text-2xl font-bold text-primary-500">
														${offer.salePrice}
													</span>
													<span className="text-base text-gray-500 line-through">
														${offer.originalPrice}
													</span>
												</div>
												<div className="text-xs text-gray-500">
													{offer.duration}
												</div>
											</div>

											<div className="text-right">
												<div className="text-lg font-bold text-green-500">
													SAVE ${offer.originalPrice - offer.salePrice}
												</div>
											</div>
										</div>

										{/* CTA Button */}
										<Button className="w-full">
											<span>Claim Offer</span>
											<ArrowRight className="w-4 h-4 ml-2" />
										</Button>
									</div>
								</div>
						</div>
					))}
				</div>

				{/* View All Button */}
				<div className="text-center mt-12 animate-fade-in">
					<Link href="/offers">
						<Button variant="outline" size="lg" className="px-12">
							<Tag className="w-5 h-5 mr-3" />
							<span>View All Offers</span>
							<ArrowRight className="w-5 h-5 ml-3" />
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}

