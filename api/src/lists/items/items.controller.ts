import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthUser } from "../../common/interfaces/auth-user.interface";
import { Item, List } from "../../generated/prisma";
import { ItemsService } from "./items.service";
import { CreateItemDto } from "./create-item.dto";

@Controller("lists/:listId/items")
@UseGuards(JwtAuthGuard)
export class ItemsController {
	constructor(private readonly itemsService: ItemsService) {}

	@Get()
	async findAll(@CurrentUser() user: AuthUser, @Param("listId") listId: string): Promise<Item[] | null> {
		return this.itemsService.findAll(user.id, listId);
	}

	@Post()
	async create(
		@CurrentUser() user: AuthUser,
		@Param("listId") listId: string,
		@Body() createItemDto: CreateItemDto
	): Promise<Item | null> {
		return this.itemsService.create(user.id, listId, createItemDto);
	}
}
