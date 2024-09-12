import { Reflector } from '@nestjs/core';
import { Public, IS_PUBLIC_KEY } from './public.decorator';

describe('Public Decorator', () => {
  const reflector = new Reflector();

  it('should set metadata for public routes', () => {
    @Public()
    class TestController {}

    const metadata = reflector.get(IS_PUBLIC_KEY, TestController);
    expect(metadata).toBe(true);
  });
});
