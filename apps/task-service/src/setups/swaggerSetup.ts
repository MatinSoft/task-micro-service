import { INestApplication } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const swaggerInitialize = (app: INestApplication) => {


    const config = new DocumentBuilder()
        .setTitle('task-service')
        .setDescription('task-service Api description')
        .setVersion('1.0')
        .addTag('task-service')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('task-service-api', app, document, {
        swaggerOptions: {
            persistAuthorization: true
        }
    });

}

export { swaggerInitialize }