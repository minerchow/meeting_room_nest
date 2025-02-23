import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService, ConfigModule } from '@nestjs/config';
@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        console.log("config",configService.get('redis_server_host'))
        const client = createClient({
            socket: {
                host: 'localhost',
                port: 6379,
                family: 4 // 强制IPv4协议栈
            },
            password: "123456", 
            database: 1
        });
        await client.connect();
        return client;
      }
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}