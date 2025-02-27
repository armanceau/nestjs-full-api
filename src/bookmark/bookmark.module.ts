import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CsrfService } from "src/csrf/csrf.service";

@Module({
    providers: [ConfigService, CsrfService]
})
export class BookmarkModule
{
    
}