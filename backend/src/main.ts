import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverless from 'serverless-http'; // Import serverless-http for Vercel
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const expressApp = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Enable CORS
  app.enableCors({
    origin: 'https://inventory-management-system-front.vercel.app', // Replace with your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Inventory Management API')
    .setDescription('API documentation for the Inventory Management system')
    .setVersion('1.0')
    .addBearerAuth() // If you're using JWT authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.init(); // Initialize the NestJS app without listening (for serverless)
}

// If running on Vercel, export the handler for serverless
if (process.env.VERCEL) {
  // Create the serverless handler
  module.exports.handler = async (req, res) => {
    if (!expressApp.locals.bootstrapped) {
      await bootstrap();
      expressApp.locals.bootstrapped = true;
    }
    const handler = serverless(expressApp);
    return handler(req, res);
  };
} else {
  // If running locally, start listening on port 3000
  bootstrap().then(() => {
    expressApp.listen(3000, () => {
      console.log('NestJS app running on http://localhost:3000');
    });
  });
}
