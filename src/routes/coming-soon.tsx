import { createFileRoute, Link } from "@tanstack/react-router";
import { LayoutDashboard, Rocket, Sparkles } from "lucide-react";

export const Route = createFileRoute("/coming-soon")({
	component: ComingSoon,
	head: () => ({
		meta: [
			{
				title: "Skoohub - Modern School Management System",
			},
			{
				name: "description",
				content:
					"Skoohub is a comprehensive school management system designed to streamline administration, enhance student learning, and improve parent engagement.",
			},
			{
				name: "keywords",
				content:
					"school management system, education software, student information system, skoohub, school admin, edtech",
			},
		],
	}),
});

export function ComingSoon() {
	return (
		<div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
			{/* Background Effects */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-20 pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[128px]" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[128px]" />
			</div>

			<div className="relative z-10 px-6 text-center max-w-3xl mx-auto">
				{/* Logo */}
				<div className="flex items-center justify-center gap-2 font-black text-3xl text-white mb-10">
					<div className="w-10 h-10 bg-cyan-500 rounded flex items-center justify-center">
						<LayoutDashboard className="w-6 h-6 text-slate-900" />
					</div>
					<span>
						SKOO<span className="text-cyan-400">HUB</span>
					</span>
				</div>

				{/* Badge */}
				<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
					<Sparkles className="w-4 h-4" />
					<span>Something Extraordinary is Brewing</span>
				</div>

				{/* Main Content */}
				<h1 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-[-0.04em] leading-tight mb-8">
					Coming Soon
				</h1>

				<p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto">
					We're crafting a revolutionary experience that will redefine how you
					interact with digital education. Stay tuned for the grand reveal.
				</p>

				{/* Floating Card */}
				<div className="relative group max-w-sm mx-auto mb-16">
					<div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
					<div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
						<div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700/50">
							<Rocket className="w-8 h-8 text-cyan-400" />
						</div>
						<h3 className="text-lg font-semibold text-white mb-2">
							Launch Sequence Initiated
						</h3>
						<p className="text-slate-500 text-sm">
							Our engineers are finalizing the last few details.
						</p>
					</div>
				</div>
			</div>

			{/* Footer */}
			<div className="absolute bottom-8 text-slate-600 text-sm">
				© {new Date().getFullYear()} Skoohub. All rights reserved.
			</div>
		</div>
	);
}
