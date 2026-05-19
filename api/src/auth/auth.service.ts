import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService
	) {}

	async login(email: string, password: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

		if (!isPasswordValid) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const payload = {
			sub: user.id,
			email: user.email,
		};

		const accessToken = await this.jwtService.signAsync(payload);

		return {
			accessToken,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
			},
		};
	}

	async logout(userId: string): Promise<void> {
		await this.prisma.user.update({
			where: { id: userId },
			data: { lastLogoutAt: new Date() },
		});
	}
}
