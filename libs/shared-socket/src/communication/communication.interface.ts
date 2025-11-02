import { TaskStatus } from "apps/task-service/src/entity/task.entity";

export interface ITaskMessage {
  id: string,
  title: string
}
export interface IScheduleMessage {
  id: string,
  status: TaskStatus
}
export interface CommunicationStrategy {
  publish(eventName: string, payload: any): Promise<void>;
  subscribe(eventName: string, handler: (payload: any) => Promise<void> | void): void;
}