import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { doubleCsrf } from "csrf-csrf";

@Injectable()
export class CsrfService
{
    private csrfProtection

    constructor(
        private readonly configService: ConfigService
    ) 
    {
        this.csrfProtection = doubleCsrf({
            getSecret: () => this.configService.get('CSRF_SECRET'),
            cookieName: this.configService.get('CSRF_COOKIE_NAME')
        })
    }

    getToken(req: any, res: any) {
        const csrf = {
            token: this.csrfProtection.generateToken(req, res)
        }
        return csrf
    }

    ident() {
        console.log('csrf service')
    }
}