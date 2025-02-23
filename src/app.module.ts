import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { Role } from './user/entities/role.entity';
import { User } from './user/entities/user.entity';
import { Permission } from './user/entities/permission.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import {  ConfigModule } from '@nestjs/config';
import envConfig from '../config/env';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true,envFilePath: [envConfig.path]}),
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "root",
      database: "meeting_room_booking_system",
      synchronize: true,
      logging: true,
      entities: [Role, User, Permission],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    }),
    UserModule,
    RedisModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
