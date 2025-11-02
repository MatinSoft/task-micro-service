import { PrismaService } from "./prisma.service";
import { Module } from "@nestjs/common";
import { SchedulePrismaRepo } from "../repositories/prisma/prisma.schedule.repository";

@Module({
    imports: [],
    providers: [SchedulePrismaRepo,PrismaService],
    exports: [PrismaService]
})
export class PrismaModule { }