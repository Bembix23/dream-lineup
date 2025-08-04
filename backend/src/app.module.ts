import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FootballDataService } from './football-data.service';
import { FootballDataController } from './football-data.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, FootballDataController],
  providers: [AppService, FootballDataService],
})
export class AppModule {}
