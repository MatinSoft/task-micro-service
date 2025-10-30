import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UploadedFiles, UseInterceptors, Version } from '@nestjs/common';
import { TaskServiceService } from './task-service.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskEntity } from './entity/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { TaskFileUploadOptions } from './utils/fileUpload/multer.storage';

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

  @Post(':id/upload')
  @ApiOperation({ summary: 'Upload files to task' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Files uploaded' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiBadRequestResponse({ description: 'Invalid file type or size' })
  @UseInterceptors(AnyFilesInterceptor(TaskFileUploadOptions()))
  async uploadFile(
    @Param("id", ParseUUIDPipe) id: string,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
   return await this.taskServiceService.uploadFiles(id , files)
  }

  @ApiOkResponse({ type: String })
  @Post()
  @Version('2')
  async createNewTaskV2() {
    return await this.taskServiceService.createV2()
  }

  @ApiOkResponse({ type: TaskEntity })
  @ApiNotFoundResponse({ description: "Task not found" })
  @Get(":id")
  async getTaskById(@Param("id", ParseUUIDPipe) id: string) {
    return await this.taskServiceService.getTaskById(id)
  }

  @ApiOkResponse({ type: TaskEntity, isArray: true })
  @Get()
  async getTasks() {
    return await this.taskServiceService.getTasks()
  }

  @Patch(":id")
  @ApiOkResponse({ type: TaskEntity })
  @ApiNotFoundResponse({ description: "Task not found" })
  async editTask(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateTask: UpdateTaskDto
  ) {
    return await this.taskServiceService.updateTask(id, updateTask)
  }

  @Delete(":id")
  @ApiOkResponse({ type: TaskEntity })
  @ApiNotFoundResponse({ description: "Task not found" })
  async deleteTask(
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return await this.taskServiceService.deleteTask(id)
  }
}
