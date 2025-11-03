import { CreateTaskDto } from "../../../../../../apps/task-service/src/dto/create-task.dto";
import { UpdateTaskDto } from "../../../../../../apps/task-service/src/dto/update-task.dto";
import { TaskEntity, TaskStatus } from "../../../../../../apps/task-service/src/entity/task.entity";
import { ITaskRepository } from "../../../../../../apps/task-service/src/interfaces/task‐repository.interface";
import { Injectable } from "@nestjs/common";
import { AttachmentEntity } from "../../../../../../apps/task-service/src/entity/attachment.entity";
import path from "path";
import { PrismaService } from "../../prisma/prisma.service";


@Injectable()
export class PrismaTaskRepository implements ITaskRepository {
  constructor(private readonly prisma: PrismaService) { }

  async uploadFiles(id: string, files: Express.Multer.File[]): Promise<void> {

    const attachments = files.map((file) => {
      return {
        taskId: id,
        filename: path.basename(file.path),
        size: file.size,
        mimetype: file.mimetype,
        createdAt: new Date(),
      };
    });

    await this.prisma.attachment.createMany({
      data: attachments,
    });
  }

  async create(taskDto: CreateTaskDto): Promise<TaskEntity> {
    try {
      const task = await this.prisma.task.create({
        data: {
          title: taskDto.title,
          description: taskDto.description,
          status: TaskStatus.PENDING
        },
        include: {
          attachments: true
        }
      });
      return this.toEntity(task);
    } catch (error) {
      console.log(error)
      throw new Error(error);
  
    }
  }

  async findAll(): Promise<TaskEntity[]> {
    const tasks = await this.prisma.task.findMany({
      include: { attachments: true },
    });
    return tasks.map((t) => this.toEntity(t));
  }
  async findById(id: string): Promise<TaskEntity | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { attachments: true },
    });

    if (!task) return null;
    return task ? this.toEntity(task) : null;
  }
  async update(id: string, taskDto: UpdateTaskDto): Promise<TaskEntity> {
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        title: taskDto.title,
        description: taskDto.description
      },
      include: {
        attachments: true
      }
    });
    return this.toEntity(updatedTask)
  }
  async delete(id: string): Promise<TaskEntity> {
    const task = await this.prisma.task.delete({
      where: { id },
      include: { attachments: true }
    })
    return this.toEntity(task)
  }

  private toEntity(prismaTask: any): TaskEntity {

    const task = new TaskEntity();
    task.id = prismaTask.id;
    task.title = prismaTask.title;
    task.description = prismaTask.description ?? null;
    task.status = prismaTask.status as TaskStatus;
    task.createdAt = prismaTask.createdAt;
    task.updatedAt = prismaTask.updatedAt;


    task.attachments = prismaTask.attachments.map((a: AttachmentEntity) => {
      const att = new AttachmentEntity();
      att.id = a.id;
      att.filename = a.filename;
      att.size = a.size;
      att.mimetype = a.mimetype;
      att.createdAt = a.createdAt;
      att.taskId = a.taskId;
      return att;
    });

    return task;
  }

}