import { Test, TestingModule } from '@nestjs/testing';
import { FootballDataService } from './football-data.service';

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: { cert: jest.fn() },
  firestore: jest.fn(),
  apps: [],
}));

global.fetch = jest.fn();

describe('FootballDataService', () => {
  let service: FootballDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FootballDataService],
    }).compile();

    service = module.get<FootballDataService>(FootballDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have getLeagues method', () => {
    expect(typeof service.getLeagues).toBe('function');
  });

  it('should have getTeams method', () => {
    expect(typeof service.getTeams).toBe('function');
  });

  it('should have getPlayersByPositions method', () => {
    expect(typeof service.getPlayersByPositions).toBe('function');
  });

  it('should have saveTeam method', () => {
    expect(typeof service.saveTeam).toBe('function');
  });

  it('should have getTeamsSaved method', () => {
    expect(typeof service.getTeamsSaved).toBe('function');
  });

  it('should have renameTeam method', () => {
    expect(typeof service.renameTeam).toBe('function');
  });

  it('should have deleteTeam method', () => {
    expect(typeof service.deleteTeam).toBe('function');
  });
});