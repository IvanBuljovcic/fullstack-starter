import { Test, TestingModule } from "@nestjs/testing";
import { List } from "../generated/prisma";
import { PrismaService } from "../prisma/prisma.service";
import { ListsService } from "./lists.service";

describe("ListsService", () => {
	let service: ListsService;

	const mockList: List = {
		id: "list-1",
		name: "Pantry",
		description: "Kitchen pantry items",
		parentId: null, // Top-level list (no parent)
		ownerId: "user-1",
		createdAt: new Date("2026-01-01T00:00:00.000Z"),
	};

	const mockChildList: List = {
		id: "list-2",
		name: "Spices",
		description: "Spice rack",
		parentId: "list-1", // Child of Pantry
		ownerId: "user-1",
		createdAt: new Date("2026-01-02T00:00:00.000Z"),
	};

	const mockPrismaService = {
		list: {
			findMany: jest.fn(),
			findUnique: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		},
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ListsService,
				{
					provide: PrismaService,
					useValue: mockPrismaService,
				},
			],
		}).compile();

		service = module.get<ListsService>(ListsService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("findAll", () => {
		it("Should return an empty array when a user has no list in database", async () => {
			mockPrismaService.list.findMany.mockResolvedValue([]);

			const result = await service.findAll("user-1");

			expect(result).toEqual([]);
		});

		it("Should return an array with one list if a user has exactly one list", async () => {
			mockPrismaService.list.findMany.mockResolvedValue([mockList]);

			const result = await service.findAll(mockList.ownerId);

			expect(result).toEqual([mockList]);
		});

		it("Should return an array with multiple lists if a user has multiple lists", async () => {
			const mockList2 = {
				...mockChildList,
				parentId: null,
			};

			mockPrismaService.list.findMany.mockResolvedValue([mockList, mockList2]);

			const result = await service.findAll(mockList.ownerId);

			expect(result).toEqual([mockList, mockList2]);
		});

		it("Should verify that the Prisma findMany method is called exactly once", async () => {
			mockPrismaService.list.findMany.mockResolvedValue([mockList]);

			await service.findAll(mockList.ownerId);

			expect(mockPrismaService.list.findMany).toHaveBeenCalledTimes(1);
		});

		it("Should verify that the prisma findMany method is called with the userId parameter", async () => {
			mockPrismaService.list.findMany.mockResolvedValue([mockList]);

			await service.findAll(mockList.ownerId);

			expect(mockPrismaService.list.findMany).toHaveBeenLastCalledWith({
				where: {
					accesses: {
						some: { userId: mockList.ownerId },
					},
				},
			});
		});

		describe("Access control", () => {
			it("Should only return lists where user has ListAccess entry", async () => {
				const userAccessibleLists = [mockList, mockChildList];

				mockPrismaService.list.findMany.mockResolvedValue(userAccessibleLists);

				const result = await service.findAll("user-1");

				expect(result).toHaveLength(2);
				expect(result).toEqual(userAccessibleLists);

				expect(mockPrismaService.list.findMany).toHaveBeenCalledWith({
					where: {
						accesses: {
							some: {
								userId: "user-1",
							},
						},
					},
				});
			});

			it("Should return lists regardless of permission type (READ or WRITE)", async () => {
				const listsWithMixedPermissions = [
					{ ...mockList, id: "list-read" },
					{ ...mockList, id: "list-write" },
				];

				mockPrismaService.list.findMany.mockResolvedValue(listsWithMixedPermissions);

				const result = await service.findAll("user-1");

				expect(result).toHaveLength(2);
				expect(result).toEqual(listsWithMixedPermissions);
			});

			it("Should not return lists owned by user if no ListAccess entry exists", async () => {
				mockPrismaService.list.findMany.mockResolvedValue([]);

				const result = await service.findAll("user-1");

				expect(result).toEqual([]);
			});

			it("Should return lists shared with user but owned by others", async () => {
				const sharedLists = [
					{ ...mockList, ownerId: "other-owner-1" },
					{ ...mockChildList, ownerId: "other-owner-2" },
				];

				mockPrismaService.list.findMany.mockResolvedValue(sharedLists);

				const result = await service.findAll("user-1");

				expect(result).toHaveLength(2);
				expect(result).toEqual(sharedLists);
				expect(result.every((list) => list.ownerId !== "user-1")).toBeTruthy();
			});

			it("Should return both owned and shared lists if user has access to both", async () => {
				const ownedList = { ...mockList, ownerId: "user-1" };
				const sharedList = { ...mockChildList, ownerId: "other-user" };
				const mixedLists = [ownedList, sharedList];

				mockPrismaService.list.findMany.mockResolvedValue(mixedLists);

				const result = await service.findAll("user-1");

				expect(result).toHaveLength(2);
				expect(result).toContainEqual(ownedList);
				expect(result).toContainEqual(sharedList);
			});

			it("Should return empty array when user exists but has no list access", async () => {
				mockPrismaService.list.findMany.mockResolvedValue([]);

				const result = await service.findAll("user-with-no-lists");

				expect(result).toEqual([]);
			});
		});
	});
});

// === Access Control ===
// Should only return lists where user has ListAccess entry
// Should return lists regardless of permission type (READ or WRITE)
// Should not return lists owned by user if no ListAccess entry exists
// Should return lists shared with user but owned by others
// Should return both owned and shared lists if user has access to both

// === List Hierarchy ===
// Should return parent lists (parentId = null)
// Should return child lists (parentId = some list id)
// Should return both parent and child lists in the same result
// Should not filter based on list hierarchy (return all accessible lists)

// === Edge Cases ===
// Should handle null or undefined userId gracefully (or throw error?)
// Should handle empty string userId
// Should handle non-existent userId (returns empty array)
// Should return lists with null descriptions
// Should return lists with null parentId

// === Data Integrity ===
// Should return lists with all required fields (id, name, ownerId, createdAt)
// Should return lists with correct data types for each field
// Should preserve the order returned by Prisma (no custom sorting)

// === Prisma Interaction ===
// ✓ Should call prisma.list.findMany exactly once
// ✓ Should call prisma.list.findMany with correct where clause
// Should pass userId parameter correctly to the where clause
// Should use 'accesses.some' to filter by ListAccess junction table

// === Error Handling ===
// Should throw/propagate error when Prisma query fails
// Should handle database connection errors
// Should handle constraint violations (if any)

// === Performance Considerations ===
// Should not load unnecessary relations (items, children, parent) unless needed
// Should not make multiple database calls (N+1 query problem)
// Should work efficiently with large numbers of lists

// === Future Tests (when more methods are added) ===
// findOne(listId: string, userId: string) - verify user has access
// create(userId: string, data: CreateListDto) - creates list and ListAccess entry
// update(listId: string, userId: string, data: UpdateListDto) - verify WRITE permission
// delete(listId: string, userId: string) - verify ownership or WRITE permission
// share(listId: string, userId: string, targetUserId: string, permission: ListAccessPermission)
// removeAccess(listId: string, userId: string, targetUserId: string)
// findChildren(parentListId: string, userId: string) - get sub-lists
// findByOwner(ownerId: string) - get all lists owned by user
