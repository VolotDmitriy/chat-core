import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async getMe(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async searchUser(query: string, currentUserId: string) {
        const users = await this.prisma.user.findMany({
            where: {
                AND: [
                    { id: { not: currentUserId } },
                    {
                        OR: [
                            {
                                username: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                email: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            },
            select: {
                id: true,
                email: true,
                username: true,
            },
        });
        return users;
    }
}
