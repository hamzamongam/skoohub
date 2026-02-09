import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/server/orpc/client";

/**
 * Custom hook to fetch student details.
 * @param studentId The ID of the student to fetch.
 */
export const useStudentDetail = (studentId: string) => {
	const { data, isLoading, error, refetch } = useQuery(
		orpc.student.get.queryOptions({
			input: {
				id: studentId,
			},
		}),
	);

	return {
		student: data?.data,
		isLoading,
		error,
		refetch,
	};
};

export default useStudentDetail;
