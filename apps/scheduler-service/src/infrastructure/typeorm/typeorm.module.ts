import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleEntity } from '../../entity/schedule.entity';


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
        database: config.get('DATABASE_NAME_SCHEDULE'),
        entities: config.get<string>('ORM') == "typeorm" ? [ScheduleEntity] : [],
        synchronize: config.get<string>('ORM') == "typeorm" ? true : false,
      }),
    }),
    TypeOrmModule.forFeature([ScheduleEntity]),
  ],
  exports: [TypeOrmModule],
})
export class MyTypeOrmModule { }
