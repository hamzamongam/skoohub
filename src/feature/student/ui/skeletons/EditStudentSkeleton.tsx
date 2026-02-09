import { ContainerCard } from "@/components/base/ContainerCard";
import { PageLayout } from "@/components/layout/page-layout";
import { Skeleton } from "@/components/ui/skeleton";

function FormSectionSkeleton() {
	return (
		<div className="space-y-4">
			<div className="border-b pb-2">
				<Skeleton className="h-4 w-48" />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="md:col-span-2 space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-10 w-full" />
				</div>
				<div className="md:col-span-2 space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-10 w-full" />
				</div>
				<div className="md:col-span-2 space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-10 w-full" />
				</div>
				<div className="md:col-span-2 space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-10 w-full" />
				</div>
			</div>
		</div>
	);
}

function PersonalInfoSkeleton() {
	return (
		<div className="space-y-4">
			<div className="border-b pb-2">
				<Skeleton className="h-4 w-48" />
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				<div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{/* Name, Email, Phone */}
					<div className="md:col-span-2 lg:col-span-1 space-y-2">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-10 w-full" />
					</div>
					<div className="md:col-span-2 lg:col-span-1 space-y-2">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-10 w-full" />
					</div>
					<div className="md:col-span-2 lg:col-span-1 space-y-2">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-10 w-full" />
					</div>

					{/* DOB, Gender, Blood Group */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-10 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-10 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-10 w-full" />
					</div>

					{/* Address */}
					<div className="md:col-span-2 lg:col-span-3 space-y-2">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-10 w-full" />
					</div>
				</div>

				{/* Profile Image */}
				<div className="lg:col-span-2 order-first lg:order-last">
					<div className="space-y-2 h-full">
						<Skeleton className="h-4 w-24 lg:hidden" />
						<Skeleton className="h-40 w-full lg:h-full rounded-md" />
					</div>
				</div>
			</div>
		</div>
	);
}

export function EditStudentSkeleton() {
	return (
		<PageLayout title="Edit Student" subtitle="Update student information">
			<div className="max-w-full">
				<ContainerCard>
					<div className="space-y-8 animate-pulse">
						<PersonalInfoSkeleton />
						<FormSectionSkeleton />
						<FormSectionSkeleton />
						<div className="pt-4 space-x-4 flex">
							<Skeleton className="h-10 w-24" />
							<Skeleton className="h-10 w-24" />
						</div>
					</div>
				</ContainerCard>
			</div>
		</PageLayout>
	);
}
