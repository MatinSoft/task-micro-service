import { PrismaService } from "./prisma.service";
import { PrismaTaskRepository } from "../repositories/prisma/task.repository";
import { Module } from "@nestjs/common";

@Module({
    imports: [],
    providers: [PrismaTaskRepository,PrismaService],
    exports: [PrismaService]
})
export class PrismaModule { }