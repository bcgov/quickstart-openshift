import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {Users} from "./entities/users.entity";
import * as request from 'supertest';
import {HttpException, INestApplication} from "@nestjs/common";

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
