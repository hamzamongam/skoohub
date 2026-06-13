import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/server/orpc/client";

const useClassList = () => {
	const data = useQuery(orpc.class.list.queryOptions({}));
	return data;
};

export default useClassList;
