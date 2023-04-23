import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {Users} from "./entities/users.entity";
import * as request from 'supertest';
import {HttpException, INestApplication} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {UserDto} from "./dto/user.dto";

describe("UserController", () => {
  let controller: UsersController;
  let usersService: UsersService;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: {},
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
    app = module.createNestApplication();
    await app.init();
  });
  // Close the app after each test
  afterEach(async () => {
    await app.close();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service create method with the given dto and return the result', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      };
      const expectedResult = {
        id: 1,
        ...createUserDto,
      };
      jest.spyOn(usersService, 'create').mockResolvedValue(expectedResult);

      // Act
      const result = await controller.create(createUserDto);

      // Assert
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResult);
    });
  });
  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: Users[] = [];
      result.push({id: 1, name: 'Alice', email: 'test@gmail.com'});
      jest.spyOn(usersService, 'findAll').mockResolvedValue(result);
      expect(await controller.findAll()).toBe(result);
    });
  });
  describe('findOne', () => {
    it('should return a user object', async () => {
      const result = new Users('john', 'John Doe');
      result.id = 1;
      jest.spyOn(usersService, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });
  describe('update', () => {
    it('should update and return a user object', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = {
        email: 'johndoe@example.com',
        name: 'John Doe',
      };
      const userDto: UserDto = {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
      };
      jest.spyOn(usersService, 'update').mockResolvedValue(userDto);

      expect(await controller.update(id, updateUserDto)).toBe(userDto);
      expect(usersService.update).toHaveBeenCalledWith(+id, updateUserDto);
    });
  });
  describe('remove', () => {
    it('should remove a user', async () => {
      const id = '1';
      jest.spyOn(usersService, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove(id)).toBeUndefined();
      expect(usersService.remove).toHaveBeenCalledWith(+id);
    });
  });
  // Test the GET /users/search endpoint
  describe('GET /users/search', () => {
    // Test with valid query parameters
    it('given valid query parameters_should return an array of users with pagination metadata', async () => {
      // Mock the usersService.searchUsers method to return a sample result
      const result = {
        users: [
          {id: 1, name: 'Alice', email: 'alice@example.com'},
          {id: 2, name: 'Adam', email: 'Adam@example.com'},
        ],
        page: 1,
        limit: 10,
        sort: '{"name":"ASC"}',
        filter: '[{"key":"name","operation":"like","value":"A"}]',
        total: 2,
        totalPages: 1,
      };
      jest.spyOn(usersService, 'searchUsers').mockImplementation(async () => result);

      // Make a GET request with query parameters and expect a 200 status code and the result object
      return request(app.getHttpServer())
        .get('/users/search')
        .query({
          page: 1,
          limit: 10,
          sort: '{"name":"ASC"}',
          filter: '[{"key":"name","operation":"like","value":"A"}]',
        })
        .expect(200)
        .expect(result);
    });

    // Test with invalid query parameters
    it('given invalid query parameters_should return a 400 status code with an error message', async () => {
      // Make a GET request with invalid query parameters and expect a 400 status code and an error message
      return request(app.getHttpServer())
        .get('/users/search')
        .query({
          page: 'invalid',
          limit: 'invalid',
        })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Invalid query parameters'
        });
    });
    it('given sort and filter as invalid query parameters_should return a 400 status code with an error message', async () => {
      // Make a GET request with invalid query parameters and expect a 400 status code and an error message
      jest.spyOn(usersService, 'searchUsers').mockImplementation(async () => {
        throw new HttpException('Invalid query parameters', 400)
      });
      return request(app.getHttpServer())
        .get('/users/search')
        .query({
          page: 1,
          limit: 10,
          sort: 'invalid',
          filter: 'invalid',
        })
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Invalid query parameters'
        });
    });
  });
});
