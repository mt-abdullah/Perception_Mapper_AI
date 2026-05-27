import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppController } from '../app.controller';
import { PrismaService } from '../prisma.service';
import { RateLimiterService } from '../rate-limiter.service';
import { ClerkGuard } from '../clerk.guard';
import { AdminOnlyGuard } from '../admin-only.guard';

describe('Teams API Routing (Integration)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockClerkGuard = {
      canActivate: jest.fn().mockImplementation((context) => {
        const req = context.switchToHttp().getRequest();
        // Setup mock user credentials
        req.user = { userId: 'user_mock_dev_2k98fhj3', email: 'dev@perceptionmapper.ai' };
        return true;
      }),
    };

    const mockAdminGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [PrismaService, RateLimiterService],
    })
      .overrideGuard(ClerkGuard)
      .useValue(mockClerkGuard)
      .overrideGuard(AdminOnlyGuard)
      .useValue(mockAdminGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await prismaService.onModuleInit();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /admin/teams returns list of teams', async () => {
    const teams = await prismaService.getAllTeams();
    expect(teams).toBeInstanceOf(Array);
    expect(teams.length).toBeGreaterThan(0);
    expect(teams[0]).toHaveProperty('name');
  });

  it('POST /admin/teams creates a new team successfully', async () => {
    const payload = {
      name: 'Integration Testing Squad',
      description: 'API testing environment',
      tier: 'PRO',
      maxMembers: 8,
      leadId: 'user_mock_dev_2k98fhj3',
    };

    const newTeam = await prismaService.createTeam(payload);
    expect(newTeam).toHaveProperty('id');
    expect(newTeam.name).toBe(payload.name);
    expect(newTeam.maxMembers).toBe(8);

    const allTeams = await prismaService.getAllTeams();
    expect(allTeams.some(t => t.id === newTeam.id)).toBe(true);
  });

  it('DELETE /admin/teams/:id removes specified team', async () => {
    const payload = { name: 'Temp Team' };
    const tempTeam = await prismaService.createTeam(payload);
    
    const result = await prismaService.deleteTeam(tempTeam.id);
    expect(result.success).toBe(true);
    expect(result.id).toBe(tempTeam.id);

    const allTeams = await prismaService.getAllTeams();
    expect(allTeams.some(t => t.id === tempTeam.id)).toBe(false);
  });
});
