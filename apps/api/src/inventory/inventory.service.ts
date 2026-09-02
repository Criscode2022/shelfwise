import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemLocation } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { HouseholdsService } from '../households/households.service';
export type ItemInput = { householdId: string; name: string; category: string; quantity: number; unit: string; location?: ItemLocation; expiresOn?: string | null; unitCostCents?: number; notes?: string; };
@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService, private readonly households: HouseholdsService) {}
  async list(userId: string, householdId: string) {
    await this.households.assertMember(userId, householdId);
    return this.prisma.inventoryItem.findMany({ where: { householdId }, orderBy: [{ expiresOn: 'asc' }, { name: 'asc' }] });
  }
  async expiring(userId: string, householdId: string, days = 7) {
    await this.households.assertMember(userId, householdId);
    const until = new Date(); until.setDate(until.getDate() + days);
    return this.prisma.inventoryItem.findMany({ where: { householdId, expiresOn: { lte: until } }, orderBy: { expiresOn: 'asc' } });
  }
  async create(userId: string, input: ItemInput) {
    await this.households.assertMember(userId, input.householdId);
    return this.prisma.inventoryItem.create({ data: { name: input.name, category: input.category, quantity: input.quantity, unit: input.unit, location: input.location ?? 'PANTRY', expiresOn: input.expiresOn ? new Date(input.expiresOn) : null, unitCostCents: input.unitCostCents ?? 0, notes: input.notes, householdId: input.householdId, createdById: userId } });
  }
  async update(userId: string, id: string, patch: Partial<ItemInput>) {
    const item = await this.prisma.inventoryItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException();
    await this.households.assertMember(userId, item.householdId);
    return this.prisma.inventoryItem.update({ where: { id }, data: { name: patch.name, category: patch.category, quantity: patch.quantity, unit: patch.unit, location: patch.location, expiresOn: patch.expiresOn === undefined ? undefined : patch.expiresOn ? new Date(patch.expiresOn) : null, unitCostCents: patch.unitCostCents, notes: patch.notes } });
  }
  async remove(userId: string, id: string) {
    const item = await this.prisma.inventoryItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException();
    await this.households.assertMember(userId, item.householdId);
    await this.prisma.inventoryItem.delete({ where: { id } });
    return { ok: true };
  }
  expiryStatus(expiresOn: Date | null, now = new Date()) {
    if (!expiresOn) return 'ok' as const;
    const days = (expiresOn.getTime() - now.getTime()) / 86_400_000;
    if (days < 0) return 'expired' as const;
    if (days <= 3) return 'critical' as const;
    if (days <= 7) return 'watch' as const;
    return 'ok' as const;
  }
}
