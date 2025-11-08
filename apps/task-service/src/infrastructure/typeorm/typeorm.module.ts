import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskEntity } from '../../entity/task.entity';
import { AttachmentEntity } from '../../entity/attachment.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 5432),
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME_TASK'),
        entities: config.get<string>('ORM') == "typeorm" ? [TaskEntity, AttachmentEntity] : [],
        synchronize: config.get<string>('ORM') == "typeorm" ? true : false,
      }),
    }),
    TypeOrmModule.forFeature([TaskEntity, AttachmentEntity]),
  ],
  exports: [TypeOrmModule],
})
export class MyTypeOrmModule { }
