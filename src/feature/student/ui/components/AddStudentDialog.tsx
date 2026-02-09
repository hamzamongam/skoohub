"use client";

import { Plus } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import useStudentForm from "../hooks/useStudentForm";
import StudentForm from "./StudentForm";

interface AddStudentDialogProps {
	schoolId: string;
	onSuccess?: () => void;
}

const AddStudentDialog: FC<AddStudentDialogProps> = ({
	schoolId,
	onSuccess,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const { form, handleSubmit, isPending } = useStudentForm({
		onSuccess: () => {
			setIsOpen(false);
			onSuccess?.();
		},
	});

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger
				render={
					<Button className="h-11 px-6 rounded-2xl gap-2 font-black transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
						<Plus className="size-4" />
						Add Student
					</Button>
				}
			/>
			<SheetContent
				side="right"
				className="sm:max-w-md p-0 border-none glass shadow-2xl"
			>
				<div className="h-full flex flex-col">
					<SheetHeader className="p-8 pt-12">
						<div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
							<Plus className="size-6" />
						</div>
						<SheetTitle className="text-3xl font-black tracking-tight">
							Register Student
						</SheetTitle>
						<SheetDescription className="text-sm font-medium text-muted-foreground/60 leading-relaxed">
							Add a new student to the system. They will be notified via email
							to complete their profile.
						</SheetDescription>
					</SheetHeader>

					<div className="flex-1 px-8 overflow-y-auto no-scrollbar pb-10">
						<StudentForm
							form={form}
							handleSubmit={handleSubmit}
							isPending={isPending}
						/>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default AddStudentDialog;
