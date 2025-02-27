import { ForbiddenException, Injectable, Res } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon2 from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { Response  } from "express";


@Injectable()
export class AuthService
{
    private token_mode_cookie
    private frontendDomain

    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
        this.token_mode_cookie = this.configService.get('TOKEN_COOKIE_MODE')
        this.frontendDomain = this.configService.get('FRONTEND_DOMAIN')
    }

    async signup(dto: AuthDto, res: Response) {
        const hash = await argon2.hash(dto.password);

        try {
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email,
                    hash: hash,
                    firstname: null,
                    lastname: null,
                }
            })

            // on génère les tokens
            const tokens = await this.getTokens(user.id, user.email)

            // on recrypte le refresh avant insertion dans la db
            const hashedRefreshToken = await argon2.hash(tokens.refreshToken)

            // on effectue l'update dans la db
            await this.prismaService.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    refreshToken: hashedRefreshToken
                }
            })

            // si l'env demande d'envoyer le token d'acces 
            // par cookie
            if('true' === this.token_mode_cookie) {
                res.cookie('jwt', tokens.accessToken, {httpOnly: true, domain: this.frontendDomain})
                return {refreshToken: tokens.refreshToken}
            }

            // on retourne les tokens au controller
            // qui les retourne au frontend dans le corps de la
            // réponse
            return tokens
        } catch (e) {
            // console.log(e.name)
            // console.log(e.code)
            if(e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new ForbiddenException('email already exists')
                }
            }
        }

    }

    async signin(dto: AuthDto, res: Response) {
        // on recupere l'utilisateur dans la base de donnée
        // grace à son email
        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email
            }
        })

        // si le user n'existe p,as en bdd
        if(!user) 
            throw new ForbiddenException('Email/mot de passe incorrects')

        // si on trouve le user dans la bdd oon verifie le hash
        const pwdMatch = await argon2.verify(user.hash, dto.password)

        // le mot de passe est incorrect
        if(!pwdMatch)
            throw new ForbiddenException('Email/mot de passe incorrects')

        // on génère les tokens
        const tokens = await this.getTokens(user.id, user.email)

        // on recrypte le refresh avant insertion dans la db
        const hashedRefreshToken = await argon2.hash(tokens.refreshToken)

        // on effectue l'update dans la db
        await this.prismaService.user.update({
            where: {
                id: user.id,
            },
            data: {
                refreshToken: hashedRefreshToken
            }
        })

        // si l'env demande d'envoyer le token d'acces 
        // par cookie
        if('true' === this.token_mode_cookie) {
            res.cookie('jwt', tokens.accessToken, {httpOnly: true, domain: this.frontendDomain})
            return {refreshToken: tokens.refreshToken}
        }

        return tokens
    }


    async getTokens(userId: number, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: this.configService.get('JWT_ACCESS_SECRET'),
                    expiresIn: '15m'
                }
            ),

            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: this.configService.get('JWT_ACCESS_SECRET'),
                    expiresIn: '1d'
                }
            )
        ])

        return {
            accessToken,
            refreshToken
        }
    }
}