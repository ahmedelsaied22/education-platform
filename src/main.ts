import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SuccessHandler } from './common/interceptors/successHandler.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception/global-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new SuccessHandler());

  const config = new DocumentBuilder()
    .setTitle('Education-Platform')
    .setDescription('API documentation for Education-Platform project')
    .setVersion('1.0')
    .addTag('swagger')
    // .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT || 4001, '0.0.0.0');
}

bootstrap();
