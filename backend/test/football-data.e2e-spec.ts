import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { FootballDataService } from '../src/football-data.service';
import { FirebaseAuthGuard } from '../src/auth/firebase-auth.guard';

describe('FootballData (e2e)', () => {
  let app: INestApplication;
  let basePrefix = '';

  const mockService = {
    getLeagues: jest.fn().mockResolvedValue([{ id: 1, name: 'L1' }]),
    getTeams: jest.fn().mockResolvedValue({ teams: [] }),
    getPlayersByPositions: jest.fn().mockResolvedValue([{ name: 'Player1' }]),
    saveTeam: jest.fn().mockResolvedValue({ success: true }),
    getTeamsSaved: jest.fn().mockResolvedValue([]),
    renameTeam: jest.fn().mockResolvedValue(undefined),
    deleteTeam: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          req.user = { uid: 'user1' };
          return true;
        },
      })
      .overrideProvider(FootballDataService)
      .useValue(mockService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const candidates = [
      '/football',
      '/football-data',
      '/football',
      '/api/football-data',
      '/api/football',
      '/api',
      '',
    ];

    const tryPath = async (path: string) => {
      try {
        return await request(app.getHttpServer()).get(path).timeout({ deadline: 1000 });
      } catch (err: any) {
        return { status: err.status || (err.response && err.response.status) || 0, error: err };
      }
    };

    for (const p of candidates) {
      const prefix = p === '' ? '' : (p.startsWith('/') ? p : `/${p}`);
      const path = `${prefix}/leagues`.replace(/\/+/g, '/');
      // eslint-disable-next-line no-await-in-loop
      const res: any = await tryPath(path);
      const status = res && res.status ? res.status : (res && res.statusCode) ? res.statusCode : 0;
      if (status === 200) {
        basePrefix = prefix;
        break;
      }
    }

    if (!basePrefix) {
      const server = app.getHttpAdapter().getInstance() as any;
      const routes = (server._router?.stack || [])
        .filter((r: any) => r.route)
        .map((r: any) => Object.keys(r.route.methods).map((m: any) => `${m.toUpperCase()} ${r.route.path}`))
        .flat();
      console.error('Aucun préfixe trouvé pour /leagues. Routes montées:', routes);
    } else {
      console.log('Préfixe détecté pour football-data e2e tests:', basePrefix || '(root)');
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET leagues retourne les leagues (découverte automatique du préfixe)', async () => {
    const path = `${basePrefix}/leagues`.replace(/\/+/g, '/');
    const res = await request(app.getHttpServer()).get(path).expect(200);
    expect(res.body).toEqual([{ id: 1, name: 'L1' }]);
  });

  it('GET teams (avec query competitionId) appelle le service', async () => {
    const path = `${basePrefix}/teams?competitionId=39`.replace(/\/+/g, '/');
    const res = await request(app.getHttpServer()).get(path).expect(200);
    expect(mockService.getTeams).toHaveBeenCalledWith('39');
    expect(res.body).toEqual({ teams: [] });
  });

  it('POST save-team sauvegarde une équipe', async () => {
    const payload = { name: 'Mon Équipe', formation: '4-4-2', team: [] };
    const path = `${basePrefix}/save-team`.replace(/\/+/g, '/');
    await request(app.getHttpServer())
      .post(path)
      .send(payload)
      .expect(201)
      .expect({ success: true });
    expect(mockService.saveTeam).toHaveBeenCalled();
  });
});
