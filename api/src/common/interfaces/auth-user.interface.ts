import { UserRole } from "../../generated/prisma";

export interface AuthUser {
	id: string;
	email: string;
	role: UserRole;
}
