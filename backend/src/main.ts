import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors';


const expressApp = express();

const corsOptions = {
  origin: "https://inventory-management-front.vercel.app",
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
};

expressApp.use(cors(corsOptions));         // ✅ apply CORS to expressApp
expressApp.use(cookieParser()); 

/**
 * The `bootstrap` function initializes and configures the NestJS application.
 * It sets up CORS, cookie parsing, Swagger documentation, and prepares the app
 * for serverless deployment or local execution.
 */
async function bootstrap() {
  // Create a NestJS application with an Express adapter
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

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



const serverReady = bootstrap().then(() => expressApp);

export default async function handler(req, res) {
  const app = await serverReady;
  return app(req, res); // This lets Vercel use the Express app as a handler
}
