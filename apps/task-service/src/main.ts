import { NestFactory } from '@nestjs/core';
import { TaskServiceModule } from './task-service.module';

async function bootstrap() {
  const app = await NestFactory.create(TaskServiceModule);
  await app.listen(process.env.taskPort ?? 4000);
}
bootstrap();
