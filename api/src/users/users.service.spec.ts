import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { User, UserRole } from "../generated/prisma";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "./users.service";

describe("UserService", () => {
	let service: UsersService;

	const mockUser: User = {
		id: "1",
		email: "test@mail.com",
		name: "Test User",
		createdAt: new Date(),
		updatedAt: new Date(),
		passwordHash: "asdf",
		role: "ADMIN",
	};

	const mockPrismaService = {
		user: {
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
				UsersService,
				{
					provide: PrismaService,
					useValue: mockPrismaService,
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("findAll", () => {
		it("Should return an empty array when no users exist in the database", async () => {
			mockPrismaService.user.findMany.mockResolvedValue([]);

			const result = await service.findAll();

			expect(result).toEqual([]);
		});

		it("Should return an array with one user when database has exactly one user", async () => {
			mockPrismaService.user.findMany.mockResolvedValue([mockUser]);

			const result = await service.findAll();

			expect(result).toEqual([mockUser]);
		});

		it("Should return an array with multiple users when database has multiple users", async () => {
			const users = [
				mockUser,
				{ ...mockUser, id: "2", email: "test_2@mail.com", name: "Test User 2" },
				{ ...mockUser, id: "3", email: "test_3@mail.com", name: "Test User 3" },
			];
			mockPrismaService.user.findMany.mockResolvedValue(users);

			const result = await service.findAll();

			expect(result).toEqual(users);
		});

		it("Should verify that the Prisma findMany method is called exactly once", async () => {
			mockPrismaService.user.findMany.mockResolvedValue([mockUser]);

			await service.findAll();

			expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
		});

		it("Should verify that the Prisma findMany method is called with no parameters", async () => {
			mockPrismaService.user.findMany.mockResolvedValue([mockUser]);

			await service.findAll();

			expect(mockPrismaService.user.findMany).toHaveBeenLastCalledWith();
		});
	});

	describe("findOne", () => {
		it("Should return a user object when a valid ID is provided and user exists'", async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

			const result = await service.findOne("1");

			expect(result).toEqual(mockUser);
		});

		it("Should return null when the user ID doesn't exist in the database'", async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(null);

			const result = await service.findOne("non-existent-id");

			expect(result).toBeNull();
		});

		it("Should verify that Prisma's findUnique is called with the correct ID in the where clause'", async () => {
			const id = "unique-id";
			await service.findOne(id);

			expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { id } });
		});

		it("Should handle empty string IDs gracefully'", async () => {
			await expect(service.findOne("")).rejects.toThrow(BadRequestException);
			await expect(service.findOne("  ")).rejects.toThrow(BadRequestException);
		});
	});

	describe("create", () => {
		it("Should create and return a new user with valid email and name", async () => {
			mockPrismaService.user.create.mockResolvedValue(mockUser);

			const result = await service.create(mockUser);

			expect(result).toEqual(mockUser);
		});

		it("Should create a user with all required fields (including passwordHash and role based on your schema)", async () => {
			const createData = {
				name: "New User",
				email: "new@example.com",
				passwordHash: "hashedpassword123",
				role: UserRole.EDITOR,
			};

			const createdUser = {
				...createData,
				id: "new-id",
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			mockPrismaService.user.create.mockResolvedValue(createdUser);

			const result = await service.create(createData);

			expect(result).toEqual(createdUser);
			expect(mockPrismaService.user.create).toHaveBeenCalledWith({
				data: createData,
			});
		});

		it("Should verify that Prisma's create method is called with the exact data passed in", async () => {
			mockPrismaService.user.create.mockResolvedValue(mockUser);

			await service.create(mockUser);

			expect(mockPrismaService.user.create).toHaveBeenCalledWith({
				data: mockUser,
			});
		});

		it("Should return the newly created user with generated ID and timestamps", async () => {
			const createData = {
				name: "Test User",
				email: "test@example.com",
				passwordHash: "password123",
				role: UserRole.VIEWER,
			};

			const createdUser = {
				...createData,
				id: "generated-cuid-123",
				createdAt: new Date("2026-01-01T00:00:00.000Z"),
				updatedAt: new Date("2026-01-01T00:00:00.000Z"),
			};

			mockPrismaService.user.create.mockResolvedValue(createdUser);

			const result = await service.create(createData);

			expect(result).toHaveProperty("id");
			expect(result).toHaveProperty("createdAt");
			expect(result).toHaveProperty("updatedAt");
			expect(result.id).toBe("generated-cuid-123");
		});

		it("Should handle creating multiple users with different data correctly", async () => {
			const user1Data = {
				name: "User One",
				email: "user1@example.com",
				passwordHash: "pass1",
				role: "ADMIN" as const,
			};

			const user2Data = {
				name: "User Two",
				email: "user2@example.com",
				passwordHash: "pass2",
				role: "EDITOR" as const,
			};

			const createdUser1 = { ...user1Data, id: "1", createdAt: new Date(), updatedAt: new Date() };
			const createdUser2 = { ...user2Data, id: "2", createdAt: new Date(), updatedAt: new Date() };

			mockPrismaService.user.create.mockResolvedValueOnce(createdUser1).mockResolvedValueOnce(createdUser2);

			const result1 = await service.create(user1Data);
			const result2 = await service.create(user2Data);

			expect(result1).toEqual(createdUser1);
			expect(result2).toEqual(createdUser2);
			expect(mockPrismaService.user.create).toHaveBeenCalledTimes(2);
		});
	});

	describe("update", () => {
		it("Should throw an error when user ID doesn't exist", async () => {
			const updateData = { name: "Updated Name" };
			const errorMessage = "Record to update not found.";
			const prismaError = new Error(errorMessage);

			mockPrismaService.user.update.mockRejectedValue(prismaError);

			await expect(service.update("non-existent-id", updateData)).rejects.toThrow(errorMessage);

			expect(mockPrismaService.user.update).toHaveBeenCalledWith({
				where: { id: "non-existent-id" },
				data: updateData,
			});
		});

		it("Should update and return the user when valid ID and data are provided", async () => {
			const updateData = { name: "Updated Name" };
			const updatedUser = {
				...mockUser,
				name: "Updated Name",
				updatedAt: new Date(),
			};

			mockPrismaService.user.update.mockResolvedValue(updatedUser);

			const result = await service.update("1", updateData);

			expect(result).toEqual(updatedUser);
			expect(result.name).toBe("Updated Name");
			expect(mockPrismaService.user.update).toHaveBeenCalledWith({
				where: { id: "1" },
				data: updateData,
			});
		});

		it("Should update only the fields provided (partial update)", async () => {
			const updateData = { name: "Updated Name" };
			const updatedAt = new Date();
			const updatedUser = {
				...mockUser,
				name: "Updated Name",
				updatedAt,
			};

			mockPrismaService.user.update.mockResolvedValue(updatedUser);

			const result = await service.update("1", updateData);

			expect(result).toEqual(updatedUser);
			expect(result.name).toBe("Updated Name");
			expect(result.updatedAt).toBe(updatedAt);
			expect(result.email).toBe(mockUser.email);
		});

		it("Should handle updating just the email without affecting name", async () => {
			const updateData = { email: "newemail@example.com" };
			const updatedUser = { ...mockUser, email: "newemail@example.com" };

			mockPrismaService.user.update.mockResolvedValue(updatedUser);

			const result = await service.update("1", updateData);

			expect(result.email).toBe("newemail@example.com");
			expect(result.name).toBe(mockUser.name); // unchanged
		});

		it("Should handle updating just the name without affecting email", async () => {
			const updateData = { name: "New Name" };
			const updatedUser = { ...mockUser, name: "New Name" };

			mockPrismaService.user.update.mockResolvedValue(updatedUser);

			const result = await service.update("1", updateData);

			expect(result.name).toBe("New Name");
			expect(result.email).toBe(mockUser.email); // unchanged
		});
	});

	describe("remove", () => {
		it("Should delete and return the deleted user when valid ID is provided", async () => {
			mockPrismaService.user.delete.mockResolvedValue(mockUser);

			const result = await service.remove("1");

			expect(result).toEqual(mockUser);
		});

		it("Should verify that Prisma's delete is called with the correct ID in where clause", async () => {
			mockPrismaService.user.delete.mockResolvedValue(mockUser);

			await service.remove("1");

			expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
				where: { id: "1" },
			});
		});

		it("Should handle deletion of different users by different IDs", async () => {
			const deleteUser1 = { ...mockUser, name: "Delete User 1" };
			const deleteUser2 = { ...mockUser, id: "2", name: "Delete User 2" };

			mockPrismaService.user.delete.mockResolvedValueOnce(deleteUser1).mockResolvedValueOnce(deleteUser2);

			const result1 = await service.remove("1");
			const result2 = await service.remove("2");

			expect(result1).toEqual(deleteUser1);
			expect(result2).toEqual(deleteUser2);
		});

		it("Should throw error when trying to delete non-existent user", async () => {
			const prismaError = new Error("Record to delete not found.");
			mockPrismaService.user.delete.mockRejectedValue(prismaError);

			await expect(service.remove("non-existent")).rejects.toThrow();
		});
	});
});
