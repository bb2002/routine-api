import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initSentry(app);
  initSwagger(app);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT || 3000);
}

function initSentry(app: INestApplication) {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app: app as any }),
        new ProfilingIntegration(),
      ],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
    });

    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
  }
}

function initSwagger(app: INestApplication) {
  if (process.env.SWAGGER_SECRET) {
    const config = new DocumentBuilder()
      .setTitle('Routine API Documentation')
      .setDescription('API Documentation for the Routine API')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Token',
          name: 'authorization',
          description: 'Routine API 의 인증 토큰을 입력 해 주세요.',
          in: 'header',
        },
        'AccessToken',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    app.use(
      ['/docs', '/docs/*'],
      basicAuth({
        users: { routine: process.env.SWAGGER_SECRET },
        challenge: true,
      }),
    );
    SwaggerModule.setup('docs', app, document);
  }
}

bootstrap();
