import { CreateTaskDto } from "../dto/create-task.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";
import { TaskEntity } from "../entity/task.entity";

export interface ITaskRepository {
    create(taskDto: CreateTaskDto): Promise<TaskEntity>;
    findAll(): Promise<TaskEntity[]>;
    findById(id: string): Promise<TaskEntity | null>;
    update(id: string, taskDto: UpdateTaskDto): Promise<TaskEntity>;
    delete(id: string): Promise<TaskEntity>;
}