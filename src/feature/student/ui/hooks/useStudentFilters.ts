import { useEffect, useState } from "react";

export interface StudentFilters {
	search: string;
	classId: string;
	status: string;
}

export const useStudentFilters = () => {
	const [filters, setFilters] = useState<StudentFilters>({
		search: "",
		classId: "all",
		status: "all",
	});

	const [debouncedSearch, setDebouncedSearch] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(filters.search);
		}, 500);

		return () => clearTimeout(timer);
	}, [filters.search]);

	const setFilter = (key: keyof StudentFilters, value: string) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const resetFilters = () => {
		setFilters({
			search: "",
			classId: "all",
			status: "all",
		});
	};

	const isFiltered =
		filters.search !== "" ||
		filters.classId !== "all" ||
		filters.status !== "all";

	return {
		filters,
		debouncedSearch,
		setFilter,
		resetFilters,
		isFiltered,
	};
};
