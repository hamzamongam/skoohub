import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	Award,
	Calendar,
	Clock,
	CreditCard,
	Edit,
	FileText,
	LayoutDashboard,
	Mail,
	MapPin,
	Phone,
	Shield,
	User,
	UserCheck,
} from "lucide-react";
import type { FC } from "react";
import { BaseButton } from "@/components/base/button";
import { ContainerCard } from "@/components/base/ContainerCard";
import { PageLayout } from "@/components/layout/page-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentTimeTable } from "../components/StudentTimeTable";
import useStudentDetail from "../hooks/useStudentDetail";

const InfoItem: FC<{
	icon: any;
	label: string;
	value: string | null | undefined;
	className?: string;
}> = ({ icon: Icon, label, value, className }) => (
	<div className={`flex items-start gap-3 ${className}`}>
		<div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary">
			<Icon className="size-4" />
		</div>
		<div>
			<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
				{label}
			</p>
			<p className="text-sm font-semibold text-foreground mt-0.5">
				{value || "Not specified"}
			</p>
		</div>
	</div>
);

const SectionHeading: FC<{ title: string; icon: any }> = ({
	title,
	icon: Icon,
}) => (
	<div className="flex items-center gap-2 mb-6">
		<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
			<Icon className="size-5" />
		</div>
		<h3 className="text-lg font-bold tracking-tight">{title}</h3>
	</div>
);

