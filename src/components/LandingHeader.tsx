import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingHeader() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 ${
				isScrolled
					? "bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5"
					: "bg-transparent"
			}`}
		>
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				<Link
					to="/"
					className="flex items-center gap-2 font-black text-2xl text-white"
				>
					<div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center">
						<LayoutDashboard className="w-5 h-5 text-slate-900" />
					</div>
					<span>
						SKOO<span className="text-cyan-400">HUB</span>
					</span>
				</Link>

				{/* Desktop Nav */}
				<nav className="hidden md:flex items-center gap-8">
					<a
						href="#features"
						className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
					>
						Features
					</a>
					<a
						href="/pricing"
						className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
					>
						Pricing
					</a>
					<a
						href="/about"
						className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
					>
						About
					</a>
				</nav>

				<div className="hidden md:flex items-center gap-4">
					<Link
						to="/login"
						className="text-sm font-bold text-white hover:text-cyan-400 transition-colors px-4 py-2"
					>
						Login
					</Link>
					<Link
						to="/register"
						className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold rounded-lg transition-all text-sm"
					>
						Join Now
					</Link>
				</div>

				{/* Mobile Menu Toggle */}
				<button
					type="button"
					className="md:hidden p-2 text-white"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
				>
					{isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
				</button>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="absolute top-full left-0 right-0 bg-[#0f172a] border-b border-slate-800 p-6 flex flex-col gap-6 md:hidden animate-in slide-in-from-top-4">
					<button
						type="button"
						className="text-lg font-medium text-slate-300 text-left"
						onClick={() => setIsMobileMenuOpen(false)}
					>
						Features
					</button>
					<button
						type="button"
						className="text-lg font-medium text-slate-300 text-left"
						onClick={() => setIsMobileMenuOpen(false)}
					>
						Pricing
					</button>
					<button
						type="button"
						className="text-lg font-medium text-slate-300 text-left"
						onClick={() => setIsMobileMenuOpen(false)}
					>
						About
					</button>
					<hr className="border-slate-800" />
					<Link to="/login" className="text-lg font-bold text-white">
						Login
					</Link>
					<Link
						to="/register"
						className="w-full py-4 bg-cyan-500 text-slate-900 font-bold rounded-xl text-center"
					>
						Get Started
					</Link>
				</div>
			)}
		</header>
	);
}
