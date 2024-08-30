import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Replace with your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  
  app.use(cookieParser());

  await app.listen(3000);
}

bootstrap();
