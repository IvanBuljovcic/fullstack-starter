import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

interface JwtPayload {
	sub: string;
	email: string;
	iat: number; // Issued at timestamp (in seconds)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		private prisma: PrismaService
	) {
		const secret = configService.get<string>("JWT_SECRET");

		if (!secret) {
			throw new Error("JWT_SECRET is not defined in environment variables");
		}

		const options: StrategyOptions = {
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: secret,
		};

		super(options);
	}

	async validate(payload: JwtPayload) {
		if (!payload.sub || !payload.email) {
			throw new UnauthorizedException("Invalid token payload");
		}

		// Fetch user from database to check lastLogoutAt
		const user = await this.prisma.user.findUnique({
			where: { id: payload.sub },
			select: {
				id: true,
				email: true,
				lastLogoutAt: true,
			},
		});

		if (!user) {
			throw new UnauthorizedException("User not found");
		}

		// Check if token was issued before last logout
		if (user.lastLogoutAt) {
			const tokenIssuedAt = new Date(payload.iat * 1000); // JWT iat is in seconds
			if (tokenIssuedAt < user.lastLogoutAt) {
				throw new UnauthorizedException("Token invalidated by logout");
			}
		}

		return {
			id: user.id,
			email: user.email,
		};
	}
}
