import { useQuery } from "@tanstack/react-query";
import { FileText, Save } from "lucide-react";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { BaseButton } from "@/components/base/button";
import { BaseInput } from "@/components/base/input";
import { BaseSelect } from "@/components/base/select";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";

export const EnterScoresView: FC = () => {
	const [selectedExamId, setSelectedExamId] = useState("");
	const [selectedClassId, setSelectedClassId] = useState("");
	const [selectedExamSubjectId, setSelectedExamSubjectId] = useState("");

	// Local state for entered scores
	const [scoreRecords, setScoreRecords] = useState<
		{
			studentId: string;
			studentName: string;
			rollNumber: string | null;
			marksObtained: string;
			remarks: string;
		}[]
	>([]);

	// 1. Queries
	const { data: examsData, isLoading: isLoadingExams } = useQuery(
		orpc.exam.list.queryOptions(),
	);
	const { data: classesData, isLoading: isLoadingClasses } = useQuery(
		orpc.class.list.queryOptions(),
	);

	const exams = examsData?.data ?? [];
	const classes = classesData?.data ?? [];

	// Fetch configured subjects for chosen exam + class
	const { data: subjectsData, isLoading: isLoadingSubjects } = useQuery({
		...orpc.exam.getSubjects.queryOptions({
			input: {
				examId: selectedExamId,
				classId: selectedClassId,
			},
		}),
		enabled: !!selectedExamId && !!selectedClassId,
	});

	const examSubjects = subjectsData?.data ?? [];
	const currentExamSubject = examSubjects.find(
		(s) => s.id === selectedExamSubjectId,
	);

	// Fetch scores for chosen exam subject
	const {
		data: scoresData,
		isLoading: isLoadingScores,
		refetch,
	} = useQuery({
		...orpc.exam.getScores.queryOptions({
			input: {
				examSubjectId: selectedExamSubjectId,
			},
		}),
		enabled: !!selectedExamSubjectId,
	});

	// Synchronize local score records when scores data is loaded
	const originalScores = scoresData?.data ?? [];
	const syncScores = () => {
		if (originalScores.length > 0) {
			setScoreRecords(
				originalScores.map((s) => ({
					studentId: s.studentId,
					studentName: s.studentName,
					rollNumber: s.rollNumber,
					marksObtained:
						s.marksObtained !== null ? String(s.marksObtained) : "",
					remarks: s.remarks ?? "",
				})),
			);
		} else {
			setScoreRecords([]);
		}
	};

	// Use useEffect equivalent on query load
	const [lastLoadedSubjectId, setLastLoadedSubjectId] = useState("");
	if (
		selectedExamSubjectId !== lastLoadedSubjectId &&
		!isLoadingScores &&
		originalScores.length > 0
	) {
		syncScores();
		setLastLoadedSubjectId(selectedExamSubjectId);
	}

	// 2. Mutations
	const { mutate: recordScores, isPending: isSaving } = useOrpcMutation(
		orpc.exam.recordScores.mutationOptions({
			onSuccess: () => {
				refetch();
			},
		}),
		{
			successMessage: "Scores recorded successfully!",
		},
	);

	const handleMarkChange = (studentId: string, value: string) => {
		setScoreRecords((prev) =>
			prev.map((rec) =>
				rec.studentId === studentId ? { ...rec, marksObtained: value } : rec,
			),
		);
	};

	const handleRemarksChange = (studentId: string, value: string) => {
		setScoreRecords((prev) =>
			prev.map((rec) =>
				rec.studentId === studentId ? { ...rec, remarks: value } : rec,
			),
		);
	};

	const handleSave = () => {
		if (!selectedExamSubjectId || !currentExamSubject) return;

		// Validation: check for exceeding max marks
		for (const rec of scoreRecords) {
			if (rec.marksObtained === "") continue;

			const marks = Number(rec.marksObtained);
			if (Number.isNaN(marks)) {
				toast.error(`Invalid marks entered for student ${rec.studentName}`);
				return;
			}
			if (marks > currentExamSubject.maxMarks) {
				toast.error(
					`Marks for ${rec.studentName} (${marks}) exceed maximum marks allowed (${currentExamSubject.maxMarks})`,
				);
				return;
			}
		}

		// Filter out empty entries and map
		const scores = scoreRecords
			.filter((r) => r.marksObtained !== "")
			.map((r) => ({
				studentId: r.studentId,
				marksObtained: Number(r.marksObtained),
				remarks: r.remarks || null,
			}));

		if (scores.length === 0) {
			toast.info("No scores entered to save.");
			return;
		}

		recordScores({
			examSubjectId: selectedExamSubjectId,
			scores,
		});
	};

	return (
		<div className="space-y-6 p-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Record Exam Scores
				</h1>
				<p className="text-muted-foreground">
					Enter and update test marks for your class rosters.
				</p>
			</div>

			{/* Filters bar */}
			<div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-end gap-4">
				<div className="w-full md:flex-1 space-y-2">
					<label className="text-sm font-medium">Select Exam</label>
					<BaseSelect
						value={selectedExamId}
						onChange={(val) => {
							setSelectedExamId(val);
							setSelectedExamSubjectId("");
							setScoreRecords([]);
						}}
						placeholder={isLoadingExams ? "Loading exams..." : "Choose Exam"}
						data={exams.map((e) => ({ label: e.name, value: e.id }))}
					/>
				</div>

				<div className="w-full md:flex-1 space-y-2">
					<label className="text-sm font-medium">Select Class</label>
					<BaseSelect
						value={selectedClassId}
						onChange={(val) => {
							setSelectedClassId(val);
							setSelectedExamSubjectId("");
							setScoreRecords([]);
						}}
						placeholder={
							isLoadingClasses ? "Loading classes..." : "Choose Class"
						}
						data={classes.map((c) => ({ label: c.name, value: c.id }))}
					/>
				</div>

				<div className="w-full md:flex-1 space-y-2">
					<label className="text-sm font-medium">Select Subject</label>
					<BaseSelect
						value={selectedExamSubjectId}
						onChange={(val) => {
							setSelectedExamSubjectId(val);
							setScoreRecords([]);
							setLastLoadedSubjectId(""); // Reset trigger to reload
						}}
						disabled={!selectedExamId || !selectedClassId}
						placeholder={
							isLoadingSubjects ? "Loading subjects..." : "Choose Subject"
						}
						data={examSubjects.map((s) => ({
							label: `${s.subjectName} (${s.maxMarks} Max)`,
							value: s.id,
						}))}
					/>
				</div>
			</div>

			{/* Roster / Score Entry Grid */}
			{selectedExamSubjectId ? (
				<div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
					{isLoadingScores ? (
						<div className="p-12 text-center text-muted-foreground">
							Loading class list...
						</div>
					) : scoreRecords.length === 0 ? (
						<div className="p-12 text-center text-muted-foreground">
							No students found in this class.
						</div>
					) : (
						<div className="divide-y">
							{/* Exam detail badge header */}
							{currentExamSubject && (
								<div className="px-6 py-4 bg-muted/10 flex flex-wrap items-center justify-between gap-4 border-b">
									<div className="flex items-center gap-2 text-sm font-medium">
										<FileText className="h-4.5 w-4.5 text-indigo-500" />
										<span>
											Subject:{" "}
											<strong className="text-indigo-600 dark:text-indigo-400">
												{currentExamSubject.subjectName}
											</strong>
										</span>
									</div>
									<div className="flex gap-4 text-xs text-muted-foreground">
										<div className="flex items-center gap-1">
											<Award className="h-3.5 w-3.5" />
											<span>
												Max Marks:{" "}
												<strong>{currentExamSubject.maxMarks}</strong>
											</span>
										</div>
										<div className="flex items-center gap-1">
											<CheckCircle className="h-3.5 w-3.5" />
											<span>
												Passing:{" "}
												<strong>{currentExamSubject.passingMarks}</strong>
											</span>
										</div>
									</div>
								</div>
							)}

							{/* Table Header */}
							<div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								<div className="col-span-2 md:col-span-1">Roll No</div>
								<div className="col-span-6 md:col-span-4">Student Name</div>
								<div className="col-span-4 md:col-span-3 text-center">
									Marks Obtained
								</div>
								<div className="col-span-12 md:col-span-4">Remarks</div>
							</div>

							{/* Table Body */}
							<div className="divide-y">
								{scoreRecords.map((record) => (
									<div
										key={record.studentId}
										className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/5 transition-colors"
									>
										{/* Roll number */}
										<div className="col-span-2 md:col-span-1 text-sm font-medium">
											{record.rollNumber || "—"}
										</div>

										{/* Student Name */}
										<div className="col-span-6 md:col-span-4 text-sm font-semibold">
											{record.studentName}
										</div>

										{/* Marks input */}
										<div className="col-span-4 md:col-span-3 flex items-center justify-center gap-2">
											<BaseInput
												type="number"
												value={record.marksObtained}
												onChange={(e) =>
													handleMarkChange(record.studentId, e.target.value)
												}
												placeholder="Enter marks"
												className="w-24 text-center h-9"
												max={currentExamSubject?.maxMarks}
												min={0}
											/>
											<span className="text-xs text-muted-foreground">
												/ {currentExamSubject?.maxMarks}
											</span>
										</div>

										{/* Remarks */}
										<div className="col-span-12 md:col-span-4">
											<BaseInput
												placeholder="Add feedback note"
												value={record.remarks}
												onChange={(e) =>
													handleRemarksChange(record.studentId, e.target.value)
												}
												className="h-9 text-xs"
											/>
										</div>
									</div>
								))}
							</div>

							{/* Save button footer */}
							<div className="flex justify-end p-6 bg-muted/5">
								<BaseButton
									type="button"
									onClick={handleSave}
									isLoading={isSaving}
									disabled={isSaving}
									className="w-full sm:w-auto px-8 flex items-center justify-center gap-2"
								>
									<Save className="h-4 w-4" />
									Save Scores
								</BaseButton>
							</div>
						</div>
					)}
				</div>
			) : (
				<div className="bg-card border border-dashed rounded-2xl p-16 text-center text-muted-foreground">
					Please select an exam, a class, and a subject from the controls above
					to record scores.
				</div>
			)}
		</div>
	);
};

// Placeholder sub-components used to avoid compilation errors
const Award: FC<{ className?: string }> = ({ className }) => (
	<svg
		className={className}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
		<circle cx="12" cy="8" r="6" />
	</svg>
);

const CheckCircle: FC<{ className?: string }> = ({ className }) => (
	<svg
		className={className}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
		<polyline points="22 4 12 14.01 9 11.01" />
	</svg>
);

export default EnterScoresView;
