import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "nestjs-prisma";
import { Prisma } from "@prisma/client";

describe("UserService", () => {
  let service: UsersService;
  let prisma: PrismaService;

  const savedUser1 = {
    id: new Prisma.Decimal(1),
    name: "Test Numone",
    email: "numone@test.com"
  };
  const savedUser2 = {
    id: new Prisma.Decimal(2),
    name: "Test Numtwo",
    email: "numtwo@test.com"
  };
  const oneUser = {
    id: 1,
    name: "Test Numone",
    email: "numone@test.com"
  };
  const updateUser = {
    id: 1,
    name: "Test Numone update",
    email: "numoneupdate@test.com"
  };
  const updatedUser = {
    id: new Prisma.Decimal(1),
    name: "Test Numone update",
    email: "numoneupdate@test.com"
  };

  const twoUser = {
    id: 2,
    name: "Test Numtwo",
    email: "numtwo@test.com"
  };

  const threeUser = {
    id: 3,
    name: "Test Numthree",
    email: "numthree@test.com"
  };

  const userArray = [oneUser, twoUser];
  const savedUserArray = [savedUser1, savedUser2];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            users: {
              findMany: jest.fn().mockResolvedValue(savedUserArray),
              findUnique: jest.fn().mockResolvedValue(savedUser1),
              create: jest.fn().mockResolvedValue(savedUser1),
              update: jest.fn().mockResolvedValue(updatedUser),
              delete: jest.fn().mockResolvedValue(true),
              count: jest.fn()
            }
          }
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createOne", () => {
    it("should successfully add a user", () => {
      expect(service.create(oneUser)).resolves.toEqual(oneUser);
      expect(prisma.users.create).toBeCalledTimes(1);
    });
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const users = await service.findAll();
      expect(users).toEqual(userArray);
    });
  });

  describe("findOne", () => {
    it("should get a single user", () => {
      expect(service.findOne(1)).resolves.toEqual(oneUser);
    });
  });

  describe("update", () => {
    it("should call the update method", async () => {
      const user = await service.update(1, updateUser);
      expect(user).toEqual(updateUser);
      expect(prisma.users.update).toBeCalledTimes(1);
    });
  });

  describe("remove", () => {
    it("should return {deleted: true}", () => {
      expect(service.remove(2)).resolves.toEqual({ deleted: true });
    });
    it("should return {deleted: false, message: err.message}", () => {
      const repoSpy = jest
        .spyOn(prisma.users, "delete")
        .mockRejectedValueOnce(new Error("Bad Delete Method."));
      expect(service.remove(-1)).resolves.toEqual({
        deleted: false,
        message: "Bad Delete Method."
      });
      expect(repoSpy).toBeCalledTimes(1);
    });
  });

  describe("searchUsers", () => {
    it("should return a list of users with pagination and filtering", async () => {
      const page = 1;
      const limit = 10;
      const sortObject: Prisma.SortOrder = "asc";
      const sort: any = `[{ "name": "${sortObject}" }]`;
      const filter: any =
        "[{ \"name\": { \"equals\": \"Peter\" } }]";

      jest.spyOn(prisma.users, "findMany")
        .mockResolvedValue([]);
      jest.spyOn(prisma.users, "count")
        .mockResolvedValue(0);
      const result = await service.searchUsers(page, limit, sort, filter);

      expect(result).toEqual({
        users: [],
        page,
        limit,
        total: 0,
        totalPages: 0
      });
    });

    it("given no page should return a list of users with pagination and filtering with default page 1", async () => {
      const limit = 10;
      const sortObject: Prisma.SortOrder = "asc";
      const sort: any = `[{ "name": "${sortObject}" }]`;
      const filter: any =
        "[{ \"name\": { \"equals\": \"Peter\" } }]";

      jest.spyOn(prisma.users, "findMany")
        .mockResolvedValue([]);
      jest.spyOn(prisma.users, "count")
        .mockResolvedValue(0);
      const result = await service.searchUsers(null, limit, sort, filter);

      expect(result).toEqual({
        users: [],
        page: 1,
        limit,
        total: 0,
        totalPages: 0
      });
    });
    it("given no limit should return a list of users with pagination and filtering with default limit 10", async () => {
      const page = 1;
      const sortObject: Prisma.SortOrder = "asc";
      const sort: any = `[{ "name": "${sortObject}" }]`;
      const filter: any =
        "[{ \"name\": { \"equals\": \"Peter\" } }]";

      jest.spyOn(prisma.users, "findMany")
        .mockResolvedValue([]);
      jest.spyOn(prisma.users, "count")
        .mockResolvedValue(0);
      const result = await service.searchUsers(page, null, sort, filter);

      expect(result).toEqual({
        users: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      });
    });

    it("given  limit greater than 200 should return a list of users with pagination and filtering with default limit 10", async () => {
      const page = 1;
      const limit = 201;
      const sortObject: Prisma.SortOrder = "asc";
      const sort: any = `[{ "name": "${sortObject}" }]`;
      const filter: any =
        "[{ \"name\": { \"equals\": \"Peter\" } }]";

      jest.spyOn(prisma.users, "findMany")
        .mockResolvedValue([]);
      jest.spyOn(prisma.users, "count")
        .mockResolvedValue(0);
      const result = await service.searchUsers(page, limit, sort, filter);

      expect(result).toEqual({
        users: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      });
    });
    it("given  invalid JSON should throw error", async () => {
      const page = 1;
      const limit = 201;
      const sortObject: Prisma.SortOrder = "asc";
      const sort: any = `[{ "name" "${sortObject}" }]`;
      const filter: any =
        "[{ \"name\": { \"equals\": \"Peter\" } }]";
      try {
        await service.searchUsers(page, limit, sort, filter);
      } catch (e) {
        expect(e).toEqual(new Error("Invalid query parameters"));
      }
    });
  });
  describe("convertFiltersToPrismaFormat", () => {
    it("should convert input filters to prisma's filter format", () => {
      const inputFilter = [
        { key: 'a', operation: 'like', value: '1' },
        { key: 'b', operation: 'eq', value: '2' },
        { key: 'c', operation: 'neq', value: '3' },
        { key: 'd', operation: 'gt', value: '4' },
        { key: 'e', operation: 'gte', value: '5' },
        { key: 'f', operation: 'lt', value: '6' },
        { key: 'g', operation: 'lte', value: '7' },
        { key: 'h', operation: 'in', value: ['8'] },
        { key: 'i', operation: 'notin', value: ['9'] },
        { key: 'j', operation: 'isnull', value: '10' }
      ];

      const expectedOutput = {
        'a': { contains: '1' },
        'b': { equals: '2' },
        'c': { not: { equals: '3' } },
        'd': { gt: '4' },
        'e': { gte: '5' },
        'f': { lt: '6' },
        'g': { lte: '7' },
        'h': { in: ['8'] },
        'i': { not: { in: ['9'] } },
        'j': { equals: null }
      };

      expect(service.convertFiltersToPrismaFormat(inputFilter))
        .toStrictEqual(expectedOutput);
    });
  });
});
