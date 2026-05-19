import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";
import { Pool } from "pg";
import { ListAccessPermission, PrismaClient, UserRole } from "../src/generated/prisma";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
	adapter,
	log: ["query", "info", "warn", "error"],
});

async function main() {
	console.log("Starting database seed...");

	// Clear existing data
	await prisma.listAccess.deleteMany();
	await prisma.item.deleteMany();
	await prisma.list.deleteMany();
	await prisma.user.deleteMany();

	// Hash password for all users
	const passwordHash = await bcrypt.hash("password123", 10);

	// Create users
	const alice = await prisma.user.create({
		data: {
			name: "Alice Admin",
			email: "alice@example.com",
			passwordHash,
			role: UserRole.ADMIN,
		},
	});

	const bob = await prisma.user.create({
		data: {
			name: "Bob Editor",
			email: "bob@example.com",
			passwordHash,
			role: UserRole.EDITOR,
		},
	});

	const charlie = await prisma.user.create({
		data: {
			name: "Charlie Viewer",
			email: "charlie@example.com",
			passwordHash,
			role: UserRole.VIEWER,
		},
	});

	console.log("Created 3 users");

	// Create lists
	const pantryList = await prisma.list.create({
		data: {
			name: "Pantry",
			description: "Kitchen pantry items",
			ownerId: alice.id,
		},
	});

	const toolsList = await prisma.list.create({
		data: {
			name: "Tools",
			description: "Garage tools and equipment",
			ownerId: bob.id,
		},
	});

	const officeList = await prisma.list.create({
		data: {
			name: "Office Supplies",
			description: "Stationery and office equipment",
			ownerId: alice.id,
		},
	});

	// Create a sub-list
	const electronicsList = await prisma.list.create({
		data: {
			name: "Electronics",
			description: "Electronic tools",
			parentId: toolsList.id,
			ownerId: bob.id,
		},
	});

	console.log("Created 4 lists (3 top-level, 1 sub-list)");

	// Create list access permissions
	// Alice shares Pantry with Bob (write) and Charlie (read)
	await prisma.listAccess.create({
		data: {
			userId: alice.id,
			listId: pantryList.id,
			permission: ListAccessPermission.WRITE,
			grantedById: alice.id,
		},
	});

	await prisma.listAccess.create({
		data: {
			userId: bob.id,
			listId: pantryList.id,
			permission: ListAccessPermission.WRITE,
			grantedById: alice.id,
		},
	});

	await prisma.listAccess.create({
		data: {
			userId: charlie.id,
			listId: pantryList.id,
			permission: ListAccessPermission.READ,
			grantedById: alice.id,
		},
	});

	// Bob shares Tools with Alice (write)
	await prisma.listAccess.create({
		data: {
			userId: bob.id,
			listId: toolsList.id,
			permission: ListAccessPermission.WRITE,
			grantedById: bob.id,
		},
	});

	await prisma.listAccess.create({
		data: {
			userId: alice.id,
			listId: toolsList.id,
			permission: ListAccessPermission.WRITE,
			grantedById: bob.id,
		},
	});

	// Bob has access to Electronics sub-list
	await prisma.listAccess.create({
		data: {
			userId: bob.id,
			listId: electronicsList.id,
			permission: ListAccessPermission.WRITE,
			grantedById: bob.id,
		},
	});

	// Alice has access to Office Supplies
	await prisma.listAccess.create({
		data: {
			userId: alice.id,
			listId: officeList.id,
			permission: ListAccessPermission.WRITE,
			grantedById: alice.id,
		},
	});

	console.log("Created list access permissions");

	// Create items in Pantry
	await prisma.item.createMany({
		data: [
			{
				name: "Rice",
				description: "Basmati rice",
				quantity: 5,
				unit: "kg",
				listId: pantryList.id,
			},
			{
				name: "Pasta",
				description: "Spaghetti",
				quantity: 3,
				unit: "boxes",
				listId: pantryList.id,
			},
			{
				name: "Olive Oil",
				description: "Extra virgin olive oil",
				quantity: 2,
				unit: "bottles",
				listId: pantryList.id,
			},
			{
				name: "Canned Tomatoes",
				description: "Whole peeled tomatoes",
				quantity: 8,
				unit: "cans",
				barcode: "1234567890123",
				listId: pantryList.id,
			},
		],
	});

	// Create items in Tools
	await prisma.item.createMany({
		data: [
			{
				name: "Hammer",
				description: "Claw hammer",
				quantity: 2,
				unit: "pcs",
				listId: toolsList.id,
			},
			{
				name: "Screwdriver Set",
				description: "Phillips and flathead",
				quantity: 1,
				unit: "set",
				listId: toolsList.id,
			},
			{
				name: "Drill",
				description: "Cordless power drill",
				quantity: 1,
				unit: "pcs",
				listId: toolsList.id,
			},
		],
	});

	// Create items in Electronics sub-list
	await prisma.item.createMany({
		data: [
			{
				name: "Multimeter",
				description: "Digital multimeter",
				quantity: 1,
				unit: "pcs",
				listId: electronicsList.id,
			},
			{
				name: "Soldering Iron",
				description: "60W soldering iron",
				quantity: 1,
				unit: "pcs",
				listId: electronicsList.id,
			},
		],
	});

	// Create items in Office Supplies
	await prisma.item.createMany({
		data: [
			{
				name: "Printer Paper",
				description: "A4 white paper",
				quantity: 5,
				unit: "reams",
				listId: officeList.id,
			},
			{
				name: "Pens",
				description: "Blue ballpoint pens",
				quantity: 24,
				unit: "pcs",
				listId: officeList.id,
			},
			{
				name: "Stapler",
				description: "Standard stapler",
				quantity: 2,
				unit: "pcs",
				listId: officeList.id,
			},
		],
	});

	console.log("Created items in all lists");

	console.log("\n✅ Database seeded successfully!");
	console.log("\nUsers created:");
	console.log("  - alice@example.com (password: password123) - ADMIN");
	console.log("  - bob@example.com (password: password123) - EDITOR");
	console.log("  - charlie@example.com (password: password123) - VIEWER");
	console.log("\nLists created:");
	console.log("  - Pantry (owned by Alice, shared with Bob and Charlie)");
	console.log("  - Tools (owned by Bob, shared with Alice)");
	console.log("    - Electronics (sub-list, owned by Bob)");
	console.log("  - Office Supplies (owned by Alice)");
}

main()
	.catch((e) => {
		console.error("Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
