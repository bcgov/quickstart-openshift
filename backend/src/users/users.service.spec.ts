import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { UsersService } from "./users.service";
import { Users } from "./entities/users.entity";

describe("UserService", () => {
  let service: UsersService;
  let repo: Repository<Users>;

  const oneUserName = "Test Numone";
  const oneUserEamil = "numone@test.com";
  const oneUser = new Users(oneUserName, oneUserEamil);
  const updateUser = {
    name: oneUserName,
    email: oneUserEamil,
  };

  const twoUser = new Users("Test Numtwo", "numtwo@test.com");

  const threeUserName = "Test Numthree";
  const threeUserEamil = "numthree@test.com";
  const newUser = {
    name: threeUserName,
    email: threeUserEamil,
  };
  const threeUser = new Users(threeUserName, threeUserEamil);

  const userArray = [oneUser, twoUser];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: {
            // mock repository functions for testing
            find: jest.fn().mockResolvedValue(userArray),
            findOne: jest.fn().mockResolvedValue(oneUser),
            create: jest.fn().mockReturnValue(threeUser),
            save: jest.fn(),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            update: jest.fn().mockResolvedValue(true),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            delete: jest.fn().mockResolvedValue(true),
            createQueryBuilder: jest.fn(),
            getManyAndCount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createOne", () => {
    it("should successfully add a user", () => {
      expect(service.create(newUser)).resolves.toEqual(threeUser);
      expect(repo.create).toBeCalledTimes(1);
      expect(repo.create).toBeCalledWith(newUser);
      expect(repo.save).toBeCalledTimes(1);
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
      const repoSpy = jest.spyOn(repo, "findOne");
      expect(service.findOne(1)).resolves.toEqual(oneUser);
      expect(repoSpy).toBeCalledWith({ where: { id: 1 } });
    });
  });

  describe("update", () => {
    it("should call the update method", async () => {
      const user = await service.update(1, updateUser);
      expect(user).toEqual(oneUser);
      expect(repo.update).toBeCalledTimes(1);
      expect(repo.update).toBeCalledWith({ id: 1 }, updateUser);
    });
  });

  describe("remove", () => {
    it("should return {deleted: true}", () => {
      expect(service.remove(2)).resolves.toEqual({ deleted: true });
    });
    it("should return {deleted: false, message: err.message}", () => {
      const repoSpy = jest
        .spyOn(repo, "delete")
        .mockRejectedValueOnce(new Error("Bad Delete Method."));
      expect(service.remove(-1)).resolves.toEqual({
        deleted: false,
        message: "Bad Delete Method.",
      });
      expect(repoSpy).toBeCalledWith(-1);
      expect(repoSpy).toBeCalledTimes(1);
    });
  });
  describe("searchUsers", () => {
    it("should return a list of users with pagination and filtering", async () => {
      const page = 1;
      const limit = 10;
      const sort: any = '{ "name": "ASC" }';
      const filter: any =
        '[{ "key": "name", "operation": "=", "value": "Peter" }]';
      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([[], 0]),
      };
      jest
        .spyOn(repo, "createQueryBuilder")
        .mockReturnValue(queryBuilder as any);

      const result = await service.searchUsers(page, limit, sort, filter);

      expect(repo.createQueryBuilder).toHaveBeenCalledWith("users");
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(queryBuilder.take).toHaveBeenCalledWith(limit);
      expect(queryBuilder.getManyAndCount).toHaveBeenCalled();
      expect(result).toEqual({
        users: [],
        page,
        limit,
        total: 0,
        totalPages: 0,
      });
    });

    it("given no page should return a list of users with pagination and filtering with default page 1", async () => {
      const limit = 10;
      const sort: any = '{ "name": "ASC" }';
      const filter: any =
        '[{ "key": "name", "operation": "=", "value": "Peter" }]';
      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([[], 0]),
      };
      jest
        .spyOn(repo, "createQueryBuilder")
        .mockReturnValue(queryBuilder as any);

      const result = await service.searchUsers(null, limit, sort, filter);

      expect(repo.createQueryBuilder).toHaveBeenCalledWith("users");
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(queryBuilder.take).toHaveBeenCalledWith(limit);
      expect(queryBuilder.getManyAndCount).toHaveBeenCalled();
      expect(result).toEqual({
        users: [],
        page: 1,
        limit,
        total: 0,
        totalPages: 0,
      });
    });
    it("given no limit should return a list of users with pagination and filtering with default limit 10", async () => {
      const page = 1;
      const sort: any = '{ "name": "ASC" }';
      const filter: any =
        '[{ "key": "name", "operation": "=", "value": "Peter" }]';
      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([[], 0]),
      };
      jest
        .spyOn(repo, "createQueryBuilder")
        .mockReturnValue(queryBuilder as any);

      const result = await service.searchUsers(page, null, sort, filter);

      expect(repo.createQueryBuilder).toHaveBeenCalledWith("users");
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
      expect(queryBuilder.getManyAndCount).toHaveBeenCalled();
      expect(result).toEqual({
        users: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      });
    });

    it("given  limit greater than 200 should return a list of users with pagination and filtering with default limit 10", async () => {
      const page = 1;
      const limit = 201;
      const sort: any = '{ "name": "ASC" }';
      const filter: any =
        '[{ "key": "name", "operation": "=", "value": "Peter" }]';
      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValueOnce([[], 0]),
      };
      jest
        .spyOn(repo, "createQueryBuilder")
        .mockReturnValue(queryBuilder as any);

      const result = await service.searchUsers(page, limit, sort, filter);

      expect(repo.createQueryBuilder).toHaveBeenCalledWith("users");
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
      expect(queryBuilder.getManyAndCount).toHaveBeenCalled();
      expect(result).toEqual({
        users: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      });
    });
  });
});
