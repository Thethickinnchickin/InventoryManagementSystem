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

// Apply CORS and middleware to Express instance
expressApp.use(cors(corsOptions));
expressApp.options('*', cors(corsOptions));
expressApp.set('trust proxy', 1);
expressApp.use(cookieParser());

async function bootstrap() {
  // Create Nest app with Express adapter
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Apply middleware to Nest app
  app.use(cors(corsOptions));
  app.use(cookieParser());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Inventory Management API')
    .setDescription('API documentation for the Inventory Management system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Initialize app and start server on Railway-assigned port
  await app.init();
  const port = process.env.PORT || 3000;
  await expressApp.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

bootstrap();
