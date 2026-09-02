CREATE TYPE "HouseholdRole" AS ENUM ('OWNER', 'MEMBER');
CREATE TYPE "ItemLocation" AS ENUM ('FRIDGE', 'FREEZER', 'PANTRY', 'COUNTER', 'OTHER');
CREATE TYPE "ListStatus" AS ENUM ('OPEN', 'DONE');
CREATE TABLE "User" (
  "id" TEXT NOT NULL, "email" TEXT NOT NULL, "name" TEXT NOT NULL, "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "Household" (
  "id" TEXT NOT NULL, "name" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Household_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "HouseholdMember" (
  "id" TEXT NOT NULL, "role" "HouseholdRole" NOT NULL DEFAULT 'MEMBER', "userId" TEXT NOT NULL, "householdId" TEXT NOT NULL,
  CONSTRAINT "HouseholdMember_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "HouseholdMember_userId_householdId_key" ON "HouseholdMember"("userId", "householdId");
ALTER TABLE "HouseholdMember" ADD CONSTRAINT "HouseholdMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HouseholdMember" ADD CONSTRAINT "HouseholdMember_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TABLE "InventoryItem" (
  "id" TEXT NOT NULL, "name" TEXT NOT NULL, "category" TEXT NOT NULL, "quantity" DOUBLE PRECISION NOT NULL, "unit" TEXT NOT NULL,
  "location" "ItemLocation" NOT NULL DEFAULT 'PANTRY', "expiresOn" TIMESTAMP(3), "unitCostCents" INTEGER NOT NULL DEFAULT 0,
  "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  "householdId" TEXT NOT NULL, "createdById" TEXT NOT NULL, CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE TABLE "ShoppingList" (
  "id" TEXT NOT NULL, "title" TEXT NOT NULL, "status" "ListStatus" NOT NULL DEFAULT 'OPEN',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "householdId" TEXT NOT NULL, "createdById" TEXT NOT NULL,
  CONSTRAINT "ShoppingList_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ShoppingList" ADD CONSTRAINT "ShoppingList_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ShoppingList" ADD CONSTRAINT "ShoppingList_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE TABLE "ListLine" (
  "id" TEXT NOT NULL, "name" TEXT NOT NULL, "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "unit" TEXT NOT NULL DEFAULT 'pcs', "checked" BOOLEAN NOT NULL DEFAULT false, "listId" TEXT NOT NULL,
  CONSTRAINT "ListLine_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ListLine" ADD CONSTRAINT "ListLine_listId_fkey" FOREIGN KEY ("listId") REFERENCES "ShoppingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
