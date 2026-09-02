import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('health')
export class HealthController {
  @Get()
  ping() {
    return { status: 'ok', service: 'shelfwise-api', time: new Date().toISOString() };
  }
}
