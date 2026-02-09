import { auth } from "@/server/auth";
import { NotFoundError, UnauthorizedError } from "@/utils/errors";
import type {
	ClassSchemaInputType,
	ClassSchemaOutputType,
} from "../contract/class.schema";
import { ClassRepository } from "../repo/class.repo";
import type { ClassDbModel } from "../types/server.type";

export class ClassService {
	private repo: ClassRepository;

	constructor() {
		this.repo = new ClassRepository();
	}

	async create(data: ClassSchemaInputType, schoolId: string) {
		if (!schoolId) {
			throw new UnauthorizedError("User is not associated with a school");
		}

		const postData = {
			name: data.name ?? null,
			grade: data.grade ?? null,
			section: data.section ?? null,
			medium: data.medium ?? null,
			classTeacherId: data.classTeacherId || null,
			capacity: data.capacity ?? null,
			isActive: data.isActive ?? true,
			schoolId,
		};
		console.log(postData);

		const result = await this.repo.create(postData);

		const outPutData = this.formatOutputData(result);
		return outPutData;
	}

	async update(id: string, data: Partial<ClassSchemaInputType>) {
		const result = await this.repo.update(id, data);
		const outPutData = this.formatOutputData(result);
		return outPutData;
	}

	async delete(id: string) {
		return this.repo.delete(id);
	}

	async getById(id: string) {
		const result = await this.repo.findById(id);
		if (!result) {
			throw new NotFoundError("Class not found");
		}
		const outPutData = this.formatOutputData(result);
		return outPutData;
	}

	async list(schoolId: string) {
		if (!schoolId) {
			throw new UnauthorizedError("User is not associated with a school");
		}

		const result = await this.repo.listBySchoolId(schoolId);
		console.log(result);
		const outPutData = result.map((data) => this.formatOutputData(data));
		return outPutData;
	}

	private formatOutputData(data: ClassDbModel) {
		return {
			id: data.id,
			name: data.name,
			grade: data.grade,
			section: data.section,
			medium: data.medium,
			classTeacherId: data.classTeacherId,
			capacity: data.capacity,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			isActive: data.isActive,
			schoolId: data.schoolId,
			totalStudents: data?._count?.students ?? 0,
			classTeacherName: data.classTeacher?.user?.name || "",
		};
	}
}
