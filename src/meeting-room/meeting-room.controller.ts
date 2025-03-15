import { BadRequestException, Body, Controller, DefaultValuePipe, Get, Inject, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';


@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {

  }
  @Inject(MeetingRoomService)
  private MeetingRoomService: MeetingRoomService;
  @Get("init-data")
  async initData() {
    try {
      await this.MeetingRoomService.initData();
      return 'done';
    } catch (e) {
      console.error('初始化失败:', e);
    }

  }

  @Get('list')
  async list(@Query('pageNo', new DefaultValuePipe(1), new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException('pageNo 应该传数字');
    }
  })) pageNo: number,
    @Query('pageSize', new DefaultValuePipe(10), new ParseIntPipe({
      exceptionFactory() {
        throw new BadRequestException('pageSize 应该传数字');
      }
    })) pageSize: number) {
    return await this.meetingRoomService.find(pageNo, pageSize);
  }

  @Post('create')
  async create(@Body() meetingRoomDto: CreateMeetingRoomDto) {
    return await this.meetingRoomService.create(meetingRoomDto);
  }

  @Put('update')
  async update(@Body() meetingRoomDto: UpdateMeetingRoomDto) {
    return await this.meetingRoomService.update(meetingRoomDto);
  }

  @Get(':id')
  async find(@Param('id') id: number) {
    return await this.meetingRoomService.findById(id);
  }

 
}
