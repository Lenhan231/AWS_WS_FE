import { Star, Quote, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const testimonials = [
	{
		id: 1,
		name: 'Sarah Johnson',
		role: 'Client',
		image: '/api/placeholder/100/100',
		rating: 5,
		text: 'Vertex helped me find the perfect gym just 5 minutes from my office. The trainer I connected with has been amazing, and I\'ve seen incredible results in just 3 months!',
		date: '2 weeks ago',
	},
	{
		id: 2,
		name: 'Michael Chen',
		role: 'Fitness Enthusiast',
		image: '/api/placeholder/100/100',
		rating: 5,
		text: 'As a busy professional, I needed flexibility in my workout schedule. Vertex connected me with a trainer who offers early morning sessions that fit perfectly with my routine.',
		date: '1 month ago',
	},
	{
		id: 3,
		name: 'Emily Rodriguez',
		role: 'Gym Member',
		image: '/api/placeholder/100/100',
		rating: 5,
		text: 'The variety of gyms and trainers available through Vertex is incredible. I was able to compare prices, read reviews, and find exactly what I was looking for.',
		date: '3 weeks ago',
	},
	{
		id: 4,
		name: 'David Thompson',
		role: 'Personal Training Client',
		image: '/api/placeholder/100/100',
		rating: 5,
		text: 'I\'ve been using Vertex for over a year now. The platform makes it so easy to discover new gyms and trainers, and the booking process is seamless.',
		date: '2 months ago',
	},
	{
		id: 5,
		name: 'Lisa Anderson',
		role: 'Fitness Beginner',
		image: '/api/placeholder/100/100',
		rating: 5,
		text: 'The reviews and ratings on Vertex are so helpful. I was able to find a trainer who specializes in injury rehabilitation, which was exactly what I needed.',
		date: '1 month ago',
	},
	{
		id: 6,
		name: 'James Wilson',
		role: 'Student',
		image: '/api/placeholder/100/100',
		rating: 5,
		text: 'Vertex made it affordable for me to access quality personal training. The student discounts and flexible payment options are fantastic!',
		date: '3 weeks ago',
	},
];

export function Testimonials() {
	return (
		<section className="py-24 bg-black relative overflow-hidden">
			{/* Simplified Background */}
			<div className="absolute inset-0 bg-mesh opacity-25" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

				{/* Section Header */}
				<div className="text-center mb-20">
					<div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card border border-primary-600/30 mb-8">
						<Star className="w-5 h-5 text-yellow-500" />
						<span className="text-sm font-black text-white uppercase tracking-wider">
							Client <span className="text-gradient">Stories</span>
						</span>
					</div>

					<h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
						WHAT OUR <span className="text-neon">WARRIORS</span> SAY
					</h2>
					<p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
						Don&apos;t just take our word for it. Here&apos;s what real <span className="text-primary-400 font-bold">transformation stories</span> have to say about their <span className="text-gradient font-bold">Vertex</span> experience.
					</p>
				</div>

				{/* Testimonial Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
					{testimonials.map((testimonial) => (
						<div
							key={testimonial.id}
							className="group"
						>
							<div className="relative">
								{/* Testimonial Card */}
								<div className="glass-card rounded-3xl p-8 border border-primary-600/20 group-hover:border-primary-600/50 h-full">

									{/* Stars Rating */}
									<div className="flex items-center mb-6">
										<div className="flex items-center gap-1">
											{[...Array(testimonial.rating)].map((_, i) => (
												<Star
													key={i}
													className="w-5 h-5 text-yellow-500 fill-yellow-500"
												/>
											))}
										</div>
										<div className="ml-auto">
											<div className="text-xs text-gray-500 font-bold uppercase tracking-wider">
												{testimonial.date}
											</div>
										</div>
									</div>

									{/* Quote */}
									<div className="relative mb-8">
										<Quote className="w-8 h-8 text-primary-500/30 absolute -top-2 -left-2" />
										<p className="text-gray-300 italic text-base leading-relaxed pl-6">
											"{testimonial.text}"
										</p>
									</div>

									{/* Profile */}
									<div className="flex items-center">
										<div className="relative">
											<div className="relative w-16 h-16 rounded-full overflow-hidden border-3 border-primary-600/50">
												<img
													src={testimonial.image}
													alt={testimonial.name}
													className="w-full h-full object-cover"
												/>
											</div>
										</div>

										<div className="ml-4 flex-1">
											<h4 className="font-black text-white text-lg">
												{testimonial.name}
											</h4>
											<p className="text-primary-400 text-sm font-bold uppercase tracking-wider">
												{testimonial.role}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Community Stats */}
				<div className="text-center">
					<div className="relative">
						<div className="glass-card rounded-3xl p-12 max-w-6xl mx-auto border border-primary-600/30">
							<div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-transparent to-primary-800/5 rounded-3xl" />

							<div className="relative">
								<div className="flex items-center justify-center gap-3 mb-8">
									<div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card border border-green-500/50">
										<Users className="w-5 h-5 text-green-500" />
										<span className="text-green-400 font-black text-sm uppercase tracking-wider">10,000+ Happy Clients</span>
									</div>
								</div>

								<h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
									Join Our <span className="text-gradient">Elite Community</span>
								</h3>

								<p className="text-xl text-gray-400 mb-10 max-w-4xl mx-auto leading-relaxed">
									Over <span className="text-primary-400 font-black text-2xl">10,000</span> satisfied clients have found their perfect fitness match through <span className="text-gradient font-bold">Vertex</span>.
									<br />
									<span className="text-lg">Ready to become the next success story?</span>
								</p>

								<div className="flex flex-col sm:flex-row gap-6 justify-center">
									<button className="btn-primary btn-lg group px-12 py-4">
										<Star className="w-6 h-6 mr-3" />
										<span className="font-black">Start Your Journey</span>
									</button>

									<button className="btn-outline btn-lg group px-12 py-4">
										<Quote className="w-6 h-6 mr-3" />
										<span className="font-black">Read More Reviews</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Epic bottom effect */}
			<div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-600 to-transparent" />
		</section>
	);
}

