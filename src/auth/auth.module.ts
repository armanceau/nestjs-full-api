import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { CsrfService } from "src/csrf/csrf.service";


@Module({
    imports: [
        JwtModule.register({})
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService, ConfigService, CsrfService]
})
export class AuthModule
{
    
}