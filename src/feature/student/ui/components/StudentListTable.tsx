import type { FC } from "react";
import { DataTable } from "@/components/base/datatable";
import { getStudentColumns } from "../../config/student-columns";
import type { StudentSchemaOutputType } from "../../contract/student.shema";

interface StudentListTableProps {
	data: StudentSchemaOutputType[];
	isLoading: boolean;
	onEdit: (student: StudentSchemaOutputType) => void;
}

export const StudentListTable: FC<StudentListTableProps> = ({
	data,
	isLoading,
	onEdit,
}) => {
	const columns = getStudentColumns(onEdit);

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
