import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { TaskEvents } from "lib/shared-socket/events";

@WebSocketGateway() 
export class SchedulerWsListener {

    @SubscribeMessage(TaskEvents.CREATED)
    handleCreateTask(@MessageBody() message: any): void {
      console.log('Received message:', message);
    }
    
    @SubscribeMessage(TaskEvents.UPDATED)
    handleUpdateTask(@MessageBody() message: any): void {
      console.log('Received message:', message);
    }

    @SubscribeMessage(TaskEvents.DELETED)
    handleDeleteTask(@MessageBody() message: any): void {
      console.log('Received message:', message);
    }

}