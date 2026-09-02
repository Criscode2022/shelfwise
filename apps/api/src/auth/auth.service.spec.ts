import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
describe('AuthService', () => {
  const prisma = { user: { findUnique: jest.fn(), create: jest.fn() } };
  const jwt = { sign: jest.fn().mockReturnValue('token') };
  let service: AuthService;
  beforeEach(() => { jest.clearAllMocks(); service = new AuthService(prisma as never, jwt as never); });
  it('registers a new household owner', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 'u1', email: 'a@b.co', name: 'Ada' });
    const result = await service.register({ email: 'A@b.co', name: 'Ada', password: 'password1' });
    expect(result.accessToken).toBe('token');
  });
  it('rejects duplicate emails', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'u1' });
    await expect(service.register({ email: 'a@b.co', name: 'Ada', password: 'password1' })).rejects.toBeInstanceOf(ConflictException);
  });
  it('rejects unknown logins', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.login({ email: 'a@b.co', password: 'password1' })).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
