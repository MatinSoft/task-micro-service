import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as taskRepositoryInterface from './interfaces/task‐repository.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskEntity } from './entity/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FileSystemService } from './utils/file-system/file-system.service';
import path from 'path';

@Injectable()
export class TaskServiceService {
  constructor(@Inject('ITaskRepository')
  private readonly taskRepository: taskRepositoryInterface.ITaskRepository,
    private readonly fileSystemService: FileSystemService
  ) { }

  async create(taskDto: CreateTaskDto): Promise<TaskEntity> {
    return await this.taskRepository.create(taskDto)
  }

  async createV2(): Promise<string> {
    return "Task version 2 Created"
  }

  async getTaskById(id: string): Promise<TaskEntity> {
    const foundedTicket = await this.taskRepository.findById(id)
    if (!foundedTicket) {
      throw new NotFoundException("Task not found")
    }
    return foundedTicket
  }

  async getTasks(): Promise<TaskEntity[]> {
    return await this.taskRepository.findAll()
  }

  async updateTask(id: string, updateTask: UpdateTaskDto): Promise<TaskEntity> {
    const foundedTicket = await this.taskRepository.findById(id)
    if (!foundedTicket) {
      throw new NotFoundException("Task not found")
    }
    return await this.taskRepository.update(id, updateTask)
  }

  async deleteTask(id: string): Promise<TaskEntity> {
    const foundTask = await this.taskRepository.findById(id)
    if (!foundTask) {
      throw new NotFoundException("Task not found")
    }
    if (foundTask.attachments && foundTask.attachments.length > 0) {
      for (const attachment of foundTask.attachments) {
        const filePath = this.getFilePathForAttachment(id, attachment.filename);

        // Delete the file if it exists
        if (this.fileSystemService.isExists(filePath)) {
           this.fileSystemService.delete(filePath);
        }
      }

    }
    return await this.taskRepository.delete(id)
  }

  async uploadFiles(id: string, files: Array<Express.Multer.File>): Promise<void> {
    const foundedTicket = await this.taskRepository.findById(id)
    if (!foundedTicket) {
      throw new NotFoundException("Task not found")
    }
    return await this.taskRepository.uploadFiles(id, files)
  }

  private getFilePathForAttachment(taskId: string, fileName: string): string {
    return path.join(process.cwd(), "apps", "task-service", 'uploads', taskId, fileName);
  }

}
