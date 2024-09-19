import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors';


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
  const corsOptions = {
    origin: "https://inventory-management-system-front.vercel.app/",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  };
  
  // Apply CORS middleware directly to the express app
  expressApp.use(cors(corsOptions));
  
  // Alternatively, apply CORS to the NestJS app (if not using `app.enableCors()`)
  app.use(cors(corsOptions));
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

