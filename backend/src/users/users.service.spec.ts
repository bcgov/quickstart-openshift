import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { BadRequestException } from '@nestjs/common'
import { DEFAULT_LIMIT, FIND_ALL_MAX_ROWS, MAX_LIMIT, UsersService } from './users.service'
import { PrismaService } from '../prisma.service'
import { Prisma } from '../../generated/prisma/client.js'

const makeRows = (ids: number[]) =>
  ids.map((id) => ({
    id: new Prisma.Decimal(id),
    name: `User ${id}`,
    email: `user${id}@test.com`,
  }))

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

    it('should cap the query with a take limit so it can never load unbounded rows', async () => {
      const findManySpy = vi.spyOn(prisma.users, 'findMany')
      await service.findAll()
      expect(findManySpy).toHaveBeenCalledWith({ take: FIND_ALL_MAX_ROWS })
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
    it('should return {deleted: false, message: err.message}', async () => {
      const repoSpy = vi
        .spyOn(prisma.users, 'delete')
        .mockRejectedValueOnce(new Error('Bad Delete Method.'))
      await expect(service.remove(-1)).resolves.toEqual({
        deleted: false,
        message: 'Bad Delete Method.',
      })
      expect(repoSpy).toBeCalledTimes(1)
    })
  })

  describe('searchUsers', () => {
    it('given no params should return the first page ordered by id asc with sensible defaults', async () => {
      const findManySpy = vi.spyOn(prisma.users, 'findMany').mockResolvedValue(savedUserArray)

      const result = await service.searchUsers()

      expect(findManySpy).toHaveBeenCalledWith({
        where: {},
        orderBy: [{ id: 'asc' }],
        take: DEFAULT_LIMIT + 1,
      })
      expect(result).toEqual({
        users: [oneUser, twoUser],
        limit: DEFAULT_LIMIT,
        count: 2,
        hasNextPage: false,
        hasPreviousPage: false,
        nextCursor: null,
        previousCursor: null,
      })
      // total/totalPages are opt-in and must not be computed (no extra COUNT(*)) by default.
      expect(prisma.users.count).not.toHaveBeenCalled()
    })

    it('should clamp an oversized limit to MAX_LIMIT instead of silently resetting to the default', async () => {
      const findManySpy = vi.spyOn(prisma.users, 'findMany').mockResolvedValue([])

      const result = await service.searchUsers('500')

      expect(result.limit).toBe(MAX_LIMIT)
      expect(findManySpy).toHaveBeenCalledWith(expect.objectContaining({ take: MAX_LIMIT + 1 }))
    })

    it('should reject a non-numeric limit with a 400 instead of silently falling back', async () => {
      await expect(service.searchUsers('not-a-number')).rejects.toBeInstanceOf(BadRequestException)
    })

    it('should reject a zero/negative limit', async () => {
      await expect(service.searchUsers('0')).rejects.toBeInstanceOf(BadRequestException)
    })

    it('should return a 400 (not a 500) for invalid sort JSON', async () => {
      await expect(service.searchUsers(undefined, '[{ invalid')).rejects.toBeInstanceOf(
        BadRequestException,
      )
    })

    it('should reject a sort field that is not on the allow-list', async () => {
      await expect(service.searchUsers(undefined, '[{"password":"asc"}]')).rejects.toBeInstanceOf(
        BadRequestException,
      )
    })

    it('should reject a sort entry with an invalid direction', async () => {
      await expect(service.searchUsers(undefined, '[{"name":"ascending"}]')).rejects.toBeInstanceOf(
        BadRequestException,
      )
    })

    it('should return a 400 (not a 500) for invalid filter JSON', async () => {
      await expect(service.searchUsers(undefined, undefined, 'not-json')).rejects.toBeInstanceOf(
        BadRequestException,
      )
    })

    it('should reject a filter field that is not on the allow-list', async () => {
      await expect(
        service.searchUsers(
          undefined,
          undefined,
          '[{"key":"password","operation":"eq","value":"x"}]',
        ),
      ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('should reject an unsupported filter operation', async () => {
      await expect(
        service.searchUsers(
          undefined,
          undefined,
          '[{"key":"name","operation":"regex","value":"x"}]',
        ),
      ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('should reject "in"/"notin" filter operations without an array value', async () => {
      await expect(
        service.searchUsers(
          undefined,
          undefined,
          '[{"key":"name","operation":"in","value":"not-an-array"}]',
        ),
      ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('should reject requests that provide both after and before cursors', async () => {
      await expect(
        service.searchUsers(undefined, undefined, undefined, 'cursorA', 'cursorB'),
      ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('should reject a malformed cursor', async () => {
      await expect(
        service.searchUsers(undefined, undefined, undefined, 'not-a-valid-cursor'),
      ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('should detect a next page via the limit+1 probe row without running a COUNT(*)', async () => {
      // 11 rows for a default limit of 10 signals "there is more after this page".
      vi.spyOn(prisma.users, 'findMany').mockResolvedValue(
        makeRows([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
      )
      const countSpy = vi.spyOn(prisma.users, 'count')

      const result = await service.searchUsers()

      expect(result.users).toHaveLength(10)
      expect(result.hasNextPage).toBe(true)
      expect(result.hasPreviousPage).toBe(false)
      expect(result.nextCursor).not.toBeNull()
      expect(countSpy).not.toHaveBeenCalled()

      const decoded = JSON.parse(Buffer.from(result.nextCursor!, 'base64url').toString('utf8'))
      expect(decoded).toEqual({ id: '10' })
    })

    it('should build an indexable keyset WHERE clause from a real after cursor', async () => {
      const findManySpy = vi
        .spyOn(prisma.users, 'findMany')
        .mockResolvedValueOnce(makeRows([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]))

      const firstPage = await service.searchUsers()
      expect(firstPage.nextCursor).not.toBeNull()

      findManySpy.mockResolvedValueOnce([])
      await service.searchUsers(undefined, undefined, undefined, firstPage.nextCursor ?? undefined)

      const secondCallArgs = findManySpy.mock.calls[1]?.[0] as {
        where: { AND: [unknown, { OR: Array<{ id: { gt: Prisma.Decimal } }> }] }
        orderBy: unknown
        take: number
      }
      expect(secondCallArgs.orderBy).toEqual([{ id: 'asc' }])
      expect(secondCallArgs.take).toBe(DEFAULT_LIMIT + 1)
      expect(secondCallArgs.where.AND[1].OR[0].id.gt).toBeInstanceOf(Prisma.Decimal)
      expect(secondCallArgs.where.AND[1].OR[0].id.gt.toString()).toBe('10')
    })

    it('should invert scan order for a before cursor and reverse rows back to ascending order', async () => {
      const findManySpy = vi.spyOn(prisma.users, 'findMany')
      // Simulate paging backwards from id 11: the DB scan (id desc, id < 11)
      // returns exactly `limit` rows, so there is nothing earlier (hasPreviousPage: false)
      // but a next page (back towards/through the cursor) always exists (hasNextPage: true).
      findManySpy.mockResolvedValueOnce(makeRows([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]))

      const beforeCursor = Buffer.from(JSON.stringify({ id: '11' }), 'utf8').toString('base64url')
      const result = await service.searchUsers(
        undefined,
        undefined,
        undefined,
        undefined,
        beforeCursor,
      )

      const callArgs = findManySpy.mock.calls[0]?.[0] as {
        where: { AND: [unknown, { OR: Array<{ id: { lt: Prisma.Decimal } }> }] }
        orderBy: unknown
      }
      expect(callArgs.orderBy).toEqual([{ id: 'desc' }])
      expect(callArgs.where.AND[1].OR[0].id.lt.toString()).toBe('11')

      expect(result.users.map((u) => u.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      expect(result.hasNextPage).toBe(true)
      expect(result.hasPreviousPage).toBe(false)
    })

    it('should only compute total/totalPages when includeTotalCount is "true"', async () => {
      vi.spyOn(prisma.users, 'findMany').mockResolvedValue(makeRows([1, 2]))
      const countSpy = vi.spyOn(prisma.users, 'count').mockResolvedValue(42)

      const result = await service.searchUsers(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        'true',
      )

      expect(countSpy).toHaveBeenCalledTimes(1)
      expect(result.total).toBe(42)
      expect(result.totalPages).toBe(Math.ceil(42 / DEFAULT_LIMIT))
    })

    it('should apply allow-listed filters via convertFiltersToPrismaFormat', async () => {
      const findManySpy = vi.spyOn(prisma.users, 'findMany').mockResolvedValue([])

      await service.searchUsers(
        undefined,
        undefined,
        '[{"key":"name","operation":"like","value":"Jo"}]',
      )

      expect(findManySpy).toHaveBeenCalledWith(
        expect.objectContaining({ where: { name: { contains: 'Jo' } } }),
      )
    })
  })
  describe('convertFiltersToPrismaFormat', () => {
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
        { key: 'j', operation: 'isnull', value: '10' },
      ]

      const expectedOutput = {
        a: { contains: '1' },
        b: { equals: '2' },
        c: { not: { equals: '3' } },
        d: { gt: '4' },
        e: { gte: '5' },
        f: { lt: '6' },
        g: { lte: '7' },
        h: { in: ['8'] },
        i: { not: { in: ['9'] } },
        j: { equals: null },
      }

      expect(service.convertFiltersToPrismaFormat(inputFilter)).toStrictEqual(expectedOutput)
    })
  })
})
