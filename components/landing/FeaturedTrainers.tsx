import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Star, Award, Users, ArrowRight, Dumbbell } from 'lucide-react';

// Mock data - in real app, this would come from API
const featuredTrainers = [
	{
		id: '1',
		name: 'Alex Martinez',
		profileImage: '/api/placeholder/200/200',
		specialties: ['Weight Loss', 'Strength Training', 'Nutrition'],
		rating: 4.9,
		reviewCount: 127,
		experience: 8,
		hourlyRate: 95,
	},
	{
		id: '2',
		name: 'Sarah Chen',
		profileImage: '/api/placeholder/200/200',
		specialties: ['Yoga', 'Flexibility', 'Mindfulness'],
		rating: 5.0,
		reviewCount: 203,
		experience: 12,
		hourlyRate: 110,
	},
	{
		id: '3',
		name: 'Marcus Johnson',
		profileImage: '/api/placeholder/200/200',
		specialties: ['HIIT', 'Cardio', 'Sports Performance'],
		rating: 4.8,
		reviewCount: 156,
		experience: 10,
		hourlyRate: 100,
	},
	{
		id: '4',
		name: 'Emily Rodriguez',
		profileImage: '/api/placeholder/200/200',
		specialties: ['Pilates', 'Core Training', 'Rehabilitation'],
		rating: 4.9,
		reviewCount: 178,
		experience: 9,
		hourlyRate: 105,
	},
];

export function FeaturedTrainers() {
	return (
		<section className="py-20 bg-black relative overflow-hidden">

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* Section Header */}
				<div className="text-center mb-16 animate-fade-in">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-900 border border-primary-600 mb-6">
						<Award className="w-5 h-5 text-primary-500" />
						<span className="text-sm font-semibold text-white">
							Elite <span className="text-primary-500">Trainers</span>
						</span>
					</div>

					<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
						MEET YOUR <span className="text-primary-500">COACHES</span>
					</h2>
					<p className="text-lg text-gray-400 max-w-3xl mx-auto">
						Connect with <span className="text-primary-400 font-semibold">certified professionals</span> who are ready to transform your fitness journey into a success story.
					</p>
				</div>

				{/* Trainers Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
					{featuredTrainers.map((trainer) => (
						<div key={trainer.id} className="group animate-fade-in">
							<div className="bg-dark-900 border border-dark-700 rounded-lg overflow-hidden hover:border-primary-600 transition-colors duration-150 h-full">

									{/* Profile Image */}
									<div className="relative p-6 pb-3">
										<div className="relative mx-auto w-24 h-24">
											<div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary-600">
												<img
													src={trainer.profileImage}
													alt={trainer.name}
													className="w-full h-full object-cover"
												/>
											</div>

											{/* Status indicator */}
											<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
												<div className="flex items-center gap-1 px-2 py-1 rounded-full bg-dark-900 border border-green-500">
													<div className="w-2 h-2 bg-green-500 rounded-full" />
													<span className="text-xs text-green-400 font-semibold">Available</span>
												</div>
											</div>
										</div>
									</div>

									{/* Content */}
									<div className="px-6 pb-6">
										<div className="text-center mb-4">
											<h3 className="text-lg font-bold text-white mb-1">
												{trainer.name}
											</h3>
											<p className="text-primary-400 text-sm">
												{trainer.specialties[0]}
											</p>
										</div>

										{/* Rating */}
										<div className="flex items-center justify-center gap-2 mb-3">
											<div className="flex items-center">
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														className={`w-4 h-4 ${
															i < Math.floor(trainer.rating)
																? 'text-yellow-500 fill-yellow-500'
																: 'text-gray-600'
														}`}
													/>
												))}
											</div>
											<span className="text-white font-semibold">{trainer.rating}</span>
											<span className="text-gray-500 text-sm">({trainer.reviewCount})</span>
										</div>

										{/* Experience Badge */}
										<div className="flex justify-center mb-3">
											<div className="bg-dark-800 border border-dark-700 px-3 py-1 rounded-lg">
												<span className="text-xs text-primary-400">
													{trainer.experience} Years Experience
												</span>
											</div>
										</div>

										{/* Specialties */}
										<div className="flex flex-wrap gap-2 justify-center mb-4">
											{trainer.specialties.slice(0, 2).map((specialty) => (
												<span
													key={specialty}
													className="text-xs px-2 py-1 rounded bg-primary-600/20 text-primary-400 border border-primary-600"
												>
													{specialty}
												</span>
											))}
										</div>

										{/* Price and CTA */}
										<div className="text-center space-y-3">
											<div>
												<div className="text-2xl font-bold text-primary-500">
													${trainer.hourlyRate}
												</div>
												<div className="text-xs text-gray-500">per hour</div>
											</div>

											<Link href={`/trainers/${trainer.id}`}>
												<Button className="w-full" size="sm">
													<span>View Profile</span>
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
					<Link href="/trainers">
						<Button variant="outline" size="lg" className="px-12">
							<Users className="w-5 h-5 mr-3" />
							<span>View All Trainers</span>
							<ArrowRight className="w-5 h-5 ml-3" />
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}

