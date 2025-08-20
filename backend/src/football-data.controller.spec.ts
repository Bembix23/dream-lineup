import { Test, TestingModule } from '@nestjs/testing';
import { FootballDataController } from './football-data.controller';
import { FootballDataService } from './football-data.service';

const mockService = {
  getLeagues: jest.fn(),
  getTeams: jest.fn(),
  getPlayersByPositions: jest.fn(),
  saveTeam: jest.fn(),
  getTeamsSaved: jest.fn(),
  renameTeam: jest.fn(),
  deleteTeam: jest.fn(),
};

describe('FootballDataController', () => {
  let controller: FootballDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FootballDataController],
      providers: [{ provide: FootballDataService, useValue: mockService }],
    }).compile();

    controller = module.get<FootballDataController>(FootballDataController);
    jest.clearAllMocks();
  });

  it('getLeagues appelle le service et retourne les leagues', async () => {
    mockService.getLeagues.mockResolvedValue([{ id: 1, name: 'L1' }]);
    const res = await controller.getLeagues();
    expect(mockService.getLeagues).toHaveBeenCalled();
    expect(res).toEqual([{ id: 1, name: 'L1' }]);
  });

  it('getTeams passe competitionId au service', async () => {
    mockService.getTeams.mockResolvedValue({ teams: [] });
    const competitionId = '39';
    const res = await controller.getTeams(competitionId);
    expect(mockService.getTeams).toHaveBeenCalledWith(competitionId);
    expect(res).toEqual({ teams: [] });
  });

  it('getPlayersByCategory split positions et appelle le service', async () => {
    mockService.getPlayersByPositions.mockResolvedValue([{ name: 'Player1' }]);
    const teamId = '1';
    const positions = 'Goalkeeper,Defender';
    const res = await controller.getPlayersByCategory(teamId, positions);
    expect(mockService.getPlayersByPositions).toHaveBeenCalledWith(teamId, ['Goalkeeper', 'Defender']);
    expect(res).toEqual([{ name: 'Player1' }]);
  });

  it('saveTeam récupère userId depuis req et appelle saveTeam', async () => {
    const body = { name: 'Mon Équipe', formation: '4-4-2', team: [{ name: 'P1' }] };
    const req = { user: { uid: 'user1' } } as any;
    mockService.saveTeam.mockResolvedValue({ success: true });
    const res = await controller.saveTeam(body, req);
    expect(mockService.saveTeam).toHaveBeenCalledWith('user1', body.name, body.formation, body.team);
    expect(res).toEqual({ success: true });
  });

  it('getTeamsSaved appelle le service avec userId', async () => {
    mockService.getTeamsSaved.mockResolvedValue([{ id: 't1', name: 'E1' }]);
    const res = await controller.getTeamsSaved('user1');
    expect(mockService.getTeamsSaved).toHaveBeenCalledWith('user1');
    expect(res).toEqual([{ id: 't1', name: 'E1' }]);
  });

  it('renameTeam utilise userId depuis req et retourne success', async () => {
    const body = { teamId: 'team1', newName: 'Nouveau' };
    const req = { user: { uid: 'user1' } } as any;
    mockService.renameTeam.mockResolvedValue(undefined);
    const res = await controller.renameTeam(body, req);
    expect(mockService.renameTeam).toHaveBeenCalledWith('user1', body.teamId, body.newName);
    expect(res).toEqual({ success: true });
  });

  it('deleteTeam utilise userId depuis req et retourne success', async () => {
    const body = { teamId: 'team1' };
    const req = { user: { uid: 'user1' } } as any;
    mockService.deleteTeam.mockResolvedValue(undefined);
    const res = await controller.deleteTeam(body, req);
    expect(mockService.deleteTeam).toHaveBeenCalledWith('user1', body.teamId);
    expect(res).toEqual({ success: true });
  });
});