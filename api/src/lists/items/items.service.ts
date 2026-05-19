import { Injectable } from "@nestjs/common";
import { Item } from "../../generated/prisma";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateItemDto } from "./create-item.dto";

@Injectable()
export class ItemsService {
	constructor(private prisma: PrismaService) {}

	async findAll(userId: string, listId: string): Promise<Item[]> {
		return this.prisma.item.findMany({
			where: {
				listId,
				list: {
					accesses: {
						some: { userId },
					},
				},
			},
		});
	}

	async create(userId: string, listId: string, dto: CreateItemDto): Promise<Item> {
		const list = await this.prisma.list.findFirst({
			where: {
				id: listId,
				accesses: {
					some: { userId },
				},
			},
		});

		if (!list) {
			throw new Error("List not found or access denied!");
		}

		return this.prisma.item.create({
			data: {
				...dto,
				listId,
			},
		});

		// return this.prisma.item.create({
		// 	data: {
		// 		...dto,
		// 		list: {
		// 			connect: {
		// 				id: listId,
		// 				accesses: {
		// 					some: {
		// 						userId,
		// 					},
		// 				},
		// 			},
		// 		},
		// 	},
		// });
	}
}
