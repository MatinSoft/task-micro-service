import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Version } from '@nestjs/common';
import { SchedulerServiceService } from './scheduler-service.service';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ScheduleEntity } from './entity/schedule.entity';
import { UpdateScheduleDto } from './dto/update.schedule.entity';

@Controller("scheduler")
@ApiTags('scheduler')
export class SchedulerServiceController {
  constructor(private readonly schedulerServiceService: SchedulerServiceService) { }

  @ApiOkResponse({ type: ScheduleEntity, isArray: true })
  @Get()
  async schedulers() {
    return await this.schedulerServiceService.findAll()
  }

  @ApiOkResponse({ type: String })
  @Post()
  @Version('2')
  async createNewTaskV2() {
    return await this.schedulerServiceService.createV2()
  }

  @Patch(":id")
  @ApiOkResponse({ type: ScheduleEntity })
  @ApiNotFoundResponse({ description: "ScheduleEntity not found" })
  async editTask(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateScheduleDto: UpdateScheduleDto
  ) {
    return await this.schedulerServiceService.update(id, updateScheduleDto)
  }
}
