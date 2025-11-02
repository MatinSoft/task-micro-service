import { PartialType } from "@nestjs/swagger";
import { CreateScheduleEntity } from "./create.schedule.entity";

export class UpdateScheduleDto extends PartialType(CreateScheduleEntity) {}