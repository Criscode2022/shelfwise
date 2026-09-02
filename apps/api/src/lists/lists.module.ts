import { Module } from '@nestjs/common';
import { HouseholdsModule } from '../households/households.module';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
@Module({ imports: [HouseholdsModule], controllers: [ListsController], providers: [ListsService] })
export class ListsModule {}
