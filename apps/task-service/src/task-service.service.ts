import { Inject, Injectable } from '@nestjs/common';
import * as taskRepositoryInterface from './interfaces/task‐repository.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskEntity } from './entity/task.entity';

@Injectable()
export class TaskServiceService {
  constructor(@Inject('ITaskRepository')
  private readonly taskRepository: taskRepositoryInterface.ITaskRepository) { }

  async create(taskDto: CreateTaskDto): Promise<TaskEntity> {
    return await this.taskRepository.create(taskDto)
  }

  async createV2(): Promise<string> {
    return "Task version 2 Created"
  }

}
