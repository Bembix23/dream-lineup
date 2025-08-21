import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FootballDataController } from './football-data.controller';
import { FootballDataService } from './football-data.service';
import { SecurityLoggerService } from './security-logger.service';

@Module({
  imports: [],
  controllers: [AppController, FootballDataController],
  providers: [AppService, FootballDataService, SecurityLoggerService],
})
export class AppModule {}
