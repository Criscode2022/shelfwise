import { PrismaClient, ItemLocation } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const passwordHash = await bcrypt.hash('Shelfwise!2026', 10);
  const chef = await prisma.user.upsert({ where: { email: 'chef@shelfwise.app' }, update: {}, create: { email: 'chef@shelfwise.app', name: 'Ava Chen', passwordHash } });
  const home = await prisma.household.create({ data: { name: 'Harbor Kitchen', members: { create: { userId: chef.id, role: 'OWNER' } } } });
  const soon = new Date(); soon.setDate(soon.getDate() + 2);
  const later = new Date(); later.setDate(later.getDate() + 21);
  await prisma.inventoryItem.createMany({ data: [
    { name: 'Baby spinach', category: 'Produce', quantity: 1, unit: 'bag', location: ItemLocation.FRIDGE, expiresOn: soon, unitCostCents: 249, householdId: home.id, createdById: chef.id },
    { name: 'Greek yogurt', category: 'Dairy', quantity: 4, unit: 'cups', location: ItemLocation.FRIDGE, expiresOn: later, unitCostCents: 189, householdId: home.id, createdById: chef.id },
    { name: 'Dried chickpeas', category: 'Dry goods', quantity: 800, unit: 'g', location: ItemLocation.PANTRY, unitCostCents: 320, householdId: home.id, createdById: chef.id },
  ]});
  await prisma.shoppingList.create({ data: { title: 'Weekend restock', householdId: home.id, createdById: chef.id, lines: { create: [{ name: 'Lemons', quantity: 6, unit: 'pcs' }, { name: 'Olive oil', quantity: 1, unit: 'bottle' }] } } });
}
main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
