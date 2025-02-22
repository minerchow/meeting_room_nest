import { HttpException, HttpStatus, Inject, Injectable ,Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils';
@Injectable()
export class UserService {
  private logger = new Logger();
  constructor(
    @Inject(RedisService) private redisService: RedisService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ){}

  async register(user: RegisterUserDto) {
   
    const captcha = await this.redisService.get(`captcha_${user.email}`);
    console.log("captcha: ", captcha);
    if(!captcha) {
        throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if(user.captcha !== captcha) {
        throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username
    });

    if(foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.email = user.email;
    newUser.nickName = user.nickName;

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch(e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
