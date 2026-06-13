import { Search, X } from "lucide-react";
import type { FC } from "react";
import { BaseButton } from "@/components/base/button";
import { BaseSelect } from "@/components/base/select";
import { Input } from "@/components/ui/input";
import useClassList from "@/feature/class/ui/hooks/useClassList";
import type { StudentFilters } from "../hooks/useStudentFilters";

interface StudentListFiltersProps {
	filters: StudentFilters;
	setFilter: (key: keyof StudentFilters, value: string) => void;
	resetFilters: () => void;
	isFiltered: boolean;
}

export const StudentListFilters: FC<StudentListFiltersProps> = ({
	filters,
	setFilter,
	resetFilters,
	isFiltered,
}) => {
	const { data: classList } = useClassList();

	return (
		<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			{/* Search Input */}
			<div className="relative w-full max-w-sm">
				<Input
					placeholder="Search by name or email..."
					value={filters.search}
					onChange={(e) => setFilter("search", e.target.value)}
					className="h-10 rounded-xl border-input bg-background pl-10"
				/>
				<div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
					<Search className="size-4" />
				</div>
			</div>

			<BaseSelect
				className="w-full"
				value={filters.classId}
				onChange={(value) => setFilter("classId", value)}
				data={[
					{ value: "all", label: "All Classes" },
					...(classList?.data?.map((cls) => ({
						value: cls.id,
						label: cls.name,
					})) || []),
				]}
			/>

			<BaseSelect
				className="w-full"
				value={filters.status}
				onChange={(value) => setFilter("status", value)}
				data={[
					{ value: "all", label: "All Status" },
					{ value: "active", label: "Active" },
					{ value: "inactive", label: "Inactive" },
				]}
			/>

			{isFiltered && (
				<BaseButton
					variant="outline"
					size="sm"
					onClick={resetFilters}
					className="h-10 px-4"
					leftIcon={<X className="size-4" />}
				>
					Reset Filters
				</BaseButton>
			)}
		</div>
	);
};
