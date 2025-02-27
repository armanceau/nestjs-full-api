import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { AuthDto } from './dto';
import { CsrfGuard } from 'src/csrf/guards/csrf.guard';
import { CsrfService } from 'src/csrf/csrf.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController
{
    constructor(
        private readonly authService: AuthService,
        private readonly csrfService: CsrfService
    ) {}

    
    @Post('signup')
    @UseGuards(CsrfGuard)
    signup(@Body() dto: AuthDto, @Res({passthrough: true}) res: Response) {
        console.log(dto)
        return this.authService.signup(dto, res)
    }

    
    @Post('signin')
    @UseGuards(CsrfGuard)
    signin(@Body() dto: AuthDto, @Res({passthrough: true}) res: Response) {
        return this.authService.signin(dto, res)
    }

    @Get('test')
    test()
    {
        this.csrfService.ident()
    }
}