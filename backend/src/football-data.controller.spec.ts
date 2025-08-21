import { Test, TestingModule } from '@nestjs/testing';
import { FootballDataController } from './football-data.controller';
import { FootballDataService } from './football-data.service';
import { SecurityLoggerService } from './security-logger.service';

const mockFootballDataService = {
  getLeagues: jest.fn().mockResolvedValue([{ id: 1, name: 'Test League' }]),
  getTeams: jest.fn().mockResolvedValue([{ id: 1, name: 'Test Team' }]),
  getPlayersByPositions: jest.fn().mockResolvedValue([{ id: 1, name: 'Test Player' }]),
  saveTeam: jest.fn().mockResolvedValue({ success: true }),
  getTeamsSaved: jest.fn().mockResolvedValue([]),
  renameTeam: jest.fn().mockResolvedValue(undefined),
  deleteTeam: jest.fn().mockResolvedValue(undefined),
};

const mockSecurityLogger = {
  logAuthAttempt: jest.fn(),
  logSuspiciousActivity: jest.fn(),
  logRateLimitHit: jest.fn(),
  logDataAccess: jest.fn(),
  logSecurityEvent: jest.fn(),
};

describe('FootballDataController', () => {
  let controller: FootballDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FootballDataController],
      providers: [
        { provide: FootballDataService, useValue: mockFootballDataService },
        { provide: SecurityLoggerService, useValue: mockSecurityLogger },
      ],
    }).compile();

    controller = module.get<FootballDataController>(FootballDataController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get leagues', async () => {
    const res = await controller.getLeagues();
    expect(res).toEqual([{ id: 1, name: 'Test League' }]);
    expect(mockFootballDataService.getLeagues).toHaveBeenCalled();
  });

  it('should get teams with DTO', async () => {
    const getTeamsDto = { competitionId: '123' };
    const res = await controller.getTeams(getTeamsDto);
    expect(res).toEqual([{ id: 1, name: 'Test Team' }]);
    expect(mockFootballDataService.getTeams).toHaveBeenCalledWith('123');
  });

  it('should get players by positions with DTO', async () => {
    const getPlayersDto = { teamId: '456', positions: ['Forward', 'Midfielder'] };
    const res = await controller.getPlayersByPositions(getPlayersDto);
    expect(res).toEqual([{ id: 1, name: 'Test Player' }]);
    expect(mockFootballDataService.getPlayersByPositions).toHaveBeenCalledWith('456', ['Forward', 'Midfielder']);
  });

  it('should save team with authentication', async () => {
    const req = { user: { uid: 'user123' } };
    const saveTeamDto = {
      name: 'Test Team',
      formation: '4-4-2',
      team: [null, null, null, null, null, null, null, null, null, null, null]
    };

    const res = await controller.saveTeam(req, saveTeamDto);
    expect(res).toEqual({ success: true });
    expect(mockSecurityLogger.logDataAccess).toHaveBeenCalledWith('user123', 'team', 'SAVE');
    expect(mockFootballDataService.saveTeam).toHaveBeenCalledWith(
      'user123',
      'Test Team',
      '4-4-2',
      [null, null, null, null, null, null, null, null, null, null, null]
    );
  });

  it('should get saved teams with authentication', async () => {
    const req = { user: { uid: 'user123' } };
    const res = await controller.getTeamsSaved(req);
    expect(res).toEqual([]);
    expect(mockSecurityLogger.logDataAccess).toHaveBeenCalledWith('user123', 'teams', 'READ');
    expect(mockFootballDataService.getTeamsSaved).toHaveBeenCalledWith('user123');
  });

  it('should rename team with authentication', async () => {
    const req = { user: { uid: 'user123' } };
    const renameTeamDto = { teamId: 'team456', newName: 'New Team Name' };

    const res = await controller.renameTeam(req, renameTeamDto);
    expect(res).toEqual({ success: true });
    expect(mockSecurityLogger.logDataAccess).toHaveBeenCalledWith('user123', 'team:team456', 'RENAME');
    expect(mockFootballDataService.renameTeam).toHaveBeenCalledWith('user123', 'team456', 'New Team Name');
  });

  it('should delete team with authentication', async () => {
    const req = { user: { uid: 'user123' } };
    const deleteTeamDto = { teamId: 'team456' };

    const res = await controller.deleteTeam(req, deleteTeamDto);
    expect(res).toEqual({ success: true });
    expect(mockSecurityLogger.logDataAccess).toHaveBeenCalledWith('user123', 'team:team456', 'DELETE');
    expect(mockFootballDataService.deleteTeam).toHaveBeenCalledWith('user123', 'team456');
  });
});