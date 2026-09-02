import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HouseholdsService } from '../households/households.service';
@Injectable()
export class ListsService {
  constructor(private readonly prisma: PrismaService, private readonly households: HouseholdsService) {}
  async list(userId: string, householdId: string) {
    await this.households.assertMember(userId, householdId);
    return this.prisma.shoppingList.findMany({ where: { householdId }, include: { lines: true }, orderBy: { createdAt: 'desc' } });
  }
  async create(userId: string, householdId: string, title: string, lines: { name: string; quantity?: number; unit?: string }[]) {
    await this.households.assertMember(userId, householdId);
    return this.prisma.shoppingList.create({ data: { title, householdId, createdById: userId, lines: { create: lines.map((l) => ({ name: l.name, quantity: l.quantity ?? 1, unit: l.unit ?? 'pcs' })) } }, include: { lines: true } });
  }
  async toggleLine(userId: string, lineId: string) {
    const line = await this.prisma.listLine.findUnique({ where: { id: lineId }, include: { list: true } });
    if (!line) throw new NotFoundException();
    await this.households.assertMember(userId, line.list.householdId);
    return this.prisma.listLine.update({ where: { id: lineId }, data: { checked: !line.checked } });
  }
  async fromExpiring(userId: string, householdId: string) {
    await this.households.assertMember(userId, householdId);
    const until = new Date(); until.setDate(until.getDate() + 5);
    const items = await this.prisma.inventoryItem.findMany({ where: { householdId, expiresOn: { lte: until } } });
    return this.create(userId, householdId, 'Use-first rescue list', items.map((i) => ({ name: i.name, quantity: i.quantity, unit: i.unit })));
  }
}
