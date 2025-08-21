import { Controller, Get, Post, Query, Body, UseGuards, Request } from '@nestjs/common';
import { FootballDataService } from './football-data.service';
import { FirebaseAuthGuard } from './auth/firebase-auth.guard';
import { SecurityLoggerService } from './security-logger.service';
import { SaveTeamDto } from './dto/save-team.dto';
import { RenameTeamDto } from './dto/rename-team.dto';
import { DeleteTeamDto } from './dto/delete-team.dto';
import { GetTeamsDto } from './dto/get-teams.dto';
import { GetPlayersDto } from './dto/get-players.dto';

@Controller('football')
export class FootballDataController {
  constructor(
    private readonly footballDataService: FootballDataService,
    private readonly securityLogger: SecurityLoggerService
  ) {}

  @Get('leagues')
  async getLeagues() {
    return this.footballDataService.getLeagues();
  }

  @Get('teams')
  async getTeams(@Query() getTeamsDto: GetTeamsDto) {
    return this.footballDataService.getTeams(getTeamsDto.competitionId);
  }

  @Get('players-by-category')
  async getPlayersByPositions(@Query() getPlayersDto: GetPlayersDto) {
    return this.footballDataService.getPlayersByPositions(
      getPlayersDto.teamId,
      getPlayersDto.positions
    );
  }

  @Post('save-team')
  @UseGuards(FirebaseAuthGuard)
  async saveTeam(@Request() req, @Body() saveTeamDto: SaveTeamDto) {
    const userId = req.user.uid;
    this.securityLogger.logDataAccess(userId, 'team', 'SAVE');
    return this.footballDataService.saveTeam(
      userId,
      saveTeamDto.name,
      saveTeamDto.formation,
      saveTeamDto.team
    );
  }

  @Get('teams-saved')
  @UseGuards(FirebaseAuthGuard)
  async getTeamsSaved(@Request() req) {
    const userId = req.user.uid;
    this.securityLogger.logDataAccess(userId, 'teams', 'READ');
    const result = await this.footballDataService.getTeamsSaved(userId);
    return Array.isArray(result) ? result : [];
  }

  @Post('rename-team')
  @UseGuards(FirebaseAuthGuard)
  async renameTeam(@Request() req, @Body() renameTeamDto: RenameTeamDto) {
    const userId = req.user.uid;
    this.securityLogger.logDataAccess(userId, `team:${renameTeamDto.teamId}`, 'RENAME');
    await this.footballDataService.renameTeam(
      userId,
      renameTeamDto.teamId,
      renameTeamDto.newName
    );
    return { success: true };
  }

  @Post('delete-team')
  @UseGuards(FirebaseAuthGuard)
  async deleteTeam(@Request() req, @Body() deleteTeamDto: DeleteTeamDto) {
    const userId = req.user.uid;
    this.securityLogger.logDataAccess(userId, `team:${deleteTeamDto.teamId}`, 'DELETE');
    await this.footballDataService.deleteTeam(userId, deleteTeamDto.teamId);
    return { success: true };
  }
}