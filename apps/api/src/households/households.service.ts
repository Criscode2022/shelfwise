import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class HouseholdsService {
  constructor(private readonly prisma: PrismaService) {}
  listForUser(userId: string) {
    return this.prisma.household.findMany({ where: { members: { some: { userId } } }, include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } } });
  }
  create(userId: string, name: string) {
    return this.prisma.household.create({ data: { name, members: { create: { userId, role: 'OWNER' } } } });
  }
  async assertMember(userId: string, householdId: string) {
    const member = await this.prisma.householdMember.findUnique({ where: { userId_householdId: { userId, householdId } } });
    if (!member) throw new ForbiddenException('Not a member of this household');
    return member;
  }
  async get(userId: string, householdId: string) {
    await this.assertMember(userId, householdId);
    const household = await this.prisma.household.findUnique({ where: { id: householdId }, include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } } });
    if (!household) throw new NotFoundException();
    return household;
  }
}
