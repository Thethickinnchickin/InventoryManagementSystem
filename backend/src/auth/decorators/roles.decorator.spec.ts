import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';
import { UserRole } from '../../entities/user.entity';

describe('Roles Decorator', () => {
  const reflector = new Reflector();

  it('should set metadata for roles', () => {
    @Roles(UserRole.ADMIN, UserRole.USER)
    class TestController {}

    const metadata = reflector.get('roles', TestController);
    expect(metadata).toEqual([UserRole.ADMIN, UserRole.USER]);
  });
});
