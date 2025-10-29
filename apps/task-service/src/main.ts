import { NestFactory } from '@nestjs/core';
import { TaskServiceModule } from './task-service.module';
import { swaggerInitialize } from './setups/swaggerSetup';

async function bootstrap() {
  const app = await NestFactory.create(TaskServiceModule);
  swaggerInitialize(app)
  await app.listen(process.env.Port ?? 4000);
}
bootstrap();
