import { Controller, Get, Query, Post, Body, Request, UseGuards } from '@nestjs/common';
import { FootballDataService } from './football-data.service';
import { FirebaseAuthGuard } from './auth/firebase-auth.guard';

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

  @Post('save-team')
  @UseGuards(FirebaseAuthGuard)
  async saveTeam(@Body() body: any, @Request() req) {
    const userId = req.user.uid;
    const { name, formation, team } = body;
    return this.footballDataService.saveTeam(userId, name, formation, team);
  }

  @Get('teams-saved')
  async getTeamsSaved(@Query('userId') userId: string) {
    return this.footballDataService.getTeamsSaved(userId);
  }

  @Post('rename-team')
  @UseGuards(FirebaseAuthGuard)
  async renameTeam(@Body() body: any, @Request() req) {
    const userId = req.user.uid;
    const { teamId, newName } = body;
    await this.footballDataService.renameTeam(userId, teamId, newName);
    return { success: true };
  }

  @Post('delete-team')
  @UseGuards(FirebaseAuthGuard)
  async deleteTeam(@Body() body: any, @Request() req) {
    const userId = req.user.uid;
    const { teamId } = body;
    await this.footballDataService.deleteTeam(userId, teamId);
    return { success: true };
  }
}