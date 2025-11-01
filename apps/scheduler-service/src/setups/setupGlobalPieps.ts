import { INestApplication, ValidationPipe } from "@nestjs/common"

const setupGlobalPipes = (app: INestApplication) => {
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
}

export { setupGlobalPipes }