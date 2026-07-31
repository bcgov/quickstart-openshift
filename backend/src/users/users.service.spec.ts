import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { UsersService } from './users.service'
import { PrismaService } from '../prisma.service'
import { Prisma } from '../../generated/prisma/client.js'
import { BadRequestException } from '@nestjs/common'
import { SearchUsersQueryDto } from './dto/search-users-query.dto'

describe('UserService', () => {
  let service: UsersService
  let prisma: PrismaService

  const savedUser1 = {
    id: new Prisma.Decimal(1),
    name: 'Test Numone',
    email: 'numone@test.com',
  }
  const savedUser2 = {
    id: new Prisma.Decimal(2),
    name: 'Test Numtwo',
    email: 'numtwo@test.com',
  }
  const oneUser = {
    id: 1,
    name: 'Test Numone',
    email: 'numone@test.com',
  }
  const updateUser = {
    id: 1,
    name: 'Test Numone update',
    email: 'numoneupdate@test.com',
  }
  const updatedUser = {
    id: new Prisma.Decimal(1),
    name: 'Test Numone update',
    email: 'numoneupdate@test.com',
  }

  const twoUser = {
    id: 2,
    name: 'Test Numtwo',
    email: 'numtwo@test.com',
  }

  const userArray = [oneUser, twoUser]
  const savedUserArray = [savedUser1, savedUser2]

  const createSearchQuery = (overrides: Partial<SearchUsersQueryDto> = {}): SearchUsersQueryDto =>
    Object.assign(new SearchUsersQueryDto(), {
      sort: '[{"name":"asc"}]',
      filter: '[{"key":"name","operation":"eq","value":"Peter"}]',
      ...overrides,
    })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            users: {
              findMany: vi.fn().mockResolvedValue(savedUserArray),
              findUnique: vi.fn().mockResolvedValue(savedUser1),
              create: vi.fn().mockResolvedValue(savedUser1),
              update: vi.fn().mockResolvedValue(updatedUser),
              delete: vi.fn().mockResolvedValue(true),
              count: vi.fn(),
            },
          },
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createOne', () => {
    it('should successfully add a user', async () => {
      await expect(service.create(oneUser)).resolves.toEqual(oneUser)
      expect(prisma.users.create).toBeCalledTimes(1)
    })
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll()
      expect(users).toEqual(userArray)
    })
  })

  describe('findOne', () => {
    it('should get a single user', async () => {
      await expect(service.findOne(1)).resolves.toEqual(oneUser)
    })
  })

  describe('update', () => {
    it('should call the update method', async () => {
      const user = await service.update(1, updateUser)
      expect(user).toEqual(updateUser)
      expect(prisma.users.update).toBeCalledTimes(1)
    })
  })

  describe('remove', () => {
    it('should return {deleted: true}', async () => {
      await expect(service.remove(2)).resolves.toEqual({ deleted: true })
    })
    it('should rethrow unexpected delete errors', async () => {
      const repoSpy = vi
        .spyOn(prisma.users, 'delete')
        .mockRejectedValueOnce(new Error('Bad Delete Method.'))
      await expect(service.remove(-1)).rejects.toThrow('Bad Delete Method.')
      expect(repoSpy).toBeCalledTimes(1)
    })
  })

  describe('searchUsers', () => {
    it('should return a list of users with pagination and filtering', async () => {
      vi.spyOn(prisma.users, 'findMany').mockResolvedValue([])
      vi.spyOn(prisma.users, 'count').mockResolvedValue(0)
      const result = await service.searchUsers(createSearchQuery())

      expect(result).toEqual({
        users: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      })
    })

    it('given no page should return a list of users with pagination and filtering with default page 1', async () => {
      vi.spyOn(prisma.users, 'findMany').mockResolvedValue([])
      vi.spyOn(prisma.users, 'count').mockResolvedValue(0)
      const query = createSearchQuery({ limit: 10 })
      const result = await service.searchUsers(query)

      expect(result).toEqual({
        users: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      })
    })
    it('given no limit should return a list of users with pagination and filtering with default limit 10', async () => {
      vi.spyOn(prisma.users, 'findMany').mockResolvedValue([])
      vi.spyOn(prisma.users, 'count').mockResolvedValue(0)
      const query = createSearchQuery({ page: 1 })
      const result = await service.searchUsers(query)

      expect(result).toEqual({
        users: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      })
    })

    it('should reject a limit greater than 200', async () => {
      await expect(service.searchUsers(createSearchQuery({ limit: 201 }))).rejects.toThrow(
        BadRequestException,
      )
    })
    it('given  invalid JSON should throw error', async () => {
      const query = createSearchQuery({ sort: '[{"name" "asc"}]' })
      await expect(service.searchUsers(query)).rejects.toThrow('Invalid query parameters')
    })
  })
  describe('convertFiltersToPrismaFormat', () => {
    it("should convert input filters to prisma's filter format", () => {
      const inputFilter = [
        { key: 'name', operation: 'like', value: '1' },
        { key: 'email', operation: 'eq', value: '2' },
        { key: 'id', operation: 'neq', value: 3 },
      ]

      const expectedOutput = {
        name: { contains: '1' },
        email: { equals: '2' },
        id: { not: { equals: 3 } },
      }

      expect(service.convertFiltersToPrismaFormat(inputFilter)).toStrictEqual(expectedOutput)
    })
  })
})
