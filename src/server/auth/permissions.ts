import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
	...defaultStatements,
	school: ["create", "list", "update", "delete"],
	student: ["create", "list", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

// const superAdmin = ac.newRole({
//     school: ["create", "update"],
//     ...adminAc.statements,
// });

export const roles = {
	user: ac.newRole({
		school: ["list"],
		student: ["list"],
	}),
	schoolAdmin: ac.newRole({
		school: ["list"],
		student: ["list"],
	}),
	teacher: ac.newRole({
		school: ["list"],
		student: ["list"],
	}),

	employee: ac.newRole({
		school: ["list"],
		student: ["list"],
	}),
	student: ac.newRole({
		school: ["list"],
		student: ["list"],
	}),
	superAdmin: ac.newRole({
		school: ["create", "update", "delete", "list"],
		student: ["create", "update", "delete", "list"],
		...adminAc.statements,
	}),
};
