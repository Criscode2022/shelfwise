import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ItemLocation } from '@prisma/client';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InventoryService } from './inventory.service';
class ItemDto {
  @IsString() householdId!: string;
  @IsString() name!: string;
  @IsString() category!: string;
  @Type(() => Number) @IsNumber() @Min(0) quantity!: number;
  @IsString() unit!: string;
  @IsOptional() @IsEnum(ItemLocation) location?: ItemLocation;
  @IsOptional() @IsString() expiresOn?: string;
  @IsOptional() @Type(() => Number) @IsNumber() unitCostCents?: number;
  @IsOptional() @IsString() notes?: string;
}
@UseGuards(JwtAuthGuard)
@Controller('items')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}
  @Get() list(@Req() req: { user: { userId: string } }, @Query('householdId') householdId: string) { return this.inventory.list(req.user.userId, householdId); }
  @Get('expiring') expiring(@Req() req: { user: { userId: string } }, @Query('householdId') householdId: string, @Query('days') days?: string) { return this.inventory.expiring(req.user.userId, householdId, days ? Number(days) : 7); }
  @Post() create(@Req() req: { user: { userId: string } }, @Body() dto: ItemDto) { return this.inventory.create(req.user.userId, dto); }
  @Patch(':id') update(@Req() req: { user: { userId: string } }, @Param('id') id: string, @Body() dto: Partial<ItemDto>) { return this.inventory.update(req.user.userId, id, dto); }
  @Delete(':id') remove(@Req() req: { user: { userId: string } }, @Param('id') id: string) { return this.inventory.remove(req.user.userId, id); }
}
