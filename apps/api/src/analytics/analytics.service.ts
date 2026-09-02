import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HouseholdsService } from '../households/households.service';
import { InventoryService } from '../inventory/inventory.service';
@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService, private readonly households: HouseholdsService, private readonly inventory: InventoryService) {}
  async overview(userId: string, householdId: string) {
    await this.households.assertMember(userId, householdId);
    const items = await this.prisma.inventoryItem.findMany({ where: { householdId } });
    const now = new Date(); const week = new Date(); week.setDate(week.getDate() + 7);
    const expired = items.filter((i) => i.expiresOn && i.expiresOn < now);
    const atRisk = items.filter((i) => i.expiresOn && i.expiresOn >= now && i.expiresOn <= week);
    const wasteCents = expired.reduce((sum, i) => sum + i.unitCostCents * i.quantity, 0);
    const riskCents = atRisk.reduce((sum, i) => sum + i.unitCostCents * i.quantity, 0);
    const byCategory: Record<string, number> = {};
    for (const item of items) byCategory[item.category] = (byCategory[item.category] ?? 0) + 1;
    return {
      totalItems: items.length, expiredCount: expired.length, atRiskCount: atRisk.length,
      estimatedWasteUsd: Number((wasteCents / 100).toFixed(2)), atRiskUsd: Number((riskCents / 100).toFixed(2)),
      byCategory: Object.entries(byCategory).map(([category, count]) => ({ category, count })),
      heat: items.slice(0, 12).map((i) => ({ id: i.id, name: i.name, status: this.inventory.expiryStatus(i.expiresOn, now), expiresOn: i.expiresOn })),
    };
  }
}