const StudentDetailView: FC<{ studentId: string }> = ({ studentId }) => {
	const { student, isLoading } = useStudentDetail(studentId);
	const navigate = useNavigate();

	if (isLoading) {
		return (
			<PageLayout
				title="Loading Student..."
				subtitle="Please wait while we fetch the student details."
			>
				<div className="flex h-64 items-center justify-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				</div>
			</PageLayout>
		);
	}

	if (!student) {
		return (
			<PageLayout
				title="Student Not Found"
				subtitle="The student you are looking for does not exist."
			>
				<ContainerCard className="flex flex-col items-center justify-center h-64 text-center">
					<User className="size-12 text-muted-foreground/20 mb-4" />
					<p className="text-lg font-bold text-muted-foreground">
						Student Not Found
					</p>
					<BaseButton
						variant="outline"
						className="mt-4"
						onClick={() => navigate({ to: "/dashboard/students" })}
					>
						Back to Student List
					</BaseButton>
				</ContainerCard>
			</PageLayout>
		);
	}

	return (
		<PageLayout
			title="Student Details"
			subtitle={`Viewing profile for ${student.name}`}
			actions={
				<BaseButton
					onClick={() =>
						navigate({ to: `/dashboard/students/${studentId}/edit` })
					}
					variant="default"
					leftIcon={<Edit className="size-4" />}
					className="rounded-xl h-10 px-5 font-bold shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
				>
					Edit Profile
				</BaseButton>
			}
		>
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				{/* Sidebar Profile Card */}
				<div className="lg:col-span-1 space-y-6">
					<ContainerCard className="relative overflow-hidden border-none shadow-2xl bg-linear-to-b from-primary/5 to-background">
						<div className="absolute top-0 right-0 p-4">
							<Badge
								variant={student.isActive ? "success" : "secondary"}
								className="rounded-full px-3 py-1 font-bold"
							>
								{student.isActive ? "ACTIVE" : "INACTIVE"}
							</Badge>
						</div>

						<div className="flex flex-col items-center text-center pt-4">
							<div className="relative p-1 rounded-full bg-linear-to-tr from-primary to-primary-foreground shadow-2xl mb-6">
								<Avatar className="size-32 border-4 border-background">
									<AvatarImage
										src={student.image as string}
										alt={student.name}
									/>
									<AvatarFallback className="bg-muted text-3xl font-bold">
										{student.name.charAt(0)}
									</AvatarFallback>
								</Avatar>
							</div>

							<h2 className="text-2xl font-black tracking-tight mb-1">
								{student.name}
							</h2>
							<p className="text-muted-foreground font-medium mb-4 flex items-center gap-2 justify-center">
								<Mail className="size-3.5" /> {student.email}
							</p>

							<div className="grid grid-cols-2 gap-4 w-full mt-6">
								<div className="p-4 rounded-2xl bg-background shadow-sm border">
									<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
										Class
									</p>
									<p className="font-bold text-primary">
										{student.class?.name || "N/A"}
									</p>
								</div>
								<div className="p-4 rounded-2xl bg-background shadow-sm border">
									<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
										Roll No
									</p>
									<p className="font-bold text-primary">
										{student.rollNumber || "N/A"}
									</p>
								</div>
							</div>
						</div>
					</ContainerCard>

					<ContainerCard className="shadow-lg">
						<div className="space-y-6">
							<h4 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b pb-4">
								Essential Info
							</h4>
							<InfoItem icon={Phone} label="Contact" value={student.phone} />
							<InfoItem icon={MapPin} label="Address" value={student.address} />
							<InfoItem
								icon={Shield}
								label="Guardian"
								value={student.guardianName}
							/>
						</div>
					</ContainerCard>
				</div>

				{/* Main Content Area with Tabs */}
				<div className="lg:col-span-3">
					<Tabs defaultValue="overview" className="w-full">
						<TabsList className="mb-8 bg-background border shadow-sm w-full justify-start p-1.5 h-14">
							<TabsTrigger value="overview" className="gap-2">
								<LayoutDashboard className="size-4" />
								Overview
							</TabsTrigger>
							<TabsTrigger value="timetable" className="gap-2">
								<Clock className="size-4" />
								Time Table
							</TabsTrigger>
							<TabsTrigger value="attendance" className="gap-2">
								<Calendar className="size-4" />
								Attendance
							</TabsTrigger>
							<TabsTrigger value="fees" className="gap-2">
								<CreditCard className="size-4" />
								Fees
							</TabsTrigger>
						</TabsList>

						<TabsContent
							value="overview"
							className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<ContainerCard className="shadow-xl">
									<SectionHeading title="Academic Profile" icon={Award} />
									<div className="grid grid-cols-1 gap-y-6">
										<InfoItem
											icon={UserCheck}
											label="Admission Number"
											value={student.admissionNumber}
										/>
										<InfoItem
											icon={Calendar}
											label="Joining Date"
											value={
												student.joiningDate
													? format(new Date(student.joiningDate), "PPP")
													: "N/A"
											}
										/>
										<InfoItem
											icon={Award}
											label="Current Class"
											value={student.class?.name}
										/>
										<InfoItem
											icon={FileText}
											label="System ID"
											value={student.id}
										/>
									</div>
								</ContainerCard>

								<ContainerCard className="shadow-xl">
									<SectionHeading title="Personal Details" icon={User} />
									<div className="grid grid-cols-1 gap-y-6">
										<InfoItem
											icon={Calendar}
											label="Date of Birth"
											value={
												student.dob
													? format(new Date(student.dob), "PPP")
													: "N/A"
											}
										/>
										<InfoItem
											icon={User}
											label="Gender"
											value={student.gender}
										/>
										<InfoItem
											icon={Shield}
											label="Blood Group"
											value={student.bloodGroup}
										/>
										<div className="grid grid-cols-2 gap-4">
											<InfoItem
												icon={User}
												label="Father"
												value={student.fatherName}
											/>
											<InfoItem
												icon={User}
												label="Mother"
												value={student.motherName}
											/>
										</div>
									</div>
								</ContainerCard>
							</div>

							<ContainerCard className="shadow-xl bg-muted/5">
								<SectionHeading title="Guardian Information" icon={Shield} />
								<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
									<InfoItem
										icon={User}
										label="Guardian Name"
										value={student.guardianName}
									/>
									<InfoItem
										icon={Shield}
										label="Relation"
										value={student.guardianRelation}
									/>
									<InfoItem
										icon={Phone}
										label="Phone"
										value={student.guardianPhone}
									/>
									<InfoItem
										icon={Mail}
										label="Email"
										value={student.guardianEmail}
									/>
								</div>
							</ContainerCard>
						</TabsContent>

						<TabsContent
							value="timetable"
							className="animate-in fade-in slide-in-from-bottom-4 duration-500"
						>
							<StudentTimeTable />
						</TabsContent>

						<TabsContent value="attendance">
							<ContainerCard className="flex flex-col items-center justify-center p-20 text-center border-dashed">
								<Calendar className="size-16 text-muted-foreground/20 mb-4" />
								<h3 className="text-xl font-bold text-muted-foreground">
									Attendance module coming soon
								</h3>
								<p className="text-muted-foreground/60 max-w-sm mt-2">
									Track student attendance records, leave applications, and
									monthly summaries.
								</p>
							</ContainerCard>
						</TabsContent>

						<TabsContent value="fees">
							<ContainerCard className="flex flex-col items-center justify-center p-20 text-center border-dashed">
								<CreditCard className="size-16 text-muted-foreground/20 mb-4" />
								<h3 className="text-xl font-bold text-muted-foreground">
									Fee management coming soon
								</h3>
								<p className="text-muted-foreground/60 max-w-sm mt-2">
									View paid installments, upcoming payments, and generate fee
									receipts.
								</p>
							</ContainerCard>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</PageLayout>
	);
};

export default StudentDetailView;
