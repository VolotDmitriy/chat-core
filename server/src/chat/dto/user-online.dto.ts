import { IsArray, IsString } from 'class-validator';

export class OnlineUsersDto {
    @IsArray()
    @IsString({ each: true })
    userIds: string[];
}
