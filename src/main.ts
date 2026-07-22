import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SuccessHandler } from './common/interceptors/successHandler.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  )
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalInterceptors(new SuccessHandler())
  await app.listen(process.env.PORT || 4000, '0.0.0.0');
}
bootstrap();
