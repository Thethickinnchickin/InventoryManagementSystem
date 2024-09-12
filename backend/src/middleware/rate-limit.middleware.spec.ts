import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../app.module';
import { RateLimitMiddleware } from './rate-limit.middleware';

describe('RateLimitMiddleware', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(new RateLimitMiddleware().use.bind(new RateLimitMiddleware()));
    await app.init();
  });

  it('should allow requests within the rate limit', async () => {
    const response = await supertest(app.getHttpServer()).get('/categories'); // Ensure this route exists
    expect(response.status).toBe(200);
  });

  it('should return 429 status code if rate limit is exceeded', async () => {
    for (let i = 0; i < 101; i++) {
      await supertest(app.getHttpServer()).get('/test/some-route');
    }
    const response = await supertest(app.getHttpServer()).get('/products');
    expect(response.status).toBe(429);
  });

  afterAll(async () => {
    await app.close();
  });
});
