import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
	imports: [
		PassportModule,
		PrismaModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService): JwtModuleOptions => {
				const secret = configService.get<string>("JWT_SECRET");
				const expiresIn = configService.get("JWT_EXPIRATION") || "7d";

				if (!secret) {
					throw new Error("JWT_SECRET is not defined in environment variables");
				}

				return {
					secret,
					signOptions: {
						expiresIn,
					},
				};
			},
		}),
	],
	controllers: [AuthController],
	providers: [JwtStrategy, AuthService],
	exports: [JwtModule, AuthService],
})
export class AuthModule {}
