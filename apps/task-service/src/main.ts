import { NestFactory } from '@nestjs/core';
import { TaskServiceModule } from './task-service.module';
import { swaggerInitialize } from './setups/swaggerSetup';
import { setupGlobalPipes } from './setups/setupGlobalPieps';
import { apiVersioning } from './setups/versioning';

async function bootstrap() {
  const app = await NestFactory.create(TaskServiceModule);
  
  apiVersioning(app)
  setupGlobalPipes(app)
  app.setGlobalPrefix('api');
  swaggerInitialize(app)

  await app.listen(process.env.Port ?? 4000);
}
bootstrap();
