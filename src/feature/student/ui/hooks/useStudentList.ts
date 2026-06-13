import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/server/orpc/client";

const useStudentList = (filters?: {
	search?: string;
	classId?: string;
	status?: string;
}) => {
	const data = useQuery(orpc.student.list.queryOptions({ input: filters }));
	return data;
};

export default useStudentList;
