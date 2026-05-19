import { IsOptional, IsString } from "class-validator";

export class UpdateListDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	ownerId?: string;
}
