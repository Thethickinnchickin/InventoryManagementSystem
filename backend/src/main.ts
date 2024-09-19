import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const expressApp = express();

/**
 * The `bootstrap` function initializes and configures the NestJS application.
 * It sets up CORS, cookie parsing, Swagger documentation, and prepares the app
 * for serverless deployment or local execution.
 */
async function bootstrap() {
  // Create a NestJS application with an Express adapter
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Enable CORS with specific configurations for cross-origin requests
  app.enableCors({
    //origin: ['https://inventory-management-system-front.vercel.app', 'http://localhost:4000'], // Allow frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
    origin: "*",
    credentials: true, // Allow credentials (cookies, authorization headers)
  });

  // Use cookie-parser middleware for parsing cookies
  app.use(cookieParser());

  // Configure Swagger for API documentation
  const config = new DocumentBuilder()
    .setTitle('Inventory Management API')
    .setDescription('API documentation for the Inventory Management system')
    .setVersion('1.0')
    .addBearerAuth() // Add Bearer token authentication to Swagger UI
    .build();

  // Create Swagger document and set up Swagger UI
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Initialize the NestJS application without starting the server (for serverless)
  await app.init();
}


bootstrap().then(() => {
  expressApp.listen(3000, () => {
    console.log('NestJS app running on http://localhost:3000');
  });
});

