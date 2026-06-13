import type { FC } from "react";
import { DataTable } from "@/components/base/datatable";
import { getStudentColumns } from "../../config/student-columns";
import type { StudentSchemaOutputType } from "../../contract/student.schema";

interface StudentListTableProps {
	data: StudentSchemaOutputType[];
	isLoading: boolean;
}

export const StudentListTable: FC<StudentListTableProps> = ({
	data,
	isLoading,
}) => {
	const columns = getStudentColumns();

	return (
		<DataTable
			columns={columns}
			data={data}
			searchKey="name"
			searchPlaceholder="Search by student name..."
			isLoading={isLoading}
			onBulkDelete={(_ids) => {
				// Implement bulk delete
			}}
		/>
	);
};
