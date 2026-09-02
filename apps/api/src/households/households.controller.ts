import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HouseholdsService } from './households.service';
class CreateHouseholdDto { @IsString() @MinLength(2) name!: string; }
@UseGuards(JwtAuthGuard)
@Controller('households')
export class HouseholdsController {
  constructor(private readonly households: HouseholdsService) {}
  @Get() list(@Req() req: { user: { userId: string } }) { return this.households.listForUser(req.user.userId); }
  @Post() create(@Req() req: { user: { userId: string } }, @Body() dto: CreateHouseholdDto) { return this.households.create(req.user.userId, dto.name); }
  @Get(':id') get(@Req() req: { user: { userId: string } }, @Param('id') id: string) { return this.households.get(req.user.userId, id); }
}
