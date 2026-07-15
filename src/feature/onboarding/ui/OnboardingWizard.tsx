import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type FC, useState } from "react";
import { type SubmitHandler, useFieldArray } from "react-hook-form";
import { Check, Plus, Trash2, Mail } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { BaseButton } from "@/components/base/button";
import BaseForm from "@/components/base/forms";
import useBaseForm from "@/components/base/forms/useBaseForm";
import { BaseInput } from "@/components/base/input";
import { BaseSelect } from "@/components/base/select";
import { BaseCheckbox } from "@/components/base/checkbox";
import {
	type AcademicStructureInput,
	AcademicStructureSchema,
} from "@/feature/onboarding/contract/onboarding.schema";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";

const steps = [
	{ id: 1, title: "Academic Year", description: "Define year & terms" },
	{ id: 2, title: "Classes & Sections", description: "Create grade levels" },
	{ id: 3, title: "Invite Staff", description: "Invite teachers" },
];

const OnboardingWizard: FC<{ onComplete?: () => void }> = ({ onComplete }) => {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const queryClient = useQueryClient();

	const handleComplete = async () => {
		await queryClient.invalidateQueries({ queryKey: ["auth-session"] });
		if (onComplete) {
			onComplete();
		} else {
			navigate({ to: "/dashboard" });
		}
	};

	return (
		<div className="max-w-3xl mx-auto py-6">
			{/* Multi-step progress indicator */}
			<div className="mb-10 px-2">
				<div className="flex items-center justify-between">
					{steps.map((s, idx) => (
						<div key={s.id} className="flex-1 relative flex items-center">
							<div className="flex items-center">
								<div
									className={cn(
										"flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",
										step > s.id
											? "bg-primary border-primary text-primary-foreground"
											: step === s.id
												? "border-primary text-primary bg-primary/10"
												: "border-muted text-muted-foreground bg-muted/20",
									)}
								>
									{step > s.id ? <Check className="h-5 w-5" /> : s.id}
								</div>
								<div className="ml-3 hidden md:block">
									<h2
										className={cn(
											"text-xs font-semibold uppercase tracking-wider",
											step === s.id ? "text-primary" : "text-muted-foreground",
										)}
									>
										{s.title}
									</h2>
									<p className="text-xs text-muted-foreground/80 font-normal">
										{s.description}
									</p>
								</div>
							</div>
							{idx < steps.length - 1 && (
								<div
									className={cn(
										"absolute top-5 left-10 right-4 h-[2px] -z-10 hidden md:block",
										step > s.id ? "bg-primary" : "bg-muted/40",
									)}
								/>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Form Content container */}
			<div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
				{step === 1 && <StepAcademic onComplete={() => setStep(2)} />}
				{step === 2 && (
					<StepClasses
						onComplete={() => setStep(3)}
						onBack={() => setStep(1)}
						onSkip={() => setStep(3)}
					/>
				)}
				{step === 3 && (
					<StepStaff
						onComplete={handleComplete}
						onBack={() => setStep(2)}
						onSkip={handleComplete}
					/>
				)}
			</div>
		</div>
	);
};

/* ==========================================
   STEP 1: ACADEMIC STRUCTURE
   ========================================== */
const StepAcademic: FC<{ onComplete: () => void }> = ({ onComplete }) => {
	const { mutate, isPending } = useOrpcMutation(
		orpc.onboarding.setupAcademicStructure.mutationOptions({
			onSuccess: onComplete,
		}),
	);

	const [form] = useBaseForm({
		schema: AcademicStructureSchema,
		defaultValues: {
			yearName: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
			startDate: new Date().toISOString().split("T")[0],
			endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
				.toISOString()
				.split("T")[0],
			gradingSystem: "PERCENTAGE",
		} as any,
	});

	const handleSubmit: SubmitHandler<AcademicStructureInput> = (v) => {
		mutate({
			...v,
			startDate: v.startDate.toISOString().split("T")[0],
			endDate: v.endDate.toISOString().split("T")[0],
			terms: v.terms?.map((t) => ({
				...t,
				startDate: t.startDate.toISOString().split("T")[0],
				endDate: t.endDate.toISOString().split("T")[0],
			})),
		});
	};

	return (
		<BaseForm form={form} onSubmit={handleSubmit} className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold mb-1">Academic Year Structure</h1>
				<p className="text-sm text-muted-foreground">
					Specify your school's current academic calendar and grading framework.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<BaseForm.Item
					control={form.control}
					name="yearName"
					label="Academic Year Name"
					required
				>
					<BaseInput placeholder="e.g. 2026-2027" />
				</BaseForm.Item>
				<BaseForm.Item
					control={form.control}
					name="gradingSystem"
					label="Grading System"
					required
				>
					<BaseSelect
						data={[
							{ label: "Percentage (%)", value: "PERCENTAGE" },
							{ label: "GPA (4.0 / 10.0)", value: "GPA" },
							{ label: "Letter Grade (A, B, C)", value: "LETTER" },
						]}
					/>
				</BaseForm.Item>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<BaseForm.Item
					control={form.control}
					name="startDate"
					label="Start Date"
					required
				>
					<BaseInput type="date" />
				</BaseForm.Item>
				<BaseForm.Item
					control={form.control}
					name="endDate"
					label="End Date"
					required
				>
					<BaseInput type="date" />
				</BaseForm.Item>
			</div>

			<BaseButton type="submit" isLoading={isPending} className="w-full mt-4">
				Save & Continue
			</BaseButton>
		</BaseForm>
	);
};

/* ==========================================
   STEP 2: CLASSES & SECTIONS SETUP
   ========================================== */
const UIClassSetupSchema = z.object({
	grades: z
		.array(
			z.object({
				name: z.string().min(1, "Name is required"),
				level: z.coerce.number().min(1, "Level is required"),
				sections: z.string().min(1, "At least one section is required"),
			}),
		)
		.min(1),
	defaultSubjects: z.array(z.string()).optional(),
});

type UIClassSetupInput = z.infer<typeof UIClassSetupSchema>;

const availableSubjects = [
	"Mathematics",
	"Science",
	"English",
	"Social Studies",
	"Art",
	"Physical Education",
];

const StepClasses: FC<{
	onComplete: () => void;
	onBack: () => void;
	onSkip: () => void;
}> = ({ onComplete, onBack, onSkip }) => {
	const { mutate, isPending } = useOrpcMutation(
		orpc.onboarding.setupClasses.mutationOptions({
			onSuccess: onComplete,
		}),
	);

	const [form] = useBaseForm({
		schema: UIClassSetupSchema,
		defaultValues: {
			grades: [
				{ name: "Grade 1", level: 1, sections: "A, B" },
				{ name: "Grade 2", level: 2, sections: "A, B" },
				{ name: "Grade 3", level: 3, sections: "A, B" },
				{ name: "Grade 4", level: 4, sections: "A, B" },
				{ name: "Grade 5", level: 5, sections: "A, B" },
			],
			defaultSubjects: ["Mathematics", "Science", "English", "Social Studies"],
		},
	});

	const selectedSubjects = form.watch("defaultSubjects") || [];
	const handleCheckboxChange = (subject: string, checked: boolean) => {
		if (checked) {
			form.setValue("defaultSubjects", [...selectedSubjects, subject]);
		} else {
			form.setValue(
				"defaultSubjects",
				selectedSubjects.filter((s: string) => s !== subject),
			);
		}
	};

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "grades",
	});

	const handleSubmit: SubmitHandler<UIClassSetupInput> = (values) => {
		mutate({
			grades: values.grades.map((g) => ({
				name: g.name,
				level: g.level,
				sections: g.sections
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean),
			})),
			defaultSubjects: values.defaultSubjects || [],
		});
	};

	return (
		<BaseForm form={form} onSubmit={handleSubmit} className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold mb-1">Classes & Sections</h1>
				<p className="text-sm text-muted-foreground">
					Configure the grades and classes available in your school. Separate multiple sections with commas.
				</p>
			</div>

			<div className="space-y-4">
				{fields.map((field, index) => (
					<div
						key={field.id}
						className="flex flex-col md:flex-row items-start md:items-end gap-3 p-4 bg-muted/20 border border-muted/50 rounded-xl relative group"
					>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
							<BaseForm.Item
								control={form.control}
								name={`grades.${index}.name`}
								label="Grade Name"
								required
							>
								<BaseInput placeholder="e.g. Grade 1" />
							</BaseForm.Item>

							<BaseForm.Item
								control={form.control}
								name={`grades.${index}.level`}
								label="Grade Level (Numeric)"
								required
							>
								<BaseInput type="number" placeholder="e.g. 1" />
							</BaseForm.Item>

							<BaseForm.Item
								control={form.control}
								name={`grades.${index}.sections`}
								label="Sections (Comma separated)"
								required
							>
								<BaseInput placeholder="e.g. A, B, C" />
							</BaseForm.Item>
						</div>

						{fields.length > 1 && (
							<BaseButton
								type="button"
								variant="ghost"
								size="icon"
								className="text-destructive hover:bg-destructive/10 hover:text-destructive h-10 w-10 shrink-0 self-end"
								onClick={() => remove(index)}
							>
								<Trash2 className="h-4 w-4" />
							</BaseButton>
						)}
					</div>
				))}
			</div>

			<BaseButton
				type="button"
				variant="outline"
				className="w-full border-dashed"
				onClick={() =>
					append({
						name: `Grade ${fields.length + 1}`,
						level: fields.length + 1,
						sections: "A, B",
					})
				}
			>
				<Plus className="h-4 w-4 mr-2" /> Add Grade Level
			</BaseButton>

			<div className="space-y-3 border-t pt-4">
				<div>
					<label className="text-sm font-semibold text-foreground">
						Default School Subjects
					</label>
					<p className="text-xs text-muted-foreground mt-0.5">
						Select the standard subjects to automatically initialize in your school's curriculum catalog.
					</p>
				</div>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-muted/10 border border-muted/50 p-4 rounded-xl">
					{availableSubjects.map((subject) => {
						const isChecked = selectedSubjects.includes(subject);
						return (
							<div key={subject} className="flex items-center space-x-2">
								<BaseCheckbox
									id={`subject-${subject}`}
									checked={isChecked}
									onCheckedChange={(checked) =>
										handleCheckboxChange(subject, !!checked)
									}
								/>
								<label
									htmlFor={`subject-${subject}`}
									className="text-sm font-medium leading-none cursor-pointer select-none"
								>
									{subject}
								</label>
							</div>
						);
					})}
				</div>
			</div>

			<div className="flex items-center justify-between gap-4 pt-4 border-t">
				<BaseButton type="button" variant="outline" onClick={onBack}>
					Back
				</BaseButton>
				<div className="flex items-center gap-2">
					<BaseButton type="button" variant="ghost" onClick={onSkip}>
						Skip
					</BaseButton>
					<BaseButton type="submit" isLoading={isPending}>
						Save & Continue
					</BaseButton>
				</div>
			</div>
		</BaseForm>
	);
};

/* ==========================================
   STEP 3: STAFF INVITATIONS
   ========================================== */
const UIStaffInvitationSchema = z.object({
	emails: z
		.array(
			z.object({
				email: z.string().email("Invalid email address"),
			}),
		)
		.min(1),
});

type UIStaffInvitationInput = z.infer<typeof UIStaffInvitationSchema>;

const StepStaff: FC<{
	onComplete: () => void;
	onBack: () => void;
	onSkip: () => void;
}> = ({ onComplete, onBack, onSkip }) => {
	const { mutate, isPending } = useOrpcMutation(
		orpc.onboarding.inviteStaff.mutationOptions({
			onSuccess: onComplete,
		}),
	);

	const [form] = useBaseForm({
		schema: UIStaffInvitationSchema,
		defaultValues: {
			emails: [{ email: "" }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "emails",
	});

	const handleSubmit: SubmitHandler<UIStaffInvitationInput> = (values) => {
		mutate({
			emails: values.emails.map((e) => e.email),
		});
	};

	return (
		<BaseForm form={form} onSubmit={handleSubmit} className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold mb-1">Invite Staff Members</h1>
				<p className="text-sm text-muted-foreground">
					Invite teachers and administration staff to your school by sending them access links.
				</p>
			</div>

			<div className="space-y-3">
				{fields.map((field, index) => (
					<div key={field.id} className="flex items-center gap-3">
						<div className="relative w-full">
							<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<BaseForm.Item
								control={form.control}
								name={`emails.${index}.email`}
								label=""
							>
								<BaseInput
									type="email"
									className="pl-9 h-10"
									placeholder="teacher@school.edu"
								/>
							</BaseForm.Item>
						</div>

						{fields.length > 1 && (
							<BaseButton
								type="button"
								variant="ghost"
								size="icon"
								className="text-destructive hover:bg-destructive/10 hover:text-destructive h-10 w-10 shrink-0"
								onClick={() => remove(index)}
							>
								<Trash2 className="h-4 w-4" />
							</BaseButton>
						)}
					</div>
				))}
			</div>

			<BaseButton
				type="button"
				variant="outline"
				className="w-full border-dashed"
				onClick={() => append({ email: "" })}
			>
				<Plus className="h-4 w-4 mr-2" /> Add Another Email
			</BaseButton>

			<div className="flex items-center justify-between gap-4 pt-4 border-t">
				<BaseButton type="button" variant="outline" onClick={onBack}>
					Back
				</BaseButton>
				<div className="flex items-center gap-2">
					<BaseButton
						type="button"
						variant="ghost"
						onClick={() => mutate({ emails: [] })}
						isLoading={isPending}
					>
						Skip & Finish
					</BaseButton>
					<BaseButton type="submit" isLoading={isPending}>
						Send & Finish
					</BaseButton>
				</div>
			</div>
		</BaseForm>
	);
};

export default OnboardingWizard;
