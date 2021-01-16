import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const NODE_PORT = process.env['NODE_PORT'] || 3000;
const HOST_PORT = process.env['HOST_PORT'] || NODE_PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(NODE_PORT);
  console.log('App started at',`http://localhost:${HOST_PORT}`);
}
bootstrap();
