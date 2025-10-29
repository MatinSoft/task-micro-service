import { Inject, Injectable } from '@nestjs/common';
import * as taskRepositoryInterface from './interfaces/task‐repository.interface';

@Injectable()
export class TaskServiceService {
  constructor(@Inject('ITaskRepository')
  private readonly taskRepository: taskRepositoryInterface.ITaskRepository) { }
  getHello(): string {
    return 'Hello World from Tasks!';
  }

}
