import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: registerDto.email,
            },
        });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                username: registerDto.username,
                passwordHash: hashedPassword,
            },
        });
        return { id: user.id, email: user.email, username: user.username };
    }

    async login(loginDto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: loginDto.email,
            },
        });
        if (!user) {
            throw new ConflictException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.passwordHash,
        );
        if (!isPasswordValid) {
            throw new ConflictException('Invalid credentials');
        }

        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });

        const refreshToken = randomUUID();

        await this.prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        return { accessToken, refreshToken };
    }

    async refresh(refreshDto: RefreshDto) {
        const tokenRecord = await this.prisma.refreshToken.findFirst({
            where: {
                token: refreshDto.refreshToken,
            },
        });
        if (!tokenRecord) {
            throw new ConflictException('Invalid refresh token');
        }

        if (tokenRecord.expiresAt < new Date()) {
            await this.prisma.refreshToken.delete({
                where: {
                    id: tokenRecord.id,
                },
            });
            throw new ConflictException('Invalid refresh token');
        }

        const user = await this.prisma.user.findUnique({
            where: {
                id: tokenRecord.userId,
            },
        });

        if (!user) {
            throw new ConflictException('Invalid refresh token');
        }

        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });

        return { accessToken };
    }

    async logout(refreshDto: RefreshDto) {
        await this.prisma.refreshToken.deleteMany({
            where: {
                token: refreshDto.refreshToken,
            },
        });
        return { message: 'Logged out successfully' };
    }
}
