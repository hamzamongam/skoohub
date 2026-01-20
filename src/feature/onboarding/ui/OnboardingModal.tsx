import type { FC } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import OnboardingWizard from "./OnboardingWizard";

interface OnboardingModalProps {
	open: boolean;
	onComplete?: () => void;
}

const OnboardingModal: FC<OnboardingModalProps> = ({ open, onComplete }) => {
	return (
		<Dialog open={open} onOpenChange={() => {}}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader className="hidden">
					<DialogTitle>Onboarding</DialogTitle>
					<DialogDescription>Setup your school</DialogDescription>
				</DialogHeader>
				<OnboardingWizard onComplete={onComplete} />
			</DialogContent>
		</Dialog>
	);
};

export default OnboardingModal;
