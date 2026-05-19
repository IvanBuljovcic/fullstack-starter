import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { UserRole } from "../generated/prisma";

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsEnum(UserRole)
	role?: UserRole;
}
