import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { initFirebaseFromEnv } from './firebase-init';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  try {
    initFirebaseFromEnv();
    console.log('🚀 Firebase prêt pour authentification');
  } catch (error) {
    console.error('💥 Erreur initialisation Firebase:', error.message);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Trop de requêtes, réessayez plus tard',
    standardHeaders: true,
    legacyHeaders: false,
  }));

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Trop de tentatives d\'authentification', retryAfter: '15 minutes' },
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const dataLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { error: 'Trop d\'accès aux données', retryAfter: '15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/football/save-team', authLimiter);
  app.use('/football/rename-team', authLimiter); 
  app.use('/football/delete-team', authLimiter);
  app.use('/football/teams-saved', dataLimiter);

  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://ton-domaine-prod.com'] 
      : ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages: process.env.NODE_ENV === 'production',
  }));

  await app.listen(process.env.PORT || 4000);
  console.log('🔒 Application sécurisée démarrée sur le port', process.env.PORT || 4000);
}
bootstrap();
