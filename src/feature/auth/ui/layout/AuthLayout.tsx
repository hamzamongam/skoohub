import { BookOpen, GraduationCap, ShieldCheck, Users } from "lucide-react";
import type { FC, ReactNode } from "react";

interface AuthLayoutProps {
	children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
	return (
		<div className="min-h-screen w-full flex bg-background overflow-hidden font-sans">
			{/* Left Panel - Illustration & Branding (Hidden on mobile) */}
			<div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-primary via-primary/80 to-primary/60 p-12 flex-col justify-between overflow-hidden">
				{/* Decorative Circles */}
				<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl pointer-events-none" />
				<div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

				<div className="relative z-10 flex items-center gap-3">
					<div className="p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-xl">
						<GraduationCap className="h-8 w-8 text-white" />
					</div>
					<span className="text-2xl font-bold text-white tracking-tight">
						EduSynergy
					</span>
				</div>

				<div className="relative z-10">
					<h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
						Empowering the <br />
						<span className="text-secondary font-serif italic">
							Next Generation
						</span>{" "}
						of Learners.
					</h1>
					<p className="text-lg text-white/80 max-w-md leading-relaxed">
						A comprehensive school management platform designed to streamline
						administration, enhance teaching, and inspire students.
					</p>
				</div>

				<div className="relative z-10 grid grid-cols-2 gap-6 pb-8">
					{[
						{ icon: BookOpen, label: "Modern Curriculum" },
						{ icon: Users, label: "Collaborative Tools" },
						{ icon: ShieldCheck, label: "Secure Data" },
					].map((item) => (
						<div
							key={item.label}
							className="flex items-center gap-3 text-white/90"
						>
							<item.icon className="h-5 w-5 text-secondary" />
							<span className="text-sm font-medium">{item.label}</span>
						</div>
					))}
				</div>
			</div>

			{/* Right Panel - Auth Content */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 relative">
				<div className="absolute top-24 right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none lg:hidden" />
				<div className="absolute bottom-24 left-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none lg:hidden" />

				<div className="w-full max-w-md relative z-10">{children}</div>
			</div>
		</div>
	);
};

export default AuthLayout;
