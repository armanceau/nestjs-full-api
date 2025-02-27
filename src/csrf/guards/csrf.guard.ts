import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { doubleCsrf } from "csrf-csrf";
import { Observable } from "rxjs";

@Injectable()
export class CsrfGuard implements CanActivate 
{
    private csrfProtection
    constructor(
        private readonly configService: ConfigService
    ) {
        this.csrfProtection = doubleCsrf({
            getSecret: () => this.configService.get('CSRF_SECRET'),
            cookieName: this.configService.get('CSRF_COOKIE_NAME')
        })
    }
    canActivate(context: ExecutionContext): boolean
    {
        const req = context.switchToHttp().getRequest()
        const res = context.switchToHttp().getResponse()

        this.csrfProtection.doubleCsrfProtection(req, res, (error:any) => {
            if(error == this.csrfProtection.invalidCsrfTokenError) {
                res.status(403).json({
                    error: 'csrf validation error'
                })
                throw new Error('Csrf guard activated!')
            }
        })
        return true
    }
}