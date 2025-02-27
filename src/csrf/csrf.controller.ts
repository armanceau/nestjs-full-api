import { Controller, Get, Req, Res } from "@nestjs/common";
import { CsrfService } from "./csrf.service";

@Controller('csrf')
export class CsrfController
{
    constructor(
        private readonly csrfService: CsrfService
    ) {}

    @Get()
    getCsrfToken(@Req() req: any, @Res({passthrough: true}) res: any)
    {
        return this.csrfService.getToken(req, res)
    }
}