import { Injectable } from "@nestjs/common";
import { List } from "../generated/prisma";
import { PrismaService } from "../prisma/prisma.service";
import { CreateListDto } from "./create-list.dto";

@Injectable()
export class ListsService {
	constructor(private prisma: PrismaService) {}

	async findAll(userId: string): Promise<List[]> {
		return this.prisma.list.findMany({
			where: {
				OR: [
					{
						ownerId: userId,
					},
					{
						accesses: {
							some: {
								userId,
							},
						},
					},
				],
			},
		});
	}

	async findOne(userId: string, listId: string) {
		return this.prisma.list.findUnique({
			where: {
				id: listId,
				OR: [
					{
						ownerId: userId,
					},
					{
						accesses: {
							some: {
								userId,
							},
						},
					},
				],
			},
		});
	}

	async create(userId: string, dto: CreateListDto): Promise<List> {
		return this.prisma.list.create({
			data: {
				name: dto.name,
				ownerId: userId,
				accesses: {
					create: {
						userId: userId,
						permission: "WRITE",
						grantedById: userId,
					},
				},
			},
		});
	}

	async remove(userId: string, listId: string): Promise<List> {
		const list = await this.prisma.list.findFirst({
			where: {
				id: listId,
				OR: [
					{
						ownerId: userId,
					},
					{
						accesses: {
							some: {
								userId,
							},
						},
					},
				],
			},
		});

		if (!list) {
			throw new Error("List not found or access denied!");
		}

		return this.prisma.list.delete({
			where: {
				id: listId,
			},
		});
	}
}
