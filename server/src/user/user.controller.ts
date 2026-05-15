import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
}
