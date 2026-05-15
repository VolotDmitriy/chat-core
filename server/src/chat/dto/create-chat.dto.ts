import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsBoolean()
    isGroup?: boolean;

    @IsArray()
    @IsString({ each: true })
    memberIds: string[];
}
