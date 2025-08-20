import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockDoc = {
  get: jest.fn(),
  set: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  data: jest.fn(),
  exists: false,
};

const mockCollection = {
  doc: jest.fn(() => mockDoc),
  get: jest.fn(),
  add: jest.fn(),
};

const mockDb = {
  collection: jest.fn(() => mockCollection),
};

jest.mock('firebase-admin', () => ({
  apps: { length: 0 },
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  firestore: jest.fn(() => mockDb),
}));

jest.mock('./firebase-service-account.json', () => ({
  type: 'service_account',
  project_id: 'test-project',
}));

import { FootballDataService } from './football-data.service';

describe('FootballDataService', () => {
  let service: FootballDataService;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockDoc.exists = false;
    mockDoc.get.mockReset();
    mockDoc.set.mockReset();
    mockDoc.update.mockReset();
    mockDoc.delete.mockReset();
    mockDoc.data.mockReset();

    mockCollection.doc.mockReturnValue(mockDoc);
    mockCollection.get.mockReset();
    mockCollection.add.mockReset();

    mockDb.collection.mockReturnValue(mockCollection);

    const module: TestingModule = await Test.createTestingModule({
      providers: [FootballDataService],
    }).compile();

    service = module.get<FootballDataService>(FootballDataService);
  });

  describe('getLeagues', () => {
    it('should return formatted leagues', async () => {
      const mockResponse = {
        data: {
          competitions: [
            { id: 1, name: 'Premier League', area: { name: 'England' } },
            { id: 2, name: 'La Liga', area: { name: 'Spain' } },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.getLeagues();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.football-data.org/v4/competitions',
        {
          headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY },
        },
      );

      expect(result).toEqual([
        { id: 1, name: 'Premier League', area: 'England' },
        { id: 2, name: 'La Liga', area: 'Spain' },
      ]);
    });
  });

  describe('getTeams', () => {
    it('should return cached data if exists', async () => {
      const cachedData = { teams: [{ id: 1, name: 'Arsenal' }] };

      mockDoc.exists = true;
      mockDoc.data.mockReturnValue(cachedData);
      mockDoc.get.mockResolvedValue(mockDoc);

      const result = await service.getTeams('39');

      expect(mockDb.collection).toHaveBeenCalledWith('teams');
      expect(mockCollection.doc).toHaveBeenCalledWith('39');
      expect(result).toEqual(cachedData);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should fetch from API and cache if no cached data', async () => {
      const apiResponse = {
        data: { teams: [{ id: 1, name: 'Arsenal' }] },
      };

      mockDoc.exists = false;
      mockDoc.get.mockResolvedValue(mockDoc);
      mockedAxios.get.mockResolvedValue(apiResponse);

      const result = await service.getTeams('39');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.football-data.org/v4/competitions/39/teams',
        {
          headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY },
        },
      );
      expect(mockDoc.set).toHaveBeenCalledWith(apiResponse.data);
      expect(result).toEqual(apiResponse.data);
    });
  });

  describe('getPlayersByPositions', () => {
    it('should return filtered players from cache', async () => {
      const cachedSquad = [
        { name: 'Player1', position: 'Goalkeeper' },
        { name: 'Player2', position: 'Defender' },
        { name: 'Player3', position: 'Midfielder' },
      ];

      mockDoc.exists = true;
      mockDoc.data.mockReturnValue({ squad: cachedSquad });
      mockDoc.get.mockResolvedValue(mockDoc);

      const result = await service.getPlayersByPositions('1', ['Goalkeeper', 'Defender']);

      expect(mockDb.collection).toHaveBeenCalledWith('players');
      expect(mockCollection.doc).toHaveBeenCalledWith('1');
      expect(result).toEqual([
        { name: 'Player1', position: 'Goalkeeper' },
        { name: 'Player2', position: 'Defender' },
      ]);
    });

    it('should fetch from API if no cache and filter players', async () => {
      const apiResponse = {
        data: {
          squad: [
            { name: 'Player1', position: 'Goalkeeper' },
            { name: 'Player2', position: 'Defender' },
          ],
        },
      };

      mockDoc.exists = false;
      mockDoc.get.mockResolvedValue(mockDoc);
      mockedAxios.get.mockResolvedValue(apiResponse);

      const result = await service.getPlayersByPositions('1', ['Goalkeeper']);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.football-data.org/v4/teams/1',
        {
          headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY },
        },
      );
      expect(result).toEqual([{ name: 'Player1', position: 'Goalkeeper' }]);
    });
  });

  describe('saveTeam', () => {
    it('should save team to Firestore', async () => {
      const teamData = [{ name: 'Player1' }, { name: 'Player2' }];

      const mockTeamsCollection = {
        add: jest.fn().mockResolvedValue({ id: 'team123' }),
      };

      const mockUserDoc = {
        collection: jest.fn().mockReturnValue(mockTeamsCollection),
      };

      mockCollection.doc.mockReturnValue(mockUserDoc as any);

      const result = await service.saveTeam('user1', 'Mon Équipe', '4-4-2', teamData);

      expect(mockDb.collection).toHaveBeenCalledWith('users');
      expect(mockCollection.doc).toHaveBeenCalledWith('user1');
      expect(mockUserDoc.collection).toHaveBeenCalledWith('teams');
      expect(result).toEqual({ success: true });
    });
  });

  describe('getTeamsSaved', () => {
    it('should return user teams', async () => {
      const mockSnapshot = {
        docs: [
          { id: 'team1', data: () => ({ name: 'Équipe 1' }) },
          { id: 'team2', data: () => ({ name: 'Équipe 2' }) },
        ],
      };

      const mockTeamsCollection = {
        get: jest.fn().mockResolvedValue(mockSnapshot),
      };

      const mockUserDoc = {
        collection: jest.fn().mockReturnValue(mockTeamsCollection),
      };

      mockCollection.doc.mockReturnValue(mockUserDoc as any);

      const result = await service.getTeamsSaved('user1');

      expect(mockDb.collection).toHaveBeenCalledWith('users');
      expect(mockCollection.doc).toHaveBeenCalledWith('user1');
      expect(mockUserDoc.collection).toHaveBeenCalledWith('teams');
      expect(result).toEqual([
        { id: 'team1', name: 'Équipe 1' },
        { id: 'team2', name: 'Équipe 2' },
      ]);
    });
  });

  describe('renameTeam', () => {
    it('should update team name', async () => {
      const mockTeamDoc = { update: jest.fn().mockResolvedValue({}) };
      const mockTeamsCollection = {
        doc: jest.fn().mockReturnValue(mockTeamDoc),
      };

      const mockUserDoc = {
        collection: jest.fn().mockReturnValue(mockTeamsCollection),
      };

      mockCollection.doc.mockReturnValue(mockUserDoc as any);

      await service.renameTeam('user1', 'team1', 'Nouveau Nom');

      expect(mockDb.collection).toHaveBeenCalledWith('users');
      expect(mockCollection.doc).toHaveBeenCalledWith('user1');
      expect(mockUserDoc.collection).toHaveBeenCalledWith('teams');
      expect(mockTeamsCollection.doc).toHaveBeenCalledWith('team1');
      expect(mockTeamDoc.update).toHaveBeenCalledWith({ name: 'Nouveau Nom' });
    });
  });

  describe('deleteTeam', () => {
    it('should delete team', async () => {
      const mockTeamDoc = { delete: jest.fn().mockResolvedValue({}) };
      const mockTeamsCollection = {
        doc: jest.fn().mockReturnValue(mockTeamDoc),
      };

      const mockUserDoc = {
        collection: jest.fn().mockReturnValue(mockTeamsCollection),
      };

      mockCollection.doc.mockReturnValue(mockUserDoc as any);

      await service.deleteTeam('user1', 'team1');

      expect(mockDb.collection).toHaveBeenCalledWith('users');
      expect(mockCollection.doc).toHaveBeenCalledWith('user1');
      expect(mockUserDoc.collection).toHaveBeenCalledWith('teams');
      expect(mockTeamsCollection.doc).toHaveBeenCalledWith('team1');
      expect(mockTeamDoc.delete).toHaveBeenCalled();
    });
  });
});