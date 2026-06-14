import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Lightweight liveness probe (no DB) — used by an uptime pinger to keep the
  // free-tier instance warm and avoid cold-start latency on login.
  @Get('health')
  health(): { status: string; ts: number } {
    return { status: 'ok', ts: Date.now() };
  }
}
