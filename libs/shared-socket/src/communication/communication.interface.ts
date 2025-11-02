export interface ITaskMessage {
  id: string,
  title: string
}
export interface CommunicationStrategy {
  publish(eventName: string, payload: any): Promise<void>;
  subscribe(eventName: string, handler: (payload: any) => Promise<void> | void): void;
}