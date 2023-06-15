import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TfaService } from './auth/2fa/2fa.service';


@Module({
  imports: [AuthModule, UserModule, PrismaModule, ConfigModule.forRoot({
      isGlobal: true
   })],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService, TfaService],
})

export class AppModule {}
