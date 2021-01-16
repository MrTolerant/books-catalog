import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const NODE_PORT = process.env['NODE_PORT'] || 3000;
const REDIRECT_PORT = process.env['REDIRECT_PORT'] || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(NODE_PORT);
  console.log('App started at',`http://localhost:${REDIRECT_PORT}`);
}
bootstrap();
