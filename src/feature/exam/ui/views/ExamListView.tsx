import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, Calendar, Plus, Settings } from "lucide-react";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { BaseButton } from "@/components/base/button";
import BaseModal from "@/components/base/dialog/BaseModal";
import { BaseInput } from "@/components/base/input";
import { BaseSelect } from "@/components/base/select";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";
import type {
	ExamResponse,
} from "../../contract/exam.schema";

export const ExamListView: FC = () => {
	const queryClient = useQueryClient();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

	// Create Exam Form State
	const [examName, setExamName] = useState("");
	const [selectedYearId, setSelectedYearId] = useState("");

	// Configure Exam Subjects Form State
	const [selectedExam, setSelectedExam] = useState<ExamResponse | null>(null);
	const [selectedClassId, setSelectedClassId] = useState("");
	const [subjectConfigs, setSubjectConfigs] = useState<
		{
			subjectId: string;
			subjectName: string;
			enabled: boolean;
			maxMarks: number;
			passingMarks: number;
			examDate: string;
		}[]
	>([]);

	// 1. Fetch academic years, classes, subjects, and exams
	const { data: yearsData } = useQuery(
		orpc.exam.listAcademicYears.queryOptions(),
	);
	const { data: classesData } = useQuery(orpc.class.list.queryOptions());
	const { data: subjectsData } = useQuery(
		orpc.exam.listSubjects.queryOptions(),
	);
	const { data: examsData, isLoading: isLoadingExams } = useQuery(
		orpc.exam.list.queryOptions(),
	);

	const academicYears = yearsData?.data ?? [];
	const classes = classesData?.data ?? [];
	const allSubjects = subjectsData?.data ?? [];
	const exams = examsData?.data ?? [];

	// 2. Mutations
	const { mutate: createExam, isPending: isCreating } = useOrpcMutation(
		orpc.exam.create.mutationOptions({
			onSuccess: () => {
				setIsCreateModalOpen(false);
				setExamName("");
				setSelectedYearId("");
				queryClient.invalidateQueries({ queryKey: orpc.exam.list.queryKey() });
			},
		}),
		{
			successMessage: "Exam cycle created successfully!",
		},
	);

	const { mutate: configureSubjects, isPending: isConfiguring } =
		useOrpcMutation(
			orpc.exam.configureSubjects.mutationOptions({
				onSuccess: () => {
					setIsConfigModalOpen(false);
					setSelectedExam(null);
					setSelectedClassId("");
					setSubjectConfigs([]);
				},
			}),
			{
				successMessage: "Subject configurations saved successfully!",
			},
		);

	// Fetch existing configurations when class is selected
	const { refetch: fetchExistingConfig } = useQuery({
		...orpc.exam.getSubjects.queryOptions({
			input: {
				examId: selectedExam?.id ?? "",
				classId: selectedClassId,
			},
		}),
		enabled: false,
	});

	const handleClassChange = async (classId: string) => {
		setSelectedClassId(classId);
		if (!selectedExam || !classId) return;

		const { data: existing } = await fetchExistingConfig();
		const configured = existing?.data ?? [];

		const initialConfigs = allSubjects.map((sub) => {
			const active = configured.find((c) => c.subjectId === sub.id);
			return {
				subjectId: sub.id,
				subjectName: sub.name,
				enabled: !!active,
				maxMarks: active?.maxMarks ?? 100,
				passingMarks: active?.passingMarks ?? 35,
				examDate: active?.examDate
					? new Date(active.examDate).toISOString().split("T")[0]
					: "",
			};
		});
		setSubjectConfigs(initialConfigs);
	};

	const handleConfigSubjectChange = (
		subjectId: string,
		fields: Partial<(typeof subjectConfigs)[0]>,
	) => {
		setSubjectConfigs((prev) =>
			prev.map((c) => (c.subjectId === subjectId ? { ...c, ...fields } : c)),
		);
	};

	const handleCreateExamSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!examName || !selectedYearId) {
			toast.error("Please fill in all fields");
			return;
		}
		createExam({
			name: examName,
			academicYearId: selectedYearId,
		});
	};

	const handleConfigSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedExam || !selectedClassId) return;

		const activeConfigs = subjectConfigs.filter((c) => c.enabled);
		if (activeConfigs.length === 0) {
			toast.error("Please enable and configure at least one subject");
			return;
		}

		configureSubjects({
			examId: selectedExam.id,
			classId: selectedClassId,
			subjects: activeConfigs.map((c) => ({
				subjectId: c.subjectId,
				maxMarks: c.maxMarks,
				passingMarks: c.passingMarks,
				examDate: c.examDate || null,
			})),
		});
	};

	return (
		<div className="space-y-6 p-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Exam Cycles</h1>
					<p className="text-muted-foreground">
						Set up exams, define subject papers, max marks, and dates.
					</p>
				</div>
				<BaseButton
					onClick={() => setIsCreateModalOpen(true)}
					className="h-10 px-4 flex items-center gap-2"
				>
					<Plus className="h-4.5 w-4.5" />
					Create Exam Cycle
				</BaseButton>
			</div>

			{/* Exam List Grid */}
			{isLoadingExams ? (
				<div className="p-12 text-center text-muted-foreground">
					Loading exams list...
				</div>
			) : exams.length === 0 ? (
				<div className="bg-card border border-dashed rounded-2xl p-16 text-center text-muted-foreground">
					No exam cycles configured. Click "Create Exam Cycle" to get started.
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{exams.map((exam) => {
						const year = academicYears.find(
							(y) => y.id === exam.academicYearId,
						);
						return (
							<div
								key={exam.id}
								className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
							>
								{/* Decorative gradient header accent */}
								<div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 to-indigo-600" />

								<div className="flex items-start justify-between gap-4 mt-2">
									<div>
										<h3 className="font-semibold text-lg leading-snug group-hover:text-violet-600 transition-colors">
											{exam.name}
										</h3>
										<div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
											<Calendar className="h-3.5 w-3.5" />
											<span>AY: {year ? year.name : "Unknown"}</span>
										</div>
									</div>
									<div className="bg-violet-500/10 p-2.5 rounded-xl text-violet-600">
										<Award className="h-5 w-5" />
									</div>
								</div>

								<div className="mt-6 pt-4 border-t flex gap-3">
									<BaseButton
										onClick={() => {
											setSelectedExam(exam);
											setIsConfigModalOpen(true);
										}}
										variant="outline"
										className="flex-1 flex items-center justify-center gap-2 text-xs h-9"
									>
										<Settings className="h-3.5 w-3.5" />
										Configure Subjects
									</BaseButton>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Create Exam Modal */}
			<BaseModal
				open={isCreateModalOpen}
				onOpenChange={(open) => setIsCreateModalOpen(!!open)}
				title="Create Exam Cycle"
			>
				<form onSubmit={handleCreateExamSubmit} className="space-y-4 pt-2">
					<div className="space-y-1.5">
						<label className="text-sm font-medium">Exam Name</label>
						<BaseInput
							placeholder="e.g., Term 1 Final Exam"
							value={examName}
							onChange={(e) => setExamName(e.target.value)}
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-sm font-medium">Academic Year</label>
						<BaseSelect
							value={selectedYearId}
							onChange={(val) => setSelectedYearId(val)}
							placeholder="Select Academic Year"
							data={academicYears.map((y) => ({
								label: `${y.name}${y.isActive ? " (Active)" : ""}`,
								value: y.id,
							}))}
						/>
					</div>

					<div className="pt-2 flex justify-end gap-3">
						<BaseButton
							type="button"
							variant="outline"
							onClick={() => setIsCreateModalOpen(false)}
						>
							Cancel
						</BaseButton>
						<BaseButton type="submit" isLoading={isCreating}>
							Create
						</BaseButton>
					</div>
				</form>
			</BaseModal>

			{/* Configure Subjects Modal */}
			<BaseModal
				open={isConfigModalOpen}
				onOpenChange={(open) => setIsConfigModalOpen(!!open)}
				title={`Configure Subjects - ${selectedExam?.name}`}
				className="sm:max-w-xl"
			>
				<form onSubmit={handleConfigSubmit} className="space-y-4 pt-2">
					<div className="space-y-1.5">
						<label className="text-sm font-medium">Select Class</label>
						<BaseSelect
							value={selectedClassId}
							onChange={handleClassChange}
							placeholder="Choose Class"
							data={classes.map((c) => ({
								label: `${c.name}`,
								value: c.id,
							}))}
						/>
					</div>

					{selectedClassId && (
						<div className="space-y-3 pt-2">
							<div className="text-sm font-semibold border-b pb-2">
								Subjects Setup
							</div>
							<div className="max-h-64 overflow-y-auto space-y-3 pr-2 divide-y divide-muted/50">
								{subjectConfigs.map((config) => (
									<div
										key={config.subjectId}
										className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 first:pt-0"
									>
										<label className="flex items-center gap-2 min-w-36 text-sm font-medium">
											<input
												type="checkbox"
												checked={config.enabled}
												onChange={(e) =>
													handleConfigSubjectChange(config.subjectId, {
														enabled: e.target.checked,
													})
												}
												className="rounded border-gray-300 text-violet-600 focus:ring-violet-500 h-4 w-4"
											/>
											<span
												className={
													config.enabled
														? "font-semibold"
														: "text-muted-foreground"
												}
											>
												{config.subjectName}
											</span>
										</label>

										{config.enabled && (
											<div className="flex-1 grid grid-cols-3 gap-2">
												<BaseInput
													type="number"
													placeholder="Max Marks"
													value={config.maxMarks}
													onChange={(e) =>
														handleConfigSubjectChange(config.subjectId, {
															maxMarks: Number(e.target.value),
														})
													}
													className="h-8 text-xs"
												/>
												<BaseInput
													type="number"
													placeholder="Passing"
													value={config.passingMarks}
													onChange={(e) =>
														handleConfigSubjectChange(config.subjectId, {
															passingMarks: Number(e.target.value),
														})
													}
													className="h-8 text-xs"
												/>
												<BaseInput
													type="date"
													value={config.examDate}
													onChange={(e) =>
														handleConfigSubjectChange(config.subjectId, {
															examDate: e.target.value,
														})
													}
													className="h-8 text-xs px-2"
												/>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					)}

					<div className="pt-4 flex justify-end gap-3 border-t">
						<BaseButton
							type="button"
							variant="outline"
							onClick={() => {
								setIsConfigModalOpen(false);
								setSelectedClassId("");
								setSubjectConfigs([]);
							}}
						>
							Cancel
						</BaseButton>
						<BaseButton
							type="submit"
							isLoading={isConfiguring}
							disabled={!selectedClassId || isConfiguring}
						>
							Save Configuration
						</BaseButton>
					</div>
				</form>
			</BaseModal>
		</div>
	);
};

export default ExamListView;
