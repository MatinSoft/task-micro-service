import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "apps/task-service/src/dto/create-task.dto";
import { UpdateTaskDto } from "apps/task-service/src/dto/update-task.dto";
import { TaskEntity } from "apps/task-service/src/entity/task.entity";
import { ITaskRepository } from "apps/task-service/src/interfaces/task‐repository.interface";
import { Repository } from "typeorm";

@Injectable()
export class TypeOrmTaskRepository implements ITaskRepository {
    constructor(private readonly repo: Repository<TaskEntity>) { }

    async create(taskDto: CreateTaskDto): Promise<TaskEntity> {
        const task = await this.repo.create({
            ...taskDto
        })
        return task
    }
    findAll(): Promise<TaskEntity[]> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<TaskEntity | null> {
        throw new Error("Method not implemented.");
    }
    update(id: string, taskDto: UpdateTaskDto): Promise<TaskEntity> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}