import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { UserRole } from "../generated/prisma";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "./users.service";

describe("UsersService Integration", () => {
	let service: UsersService;
	let prisma: PrismaService;

	const newUser = {
		name: "Test User",
		email: "test@integration.com",
		passwordHash: "pwdHash",
		role: UserRole.ADMIN,
	};

	beforeAll(async () => {
		// Use REAL PrismaService - no mocks
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					envFilePath: ".env.test", // Separate test database
				}),
			],
			providers: [UsersService, PrismaService],
		}).compile();

		service = module.get<UsersService>(UsersService);
		prisma = module.get<PrismaService>(PrismaService);

		// Clean database before tests (in correct order to avoid FK violations)
		await prisma.item.deleteMany();
		await prisma.listAccess.deleteMany();
		await prisma.list.deleteMany();
		await prisma.user.deleteMany();
	});

	afterAll(async () => {
		// Cleanup
		await prisma.user.deleteMany();
		await prisma.$disconnect();
	});

	afterEach(async () => {
		// Clean between tests
		await prisma.user.deleteMany();
	});

	describe("create", () => {
		it("Should create a user in the real database", async () => {
			const userData = {
				name: "Integration Test User",
				email: "integration@test.com",
				passwordHash: "hashedpwd123",
				role: UserRole.ADMIN,
			};

			const user = await service.create(userData);

			// Verify in database
			expect(user.id).toBeDefined();
			expect(user.email).toBe(userData.email);

			// Query database directly to verify
			const dbUser = await prisma.user.findUnique({
				where: {
					id: user.id,
				},
			});

			expect(dbUser).not.toBeNull();
			expect(dbUser?.email).toBe(userData.email);
		});

		it("Should prevent duplicate emails", async () => {
			const userData = {
				name: "Test User",
				email: "duplicate@test.com",
				passwordHash: "hashed",
				role: UserRole.ADMIN,
			};

			await service.create(userData);

			await expect(service.create(userData)).rejects.toThrow();
		});
	});

	describe("findOne", () => {
		it("Should return null for non-existent user", async () => {
			const result = await service.findOne("non-existent");

			expect(result).toBeNull();
		});

		it("Should find existing user", async () => {
			const created = await prisma.user.create({
				data: newUser,
			});

			const found = await service.findOne(created.id);

			expect(found).not.toBeNull();
			expect(found?.id).toBe(created.id);
			expect(found?.email).toBe("test@integration.com");
		});
	});

	describe("update", () => {
		it("Should update user fields", async () => {
			const created = await prisma.user.create({
				data: newUser,
			});

			const updated = await service.update(created?.id, { name: "Updated Name" });

			expect(updated?.name).toBe("Updated Name");
			expect(updated?.email).toBe(created.email);

			const dbUser = await prisma.user.findUnique({
				where: {
					id: created.id,
				},
			});

			expect(dbUser?.name).toBe("Updated Name");
		});
	});

	describe("remove", () => {
		it("Should delete user from database", async () => {
			const created = await prisma.user.create({
				data: newUser,
			});

			await service.remove(created?.id);

			const found = await prisma.user.findUnique({
				where: {
					id: created?.id,
				},
			});

			expect(found).toBeNull();
		});
	});
});
