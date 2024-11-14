import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionModule } from './connection/connection.module';
import { ConnectionService } from './connection/connection.service';

@Module({
  imports: [ConnectionModule],
  controllers: [AppController],
  providers: [AppService, ConnectionService],
})
export class AppModule {}
