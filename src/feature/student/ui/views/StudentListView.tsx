import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { FC } from "react";
import { BaseButton } from "@/components/base/button";
import { PageLayout } from "@/components/layout/page-layout";
import { StudentListFilters } from "../components/StudentListFilters";
import { StudentListTable } from "../components/StudentListTable";
import { useStudentFilters } from "../hooks/useStudentFilters";
import useStudentList from "../hooks/useStudentList";

const StudentListView: FC = () => {
	/* Filter State */
	const { filters, setFilter, resetFilters, isFiltered, debouncedSearch } =
		useStudentFilters();

	/* Data Fetching */
	const { data, isLoading } = useStudentList({
		search: debouncedSearch,
		classId: filters.classId,
		status: filters.status,
	});

	return (
		<PageLayout
			title="Students"
			subtitle="Manage your school's student directory and records"
			actions={
				<BaseButton
					type="button"
					variant={"default"}
					leftIcon={<Plus className="size-3.5" />}
					render={<Link to="/dashboard/students/add" />}
					className="flex h-10 items-center justify-center gap-2 rounded-xl bg-foreground px-4 text-xs font-bold text-background transition-all hover:scale-[1.02] active:scale-[0.98]"
				>
					Add Student
				</BaseButton>
			}
		>
			<StudentListFilters
				filters={filters}
				setFilter={setFilter}
				resetFilters={resetFilters}
				isFiltered={isFiltered}
			/>

			<StudentListTable
				data={data?.data || []}
				isLoading={isLoading}
			/>
		</PageLayout>
	);
};

export default StudentListView;
