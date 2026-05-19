import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { User } from "../generated/prisma";
import { CreateUserDto } from "./create-user.dto";
import { UpdateUserDto } from "./update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async findAll(): Promise<User[]> {
		return this.usersService.findAll();
	}

	@Get(":id")
	async findOne(@Param("id") id: string): Promise<User | null> {
		return this.usersService.findOne(id);
	}

	@Post()
	async create(@Body() createUserDto: CreateUserDto): Promise<Omit<User, "passwordHash" | "lastLogoutAt">> {
		return this.usersService.create(createUserDto);
	}

	@Put(":id")
	async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(":id")
	async remove(@Param("id") id: string): Promise<User> {
		return this.usersService.remove(id);
	}
}
