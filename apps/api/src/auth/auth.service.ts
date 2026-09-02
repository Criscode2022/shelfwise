import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (existing) throw new ConflictException('Email already registered');
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name,
        passwordHash: await bcrypt.hash(dto.password, 10),
        memberships: { create: { role: 'OWNER', household: { create: { name: `${dto.name}'s kitchen` } } } },
      },
    });
    return this.issue(user.id, user.email, user.name);
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.issue(user.id, user.email, user.name);
  }
  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { memberships: { include: { household: true } } } });
    if (!user) throw new UnauthorizedException();
    return { id: user.id, email: user.email, name: user.name, households: user.memberships.map((m) => ({ id: m.household.id, name: m.household.name, role: m.role })) };
  }
  private issue(id: string, email: string, name: string) {
    return { accessToken: this.jwt.sign({ sub: id, email }), user: { id, email, name } };
  }
}
