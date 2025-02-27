import { Module } from "@nestjs/common";
import { CsrfController } from "./csrf.controller";
import { CsrfService } from "./csrf.service";
import { ConfigService } from "@nestjs/config";

@Module({
    controllers: [CsrfController],
    providers: [CsrfService, ConfigService],
})
export class CsrfModule
{
    
}