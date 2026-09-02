import { InventoryService } from './inventory.service';
describe('InventoryService.expiryStatus', () => {
  const service = new InventoryService({} as never, {} as never);
  const now = new Date('2026-09-02T00:00:00Z');
  it('marks missing dates as ok', () => { expect(service.expiryStatus(null, now)).toBe('ok'); });
  it('marks past dates as expired', () => { expect(service.expiryStatus(new Date('2026-08-01'), now)).toBe('expired'); });
  it('marks 2-day window as critical', () => { expect(service.expiryStatus(new Date('2026-09-04'), now)).toBe('critical'); });
  it('marks 6-day window as watch', () => { expect(service.expiryStatus(new Date('2026-09-08'), now)).toBe('watch'); });
});
