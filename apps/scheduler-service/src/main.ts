import { NestFactory } from '@nestjs/core';
import { SchedulerServiceModule } from './scheduler-service.module';
import { apiVersioning } from './setups/versioning';
import { setupGlobalPipes } from './setups/setupGlobalPieps';
import { swaggerInitialize } from './setups/swaggerSetup';

async function bootstrap() {
  const app = await NestFactory.create(SchedulerServiceModule);

  apiVersioning(app)
  setupGlobalPipes(app)
  app.setGlobalPrefix('api');
  swaggerInitialize(app)
  await app.listen(process.env.Port ?? 3000);
}
bootstrap();
