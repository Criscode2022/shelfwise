import { Module } from '@nestjs/common';
import { HouseholdsModule } from '../households/households.module';
import { InventoryModule } from '../inventory/inventory.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
@Module({ imports: [HouseholdsModule, InventoryModule], controllers: [AnalyticsController], providers: [AnalyticsService] })
export class AnalyticsModule {}
