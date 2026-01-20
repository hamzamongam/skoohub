import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	BarChart3,
	BookOpen,
	Calendar,
	CheckCircle2,
	Globe,
	GraduationCap,
	LayoutDashboard,
	MessageSquare,
	ShieldCheck,
	Sparkles,
	Users,
} from "lucide-react";
import LandingHeader from "@/components/LandingHeader";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	const features = [
		{
			icon: <BookOpen className="w-8 h-8" />,
			title: "Academic Management",
			description:
				"Streamline curriculum planning, exam scheduling, and student performance tracking in one place.",
		},
		{
			icon: <Users className="w-8 h-8" />,
			title: "Student & Staff Portal",
			description:
				"Centralized profiles with complete academic history, attendance records, and performance metrics.",
		},
		{
			icon: <Calendar className="w-8 h-8" />,
			title: "Attendance Tracking",
			description:
				"Real-time attendance monitoring for students and staff with automated notification alerts.",
		},
		{
			icon: <BarChart3 className="w-8 h-8" />,
			title: "Grading & Reports",
			description:
				"Automated report card generation and multi-dimensional analysis of student progress.",
		},
		{
			icon: <MessageSquare className="w-8 h-8" />,
			title: "Communication Hub",
			description:
				"Seamless interaction between parents, teachers, and administration via integrated messaging.",
		},
		{
			icon: <ShieldCheck className="w-8 h-8" />,
			title: "Secure Data Control",
			description:
				"Enterprise-grade security protocols to protect sensitive student information and school records.",
		},
	];

	const stats = [
		{ label: "Schools Trusted", value: "500+" },
		{ label: "Active Students", value: "250K+" },
		{ label: "Uptime Guarantee", value: "99.9%" },
		{ label: "Support Response", value: "< 2h" },
	];

	return (
		<div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-cyan-500 selection:text-white overflow-x-hidden">
			<LandingHeader />
			{/* Hero Section */}
			<section className="relative pt-32 pb-20 px-6">
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] opacity-20 pointer-events-none">
					<div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[128px]" />
					<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[128px]" />
				</div>

				<div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
					<div className="flex-1 text-center lg:text-left">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
							<Sparkles className="w-4 h-4" />
							<span>Evolutionizing Modern Education</span>
						</div>

						<h1 className="text-5xl lg:text-7xl font-bold bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-[-0.04em] leading-[1.1] mb-6">
							The OS for Your <br />
							<span className="text-cyan-400">Institutional Excellence</span>
						</h1>

						<p className="text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
							Empower your school with an all-in-one management platform. From
							administration to classroom, we provide the tools to nurture the
							next generation.
						</p>

						<div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
							<Link
								to="/register"
								className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95"
							>
								Get Started for Free
							</Link>
							<button
								type="button"
								className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-all flex items-center gap-2 group"
							>
								View Live Demo
								<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
							</button>
						</div>

						<div className="mt-12 flex items-center justify-center lg:justify-start gap-8 border-t border-slate-800 pt-8 animate-in slide-in-from-bottom-8 duration-1000 delay-500">
							{stats.map((stat) => (
								<div key={stat.label} className="text-left">
									<div className="text-2xl font-bold text-white">
										{stat.value}
									</div>
									<div className="text-xs uppercase tracking-widest text-slate-500 mt-1">
										{stat.label}
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="flex-1 relative group w-full lg:w-auto">
						<div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
						<div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden shadow-2xl">
							<div className="bg-slate-800/50 rounded-xl aspect-4/3 flex items-center justify-center border border-slate-700/50">
								<div className="text-center">
									<LayoutDashboard className="w-24 h-24 text-slate-700 mx-auto mb-4" />
									<p className="text-slate-500 font-medium">
										Interactive Educational Dashboard
									</p>
								</div>
							</div>
							{/* Floating UI Elements */}
							<div className="absolute top-10 right-10 bg-slate-800/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl animate-bounce duration-3000">
								<div className="flex gap-3 items-center">
									<div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
										<Users className="w-5 h-5 text-cyan-400" />
									</div>
									<div>
										<div className="text-xs text-slate-400">
											Total Enrollment
										</div>
										<div className="text-lg font-bold text-white">1,284</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* biome-ignore lint: used for anchor navigation */}
			<section id="features" className="py-24 px-6 bg-slate-900/50 relative">
				<div className="max-w-7xl mx-auto">
					<div className="text-center max-w-3xl mx-auto mb-20">
						<h2 className="text-4xl font-bold text-white mb-6">
							Designed for Modern Schools
						</h2>
						<p className="text-lg text-slate-400">
							A comprehensive suite of tools built to simplify school operations
							and improve student outcomes.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature) => (
							<div
								key={feature.title}
								className="group p-8 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:bg-slate-800/60"
							>
								<div className="w-16 h-16 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
									{feature.icon}
								</div>
								<h3 className="text-xl font-bold text-white mb-4">
									{feature.title}
								</h3>
								<p className="text-slate-400 leading-relaxed">
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>
			;
			<section className="py-24 px-6 overflow-hidden">
				<div className="max-w-7xl mx-auto flex flex-col items-center text-center">
					<div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mb-10">
						<GraduationCap className="w-10 h-10 text-cyan-400" />
					</div>
					<blockquote className="text-3xl md:text-5xl font-medium text-white italic max-w-4xl leading-tight mb-12">
						"Switching to this platform reduced our administration overhead by
						40% and significantly improved parent engagement within the first
						semester."
					</blockquote>
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-full bg-slate-800" />
						<div className="text-left">
							<div className="font-bold text-white">Dr. Elizabeth Thorne</div>
							<div className="text-slate-500 text-sm">
								Principal, Horizon Global School
							</div>
						</div>
					</div>
				</div>
			</section>
			;
			<section className="py-24 px-6">
				<div className="max-w-5xl mx-auto rounded-3xl bg-linear-to-br from-cyan-600 to-blue-700 p-12 lg:p-20 relative overflow-hidden text-center">
					<div className="absolute inset-0 opacity-10 pointer-events-none">
						<Globe className="absolute -right-20 -bottom-20 w-96 h-96" />
					</div>

					<div className="relative z-10">
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
							Ready to Elevate Your School?
						</h2>
						<p className="text-xl text-cyan-100 mb-10 max-w-2xl mx-auto">
							Join hundreds of schools that have already transformed their
							digital infrastructure with our platform.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<Link
								to="/register"
								className="px-10 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-cyan-50 transition-all shadow-xl"
							>
								Start Your Trial
							</Link>
							<button
								type="button"
								className="px-10 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
							>
								Talk to Sales
							</button>
						</div>
						<div className="mt-8 flex items-center justify-center gap-6 text-cyan-100/60 text-sm">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="w-4 h-4" /> No credit card required
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="w-4 h-4" /> 14-day full access
							</div>
						</div>
					</div>
				</div>
			</section>
			;
			<footer className="py-20 px-6 border-t border-slate-800">
				<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
					<div className="col-span-1 md:col-span-2">
						<div className="flex items-center gap-2 font-black text-2xl text-white mb-6">
							<div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center">
								<LayoutDashboard className="w-5 h-5 text-slate-900" />
							</div>
							<span>
								SKOO<span className="text-cyan-400">HUB</span>
							</span>
						</div>
						<p className="text-slate-500 max-w-sm">
							Empowering educators and administrators with modern technology to
							build the schools of the future.
						</p>
					</div>
					<div>
						<h4 className="font-bold text-white mb-6">Features</h4>
						<ul className="space-y-4 text-slate-500">
							<li>
								<Link to="/" className="hover:text-cyan-400 transition-colors">
									Academic Planning
								</Link>
							</li>
							<li>
								<Link to="/" className="hover:text-cyan-400 transition-colors">
									Attendance
								</Link>
							</li>
							<li>
								<Link to="/" className="hover:text-cyan-400 transition-colors">
									Parent Portal
								</Link>
							</li>
							<li>
								<Link to="/" className="hover:text-cyan-400 transition-colors">
									Finance Management
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="font-bold text-white mb-6">Company</h4>
						<ul className="space-y-4 text-slate-500">
							<li>
								<Link to="/" className="hover:text-cyan-400 transition-colors">
									About Us
								</Link>
							</li>
							<li>
								<Link to="/" className="hover:text-cyan-400 transition-colors">
									Blog
								</Link>
							</li>
							<li>
								<Link to="/" className="hover:text-cyan-400 transition-colors">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link to="/" className="hover:text-cyan-400 transition-colors">
									Privacy Policy
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-800 flex justify-between items-center text-slate-500 text-sm">
					<div>© 2025 Skoohub Management. All rights reserved.</div>
					<div className="flex gap-6">
						<Link to="/register" className="hover:text-white transition-colors">
							Register
						</Link>
						<Link to="/login" className="hover:text-white transition-colors">
							Login
						</Link>
					</div>
				</div>
			</footer>
			;
		</div>
	);
}
