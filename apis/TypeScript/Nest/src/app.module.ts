import { Module } from '@nestjs/common';
import { AppControllerV1 } from './v1/controllers/app.controller';
import { AppService as AppServiceV1 } from './v1/service/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './v1/modules/user.module';
import {
  AuthGuard,
  KeycloakConnectModule,
  RoleGuard,
  TokenValidation,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      entities: [__dirname + '/dist/**/entities/*'],
      autoLoadEntities: true,
      extra: {
        max: Number(process.env.DB_MAX_CONNECTIONS) || 10,
        connectionTimeoutMillis: 30000,
        idleTimeoutMillis: 5000,
      },
    }),
    KeycloakConnectModule.register({
      authServerUrl: process.env.AUTH_SERVER_URL,
      realm: process.env.REALM,
      clientId: process.env.CLIENT_ID,
      secret: process.env.CLIENT_SECRET,
      tokenValidation: TokenValidation.ONLINE,
    }),
    UsersModule,
    TerminusModule,
  ],
  controllers: [AppControllerV1, HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    AppServiceV1,
  ],
})
export class AppModule {}
