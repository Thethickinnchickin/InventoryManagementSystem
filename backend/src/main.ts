import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:4000', // Replace with your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  
  app.use(cookieParser());

  await app.listen(3000);
}

if (process.env.VERCEL) {
  // Running on Vercel
  const serverless = require('serverless-http');
  module.exports.handler = serverless(bootstrap());
} else {
  // Running locally or in a different environment
  bootstrap();
}
