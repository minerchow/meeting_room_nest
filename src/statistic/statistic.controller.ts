import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) { }

  @Get('userBookingCount')
  async userBookingCount(@Query('startTime') startTime: string, @Query('endTime') endTime: string) {
    return await this.statisticService.userBookingCount(startTime, endTime);
  }

  @Get('meetingRoomUsedCount')
  async meetingRoomUsedCount(@Query('startTime') startTime: string, @Query('endTime') endTime) {
    return this.statisticService.meetingRoomUsedCount(startTime, endTime);
  }
}
