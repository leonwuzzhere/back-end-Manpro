import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Izinkan akses dari frontend (misal localhost:5173 atau domain lain)
  app.enableCors({
    origin: '*', // ganti '*' dengan domain frontend kamu kalau sudah fix
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // ✅ Aktifkan validasi global (biar otomatis cek DTO)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server running on http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
