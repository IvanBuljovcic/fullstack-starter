import { Test, TestingModule } from "@nestjs/testing";
import { List } from "../../generated/prisma";
import { PrismaService } from "../../prisma/prisma.service";
import { ItemsService } from "./items.service";

describe("ListsService", () => {
	let service: ItemsService;

	const mocItem: List = {
		id: "list-1",
		name: "Pantry",
		description: "Kitchen pantry items",
		parentId: null, // Top-level list (no parent)
		ownerId: "user-1",
		createdAt: new Date("2026-01-01T00:00:00.000Z"),
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
				ItemsService,
				{
					provide: PrismaService,
					useValue: mockPrismaService,
				},
			],
		}).compile();

		service = module.get<ItemsService>(ItemsService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("findAll", () => {
		it("Should return an empty array when a user has no items in list", async () => {});

		it("Should return an array with one item if a user has exactly one item in the list", async () => {});

		it("Should return and array with multiple items if a user has multiple items in a list", async () => {});

		it("Should verify that the Prisma findMany method is called exactly once", async () => {});

		it("Should verify that the Prisma findMany method is called with the userId and listId parameter", async () => {});
	});
});
