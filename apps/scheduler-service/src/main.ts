import { NestFactory } from '@nestjs/core';
import { SchedulerServiceModule } from './scheduler-service.module';

async function bootstrap() {
  const app = await NestFactory.create(SchedulerServiceModule);
  await app.listen(process.env.schedulerPort ?? 3000);
}
bootstrap();
