import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../common/email/email.service';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Minimal mock that returns undefined by default
interface PrismaMock {
  user: {
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    findUniqueOrThrow: jest.Mock;
  };
  wallet: { create: jest.Mock };
  passwordReset: {
    create: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
  };
  $transaction: jest.Mock;
}

const prismaMock: PrismaMock = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findUniqueOrThrow: jest.fn(),
  },
  wallet: { create: jest.fn() },
  passwordReset: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn((cb: (tx: PrismaMock) => unknown) => cb(prismaMock)),
};

const jwtMock = {
  signAsync: jest.fn().mockResolvedValue('mock_access_token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Restore default $transaction behaviour (some tests override it)
    prismaMock.$transaction.mockImplementation((cb: (tx: PrismaMock) => unknown) => cb(prismaMock));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
        { provide: EmailService, useValue: { sendOtp: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // ──────────────────────────────────────────────────
  // register
  // ──────────────────────────────────────────────────
  describe('register', () => {
    const baseDto = {
      fullName: 'Test User',
      email: 'test@example.com',
      mobile: '9876543210',
      state: 'Delhi',
      password: 'StrongPass123!',
    };

    it('throws ConflictException if email already exists', async () => {
      // First findUnique (email) returns a user
      prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'existing-id', email: baseDto.email });

      const promise = service.register(baseDto);
      await expect(promise).rejects.toBeInstanceOf(ConflictException);
    });

    it('throws ConflictException with correct message if email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'existing-id', email: baseDto.email });

      await expect(service.register(baseDto)).rejects.toThrow('Email already registered');
    });

    it('throws ConflictException if mobile already exists', async () => {
      // First findUnique (email) → null (email is free)
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      // Second findUnique (mobile) → a user (mobile is taken)
      prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'existing-id', mobile: baseDto.mobile });

      const promise = service.register(baseDto);
      await expect(promise).rejects.toBeInstanceOf(ConflictException);
    });

    it('throws ConflictException with correct message if mobile already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'existing-id', mobile: baseDto.mobile });

      await expect(service.register(baseDto)).rejects.toThrow('Mobile number already registered');
    });

    it('creates user and wallet in transaction; adsId starts at ADS15001 when no prior user exists', async () => {
      const mockUser = {
        id: 'new-user-id',
        adsId: 'ADS15001',
        fullName: baseDto.fullName,
        email: baseDto.email,
        mobile: baseDto.mobile,
        state: baseDto.state,
        role: 'USER',
        referralCode: 'ADS15001',
        createdAt: new Date(),
      };

      // email findUnique → null
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      // mobile findUnique → null
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      // No referral code in dto; no third findUnique call

      // Inside transaction: findFirst for last user → null (no prior users)
      prismaMock.user.findFirst.mockResolvedValueOnce(null);
      // user.create inside transaction
      prismaMock.user.create.mockResolvedValueOnce(mockUser);
      // wallet.create inside transaction
      prismaMock.wallet.create.mockResolvedValueOnce({ id: 'wallet-id', userId: 'new-user-id' });

      const result = await service.register(baseDto);

      // Verify adsId
      expect(result.adsId).toBe('ADS15001');

      // Verify wallet was created with correct userId
      expect(prismaMock.wallet.create).toHaveBeenCalledWith({
        data: { userId: 'new-user-id' },
      });

      // Verify $transaction was invoked
      expect(prismaMock.$transaction).toHaveBeenCalled();
    });

    it('throws BadRequestException for invalid referral code', async () => {
      const dtoWithReferral = { ...baseDto, referralCode: 'INVALID_CODE' };

      // email findUnique → null
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      // mobile findUnique → null
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      // referral findUnique → null (code not found)
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.register(dtoWithReferral)).rejects.toThrow('Invalid referral code');
    });
  });

  // ──────────────────────────────────────────────────
  // login
  // ──────────────────────────────────────────────────
  describe('login', () => {
    const loginDto = { email: 'user@example.com', password: 'CorrectPass123!' };

    it('throws UnauthorizedException for unknown email', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.login(loginDto)).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('throws "Invalid email or password" for unknown email', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.login(loginDto)).rejects.toThrow('Invalid email or password');
    });

    it('throws UnauthorizedException for wrong password', async () => {
      const realHash = await bcrypt.hash('CorrectPass123!', 10);
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: 'user-id',
        email: loginDto.email,
        passwordHash: realHash,
        isBanned: false,
        isActive: true,
        role: 'USER',
      });

      await expect(service.login({ ...loginDto, password: 'wrongpass' })).rejects.toThrow(
        'Invalid email or password',
      );
    });

    it('throws UnauthorizedException for banned account with same message', async () => {
      const realHash = await bcrypt.hash(loginDto.password, 10);
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: 'user-id',
        email: loginDto.email,
        passwordHash: realHash,
        isBanned: true,
        isActive: true,
        role: 'USER',
      });

      await expect(service.login(loginDto)).rejects.toThrow('Invalid email or password');
    });

    it('throws UnauthorizedException for inactive account with same message', async () => {
      const realHash = await bcrypt.hash(loginDto.password, 10);
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: 'user-id',
        email: loginDto.email,
        passwordHash: realHash,
        isBanned: false,
        isActive: false,
        role: 'USER',
      });

      await expect(service.login(loginDto)).rejects.toThrow('Invalid email or password');
    });
  });

  // ──────────────────────────────────────────────────
  // logout
  // ──────────────────────────────────────────────────
  describe('logout', () => {
    it('clears refreshTokenHash on logout', async () => {
      prismaMock.user.update.mockResolvedValueOnce({ id: 'user-id' });

      await service.logout('user-id');

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: { refreshTokenHash: null },
      });
    });
  });
});
