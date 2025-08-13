import { Controller, Get, Query } from '@nestjs/common';
import { FootballDataService } from './football-data.service';

@Controller('football')
export class FootballDataController {
  constructor(private readonly footballDataService: FootballDataService) {}

  @Get('teams')
  async getTeams(@Query('competitionId') competitionId: string) {
    return this.footballDataService.getTeams(competitionId);
  }

  @Get('leagues')
  async getLeagues() {
    return this.footballDataService.getLeagues();
  }

  @Get('players-by-category')
  async getPlayersByCategory(
    @Query('teamId') teamId: string,
    @Query('positions') positions: string,
  ) {
    const positionsArray = positions.split(','); // Convertir la liste en tableau
    return this.footballDataService.getPlayersByPositions(teamId, positionsArray);
  }
}