import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CsrfModule } from './csrf/csrf.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    AuthModule, 
    UserModule, 
    BookmarkModule, 
    PrismaModule, 
    CsrfModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
