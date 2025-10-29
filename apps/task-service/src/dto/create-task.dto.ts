import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateTaskDto {

        @ApiProperty({
            type: String,
            required: true
        })
        @IsString()
        @IsNotEmpty()
        title: string
    
    
        @ApiProperty({
            type: String,
            required: false
        })
        @IsOptional()
        @IsString()
        description?: string


}