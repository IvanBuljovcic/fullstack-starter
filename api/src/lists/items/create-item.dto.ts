import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from "class-validator";

export class CreateItemDto {
	@IsString()
	@IsNotEmpty()
	name!: string;

	@IsNumber()
	@Min(0)
	quantity!: number;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsUrl()
	imageUrl?: string;

	@IsOptional()
	@IsString()
	barcode?: string;

	@IsOptional()
	@IsString()
	qrCode?: string;

	@IsOptional()
	@IsString()
	unit?: string;
}
