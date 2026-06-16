import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import type { AuthRequest } from '../types/request.types';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Req() req: AuthRequest) {
        return this.userService.getMe(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('search')
    searchUser(@Req() req: AuthRequest, @Query('q') q: string) {
        return this.userService.searchUser(q, req.user.id);
    }
}
