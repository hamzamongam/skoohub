"use client";

import { CheckCircle2, Rocket, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface WelcomeModalProps {
	onStart: () => void;
}

export function WelcomeModal({ onStart }: WelcomeModalProps) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		// Simulate check for first-time user
		const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
		if (!hasSeenWelcome) {
			const timer = setTimeout(() => setIsOpen(true), 1000);
			return () => clearTimeout(timer);
		}
	}, []);

	const handleClose = () => {
		setIsOpen(false);
		localStorage.setItem("hasSeenWelcome", "true");
	};

	const handleStart = () => {
		handleClose();
		onStart();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-500">
			<div className="relative w-full max-w-2xl overflow-hidden glass-card rounded-[3rem] p-1 shadow-2xl animate-in zoom-in-95 duration-500">
				<div className="absolute top-6 right-6 z-10">
					<button
						type="button"
						onClick={handleClose}
						className="p-2 rounded-full hover:bg-muted/50 transition-colors"
					>
						<X className="size-5 text-muted-foreground" />
					</button>
				</div>

				<div className="relative bg-background/50 rounded-[2.8rem] p-8 md:p-12 overflow-hidden text-center">
					{/* Decorative background elements */}
					<div className="absolute -top-24 -left-24 size-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
					<div className="absolute -bottom-24 -right-24 size-64 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

					<div className="relative z-10 space-y-8">
						<div className="mx-auto size-20 rounded-3xl bg-linear-to-br from-primary to-accent p-0.5 shadow-xl shadow-primary/20 rotate-3 transform transition-transform hover:rotate-0 duration-500">
							<div className="w-full h-full rounded-[1.4rem] bg-background flex items-center justify-center">
								<Rocket className="size-10 text-primary" />
							</div>
						</div>

						<div className="space-y-4">
							<h2 className="text-4xl md:text-5xl font-black tracking-tighter">
								Welcome to <br />
								<span className="text-gradient">EduSynergy</span>
							</h2>
							<p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
								Your school's digital transformation starts here. We've prepared
								a few steps to help you get everything configured.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
							{[
								{ icon: CheckCircle2, label: "School Identity" },
								{ icon: Sparkles, label: "Smart Analytics" },
								{ icon: Rocket, label: "Live in Minutes" },
							].map((item) => (
								<div
									key={item.label}
									className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/30 border border-border/50"
								>
									<item.icon className="size-6 text-primary" />
									<span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
										{item.label}
									</span>
								</div>
							))}
						</div>

						<div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
							<Button
								size="lg"
								onClick={handleStart}
								className="w-full sm:w-auto h-14 px-10 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
							>
								Let's Get Started
							</Button>
							<button
								type="button"
								onClick={handleClose}
								className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
							>
								I'll do it later
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
