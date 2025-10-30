import { Body, Controller, Get, Post, Version } from '@nestjs/common';
import { TaskServiceService } from './task-service.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TaskEntity } from './entity/task.entity';

@Controller('tasks')
@ApiTags("tasks")
export class TaskServiceController {
  constructor(private readonly taskServiceService: TaskServiceService) { }

  @ApiOkResponse({ type: TaskEntity })
  @Post()
  @Version('1')
  async createNewTaskV1(
    @Body() createTask: CreateTaskDto
  ) {
    return await this.taskServiceService.create(createTask)
  }

  @ApiOkResponse({ type: String })
  @Post()
  @Version('2')
  async createNewTaskV2() {
    return await this.taskServiceService.createV2()
  }

}
