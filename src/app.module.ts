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
import {  ConfigModule , ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './login.guard';
import { PermissionGuard } from './permission.guard';
import { MeetingRoomModule } from './meeting-room/meeting-room.module';
// import envConfig from '../config/env';
import { MeetingRoom } from './meeting-room/entities/meeting-room.entity';
import { BookingModule } from './booking/booking.module';
import { Booking } from './booking/entities/booking.entity';
import { StatisticModule } from './statistic/statistic.module';
import { AuthModule } from './auth/auth.module';
import { WinstonModule, utilities , WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as winston from 'winston';
import { CustomTypeOrmLogger } from './CustomTypeOrmLogger';
import { UploadModule } from './upload/upload.module';
import * as path from 'path';
import 'winston-daily-rotate-file';

// 获取环境配置文件路径的函数
function getEnvFilePath(): string {
  const nodeEnv = process.env.NODE_ENV;
  
  if (nodeEnv === 'production') {
    return path.join(__dirname, '.env');
  } else if (nodeEnv === 'test') {
    return path.join(__dirname, '.test.env');
  } else {
    // 默认使用开发环境配置
    return path.join(__dirname, '.dev.env');
  }
}
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true,envFilePath: getEnvFilePath()}),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: '30m' // 默认 30 分钟
          }
        }
      },
      inject: [ConfigService]
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService,logger:WinstonLogger) {
        return {
          type: "mysql",
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: true,
          logging: false,
          logger:new CustomTypeOrmLogger(logger),
          entities: [
            User, Role, Permission , MeetingRoom , Booking
          ],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
             
          }
        }
      },
      inject: [ConfigService , WINSTON_MODULE_NEST_PROVIDER]
    }),
    WinstonModule.forRootAsync({
      useFactory: () => ({
        level: 'debug',
        transports: [
          new winston.transports.File({
            filename: `${process.cwd()}/log`,
          }),
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike(),
            ),
          }),
          new winston.transports.DailyRotateFile({
            level: 'debug',
            dirname: 'daily-log',
            filename: 'log-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '10k'
          })
        ],
      })
    }),
    UserModule,
    RedisModule,
    EmailModule,
    MeetingRoomModule,
    BookingModule,
    StatisticModule,
    AuthModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
    provide: APP_GUARD,
    useClass: LoginGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard
    }],
})
export class AppModule {}
