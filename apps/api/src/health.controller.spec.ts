import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns ok', () => {
    const res = new HealthController().ping();
    expect(res.status).toBe('ok');
    expect(res.service).toBe('shelfwise-api');
  });
});
