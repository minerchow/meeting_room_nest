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
        const client = createClient({
            socket: {
                host: configService.get('redis_server_host'),
                port: configService.get('redis_server_port'),
                 family: 4, // 强制IPv4协议栈
                
            },
            password: configService.get('redis_server_password'), 
            database: 0
        });
         // 添加错误监听
        client.on('error', (err) => {
          console.error('Redis Client Error:', err);
        });

        // 添加连接成功回调
        client.on('connect', () => {
          console.log('Redis connection established');
        });
        await client.connect();
        return client;
      }
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}