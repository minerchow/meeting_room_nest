import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {

    @Inject('REDIS_CLIENT') 
    private redisClient: RedisClientType;

    async get(key: string) {
        console.log(await this.redisClient.get(key) )
        return await this.redisClient.get(key);
    }

    async set(key: string, value: string | number, ttl?: number) {
        console.log("aa")
        await this.redisClient.set(key, value);

        if(ttl) {
            await this.redisClient.expire(key, ttl);
        }
    }
}