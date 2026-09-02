import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { IsArray, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListsService } from './lists.service';
class LineDto { @IsString() name!: string; }
class CreateListDto {
  @IsString() householdId!: string;
  @IsString() @MinLength(2) title!: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => LineDto) lines?: LineDto[];
}
@UseGuards(JwtAuthGuard)
@Controller('lists')
export class ListsController {
  constructor(private readonly lists: ListsService) {}
  @Get() list(@Req() req: { user: { userId: string } }, @Query('householdId') householdId: string) { return this.lists.list(req.user.userId, householdId); }
  @Post() create(@Req() req: { user: { userId: string } }, @Body() dto: CreateListDto) { return this.lists.create(req.user.userId, dto.householdId, dto.title, dto.lines ?? []); }
  @Post('from-expiring') fromExpiring(@Req() req: { user: { userId: string } }, @Body() body: { householdId: string }) { return this.lists.fromExpiring(req.user.userId, body.householdId); }
  @Patch('lines/:id') toggle(@Req() req: { user: { userId: string } }, @Param('id') id: string) { return this.lists.toggleLine(req.user.userId, id); }
}
