import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/server/orpc/client";

const useStudentList = () => {
	const data = useQuery(orpc.student.list.queryOptions({}));
	return data;
};

export default useStudentList;
