import { createFileRoute } from "@tanstack/react-router";
import OnboardingWizard from "@/feature/onboarding/ui/OnboardingWizard";

export const Route = createFileRoute("/onboarding")({
	component: OnboardingWizard,
});
