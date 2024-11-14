import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import axios, { AxiosInstance } from 'axios';
import { Agent } from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

const httpAgent = new Agent({ keepAlive: true, timeout: 30000 });
bootstrap().then((res: any) => {
  console.log(res);
  const instance: AxiosInstance = axios.create({
    httpAgent,
  });
  instance
    .get('http://localhost:3000')
    .then(() => {
      //console.log(res);
    })
    .catch((error: any) => {
      console.log(error);
    });
  console.log('init success');
});
