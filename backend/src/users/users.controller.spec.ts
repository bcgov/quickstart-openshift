import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import type { SearchUsersResult } from './users.service'
import request from 'supertest'
import type { INestApplication } from '@nestjs/common'
import { HttpException } from '@nestjs/common'
import type { CreateUserDto } from './dto/create-user.dto'
import type { UpdateUserDto } from './dto/update-user.dto'
import type { UserDto } from './dto/user.dto'
import { PrismaService } from '../prisma.service'
describe('UserController', () => {
  let controller: UsersController
  let usersService: UsersService
  let app: INestApplication

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile()
    usersService = module.get<UsersService>(UsersService)
    controller = module.get<UsersController>(UsersController)
    app = module.createNestApplication()
    await app.init()
  })
  // Close the app after each test
  afterEach(async () => {
    await app.close()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should call the service create method with the given dto and return the result', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      }
      const expectedResult = {
        id: 1,
        ...createUserDto,
      }
      vi.spyOn(usersService, 'create').mockResolvedValue(expectedResult)

      // Act
      const result = await controller.create(createUserDto)

      // Assert
      expect(usersService.create).toHaveBeenCalledWith(createUserDto)
      expect(result).toEqual(expectedResult)
    })
  })
  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = []
      result.push({ id: 1, name: 'Alice', email: 'test@gmail.com' })
      vi.spyOn(usersService, 'findAll').mockResolvedValue(result)
      expect(await controller.findAll()).toBe(result)
    })
  })
  describe('findOne', () => {
    it('should return a user object', async () => {
      const result: UserDto = {
        id: 1,
        name: 'john',
        email: 'John_Doe@gmail.com',
      }
      vi.spyOn(usersService, 'findOne').mockResolvedValue(result)
      expect(await controller.findOne('1')).toBe(result)
    })
    it('should throw error if user not found', async () => {
      vi.spyOn(usersService, 'findOne').mockResolvedValue(undefined)
      try {
        await controller.findOne('1')
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException)
        expect(e.message).toBe('User not found.')
      }
    })
  })
  describe('update', () => {
    it('should update and return a user object', async () => {
      const id = '1'
      const updateUserDto: UpdateUserDto = {
        email: 'johndoe@example.com',
        name: 'John Doe',
      }
      const userDto: UserDto = {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
      }
      vi.spyOn(usersService, 'update').mockResolvedValue(userDto)

      expect(await controller.update(id, updateUserDto)).toBe(userDto)
      expect(usersService.update).toHaveBeenCalledWith(+id, updateUserDto)
    })
  })
  describe('remove', () => {
    it('should remove a user', async () => {
      const id = '1'
      vi.spyOn(usersService, 'remove').mockResolvedValue(undefined)

      expect(await controller.remove(id)).toBeUndefined()
      expect(usersService.remove).toHaveBeenCalledWith(+id)
    })
  })
  // Test the GET /users/search endpoint
  describe('GET /users/search', () => {
    // Test with valid query parameters
    it('given valid query parameters_should return users with cursor pagination metadata', async () => {
      // Mock the usersService.searchUsers method to return a sample result
      const result: SearchUsersResult = {
        users: [
          { id: 1, name: 'Alice', email: 'alice@example.com' },
          { id: 2, name: 'Adam', email: 'Adam@example.com' },
        ],
        limit: 10,
        count: 2,
        hasNextPage: false,
        hasPreviousPage: false,
        nextCursor: null,
        previousCursor: null,
      }
      vi.spyOn(usersService, 'searchUsers').mockImplementation(async () => result)

      // Make a GET request with query parameters and expect a 200 status code and the result object
      return request(app.getHttpServer())
        .get('/users/search')
        .query({
          limit: 10,
          sort: '[{"name":"asc"}]',
          filter: '[{"key":"name","operation":"like","value":"A"}]',
        })
        .expect(200)
        .expect(result)
    })

    // Test with an invalid limit, exercising the real (unmocked) service to prove
    // invalid input now correctly yields a 400 instead of an unhandled 500.
    it('given a non-numeric limit_should return a 400 status code with an error message', async () => {
      return request(app.getHttpServer())
        .get('/users/search')
        .query({ limit: 'invalid' })
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400)
          expect(res.body.error).toBe('Bad Request')
          expect(typeof res.body.message).toBe('string')
        })
    })

    it('given sort and filter as invalid JSON_should return a 400 status code with an error message', async () => {
      // Exercises the real service so invalid sort/filter JSON is proven to
      // yield a controlled 400 rather than an uncaught 500.
      return request(app.getHttpServer())
        .get('/users/search')
        .query({
          sort: 'invalid',
          filter: 'invalid',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400)
          expect(res.body.error).toBe('Bad Request')
        })
    })

    it('given a sort field outside the allow-list_should return a 400 status code', async () => {
      return request(app.getHttpServer())
        .get('/users/search')
        .query({ sort: '[{"password":"asc"}]' })
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400)
          expect(res.body.error).toBe('Bad Request')
        })
    })

    it('given both after and before cursors_should return a 400 status code', async () => {
      return request(app.getHttpServer())
        .get('/users/search')
        .query({ after: 'a', before: 'b' })
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400)
          expect(res.body.error).toBe('Bad Request')
        })
    })

    it('given a well-formed cursor with a non-numeric id_should return a 400 instead of a 500', async () => {
      // Exercises the real service: correct cursor shape/keys, but "id" is
      // not parseable as a Prisma.Decimal - proves resolveCursorValue's
      // guard prevents this from bubbling up as an unhandled 500.
      const badIdCursor = Buffer.from(JSON.stringify({ id: 'not-a-number' }), 'utf8').toString(
        'base64url',
      )
      return request(app.getHttpServer())
        .get('/users/search')
        .query({ after: badIdCursor })
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400)
          expect(res.body.error).toBe('Bad Request')
        })
    })

    it('given a non-scalar filter value_should return a 400 instead of a 500', async () => {
      // Exercises the real service: proves parseFilter's scalar-value
      // guard prevents a non-string/number filter value from reaching
      // Prisma's own (uncaught, 500-triggering) validation error.
      return request(app.getHttpServer())
        .get('/users/search')
        .query({ filter: '[{"key":"name","operation":"like","value":{"nested":"object"}}]' })
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400)
          expect(res.body.error).toBe('Bad Request')
        })
    })
  })
})
