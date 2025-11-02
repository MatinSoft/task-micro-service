export const TaskEvents = {
  CREATED: 'task.created',
  UPDATED: 'task.updated',
  DELETED: 'task.deleted',
  SCHEDULE_UPDATE: "SCHEDULE_UPDATE"
};

export const JobEvents = {
  EXECUTED: 'job.executed',
  CREATED: 'job.created',
};

export interface TaskCreatedPayload {
  id: string;
  title: string;

}

export interface JobExecutedPayload {
  jobId: string;
  success: boolean;
}