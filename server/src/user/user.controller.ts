import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UserService } from './user.service';

interface AuthRequest {
    user: { id: string; email: string };
}

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Req() req: AuthRequest) {
        return this.userService.getMe(req.user.id);
    }
}
