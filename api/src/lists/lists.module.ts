import { Module } from "@nestjs/common";
import { ListsController } from "./lists.controller";
import { ListsService } from "./lists.service";
import { ItemsController } from "./items/items.controller";
import { ItemsService } from "./items/items.service";

@Module({
	controllers: [ListsController, ItemsController],
	providers: [ListsService, ItemsService],
	exports: [ListsService, ItemsService],
})
export class ListsModule {}
