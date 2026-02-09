import { UnauthorizedError } from "@/utils/errors";
import { TeacherRepository } from "../repo/teacher.repo";

export class TeacherService {
	private repo: TeacherRepository;

	constructor() {
		this.repo = new TeacherRepository();
	}

	async list(schoolId: string) {
		if (!schoolId) {
			throw new UnauthorizedError("User is not associated with a school");
		}

		return this.repo.list(schoolId);
	}
}
