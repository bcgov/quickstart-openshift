import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "./prisma.service";
import { Logger } from "@nestjs/common";

describe("PrismaService", () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await service.$disconnect();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

});
