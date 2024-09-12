import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../../entities/user.entity';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if no roles are specified', () => {
    const context = {
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: UserRole.USER } }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(undefined);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access if user role matches required role', () => {
    const context = {
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: UserRole.ADMIN } }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ADMIN]);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if user role does not match required role', () => {
    const context = {
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: UserRole.USER } }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ADMIN]);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
