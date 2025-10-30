// repositories/typeOrm/task.repository.ts
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from 'apps/task-service/src/dto/create-task.dto';
import { UpdateTaskDto } from 'apps/task-service/src/dto/update-task.dto';
import { TaskEntity } from 'apps/task-service/src/entity/task.entity';
import { AttachmentEntity } from 'apps/task-service/src/entity/attachment.entity';
import { Repository } from 'typeorm';
import { ITaskRepository } from 'apps/task-service/src/interfaces/task‐repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
@Injectable()
export class TypeOrmTaskRepository implements ITaskRepository {
  constructor(
    private readonly repo: Repository<TaskEntity>,
    @InjectRepository(AttachmentEntity)
    private readonly attachmentRepo: Repository<AttachmentEntity>
    ) {}
 
  async uploadFiles(id: string, files: Express.Multer.File[]): Promise<void> {
  
    const attachments = files.map((file) => {
      const attachment = new AttachmentEntity();
      attachment.taskId = id; 
      attachment.filename = path.basename(file.path)
      attachment.size = file.size;
      attachment.mimetype = file.mimetype;
      attachment.createdAt = new Date(); 
      return attachment;
    });

    await this.attachmentRepo.save(attachments);

  }

  async create(taskDto: CreateTaskDto): Promise<TaskEntity> {
    const task = this.repo.create({
      title: taskDto.title,
      description: taskDto.description,
      status: 'PENDING',
    });

    const saved = await this.repo.save(task);
    return this.loadWithAttachments(saved);
  }

  async findAll(): Promise<TaskEntity[]> {
    const tasks = await this.repo.find({
      relations: ['attachments'],
    });

    return tasks.map((t) => this.sanitizeRelations(t));
  }

  async findById(id: string): Promise<TaskEntity | null> {
    const task = await this.repo.findOne({
      where: { id },
      relations: ['attachments'],
    });

    return task ? this.sanitizeRelations(task) : null;
  }

  async update(id: string, taskDto: UpdateTaskDto): Promise<TaskEntity> {
    await this.repo.update(id, {
      title: taskDto.title,
      description: taskDto.description,
    });

    const updated = await this.repo.findOne({
      where: { id },
      relations: ['attachments'],
    });

    if (!updated) throw new Error('Task not found after update');

    return this.sanitizeRelations(updated);
  }

  async delete(id: string): Promise<TaskEntity> {
    const task = await this.repo.findOne({
      where: { id },
      relations: ['attachments'],
    });

    if (!task) throw new Error('Task not found');

    await this.repo.remove(task);

    return this.sanitizeRelations(task);
  }

  private async loadWithAttachments(task: TaskEntity): Promise<TaskEntity> {
    return await this.repo.findOne({
      where: { id: task.id },
      relations: ['attachments'],
    }).then(t => this.sanitizeRelations(t!));
  }

  private sanitizeRelations(task: TaskEntity): TaskEntity {
    if (task.attachments) {
      task.attachments = task.attachments.map((att) => {
        const cleanAtt = new AttachmentEntity();
        cleanAtt.id = att.id;
        cleanAtt.filename = att.filename;
        cleanAtt.size = att.size;
        cleanAtt.mimetype = att.mimetype;
        cleanAtt.createdAt = att.createdAt;
        cleanAtt.taskId = att.taskId;
        return cleanAtt;
      });
    }
    return task;
  }
}