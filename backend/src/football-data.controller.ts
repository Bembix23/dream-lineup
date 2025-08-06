import { Controller, Get, Query } from '@nestjs/common';
import { FootballDataService } from './football-data.service';

@Controller('football')
export class FootballDataController {
  constructor(private readonly footballDataService: FootballDataService) {}

  @Get('teams')
  async getTeams(@Query('competitionId') competitionId: string) {
    return this.footballDataService.getTeams(competitionId);
  }

  @Get('players-by-position')
  async getPlayersByPosition(
    @Query('teamId') teamId: string,
    @Query('position') position: string
  ) {
    return this.footballDataService.getPlayersByPosition(teamId, position);
  }

  @Get('leagues')
  async getLeagues() {
    return this.footballDataService.getLeagues();
  }
}