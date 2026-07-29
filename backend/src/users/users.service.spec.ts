import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { BadRequestException } from '@nestjs/common'
import {
  DEFAULT_LIMIT,
  FIND_ALL_MAX_ROWS,
  MAX_LIMIT,
  MIN_SUBSTRING_FILTER_LENGTH,
  UsersService,
} from './users.service'
import { PrismaService } from '../prisma.service'
import { Prisma } from '../../generated/prisma/client.js'

const makeRows = (ids: number[]) =>
  ids.map((id) => ({
    id: new Prisma.Decimal(id),
    name: `User ${id}`,
    email: `user${id}@test.com`,
  }))

const decodeCursor = (cursor: string) =>
  JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')) as {
    version: number
    context: string
    values: Record<string, string>
  }

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
    it('returns the first page ordered by id asc with sensible defaults', async () => {
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
      expect(prisma.users.count).not.toHaveBeenCalled()
    })

    it('clamps an oversized limit to MAX_LIMIT', async () => {
      const findManySpy = vi.spyOn(prisma.users, 'findMany').mockResolvedValue([])

      const result = await service.searchUsers('500')

      expect(result.limit).toBe(MAX_LIMIT)
      expect(findManySpy).toHaveBeenCalledWith(expect.objectContaining({ take: MAX_LIMIT + 1 }))
    })

    it.each(['not-a-number', '0', '-1', '1.5'])('rejects an invalid limit of %s', async (limit) => {
      await expect(service.searchUsers(limit)).rejects.toBeInstanceOf(BadRequestException)
    })

    it('rejects repeated query parameters instead of choosing one silently', async () => {
      await expect(service.searchUsers(['10', '20'])).rejects.toBeInstanceOf(BadRequestException)
    })

    it('rejects malformed and unsafe sort grammar', async () => {
      const invalidSorts = [
        '[{ invalid',
        '[{"password":"asc"}]',
        '[{"name":"ascending"}]',
        '[{"name":"asc"},{"name":"asc"}]',
        '[{"name":"asc"},{"id":"desc"}]',
        '[{"id":"asc"},{"name":"asc"}]',
        '[{"name":"asc"},{"id":"asc"},{"email":"asc"}]',
      ]

      for (const sort of invalidSorts) {
        await expect(service.searchUsers(undefined, sort)).rejects.toBeInstanceOf(
          BadRequestException,
        )
      }
    })

    it('uses same-direction id tiebreakers so the btree sort index stays usable', async () => {
      const findManySpy = vi.spyOn(prisma.users, 'findMany').mockResolvedValue([])

      await service.searchUsers(undefined, '[{"name":"desc"}]')
      await service.searchUsers(undefined, '[{"email":"asc"},{"id":"asc"}]')

      expect(findManySpy).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ orderBy: [{ name: 'desc' }, { id: 'desc' }] }),
      )
      expect(findManySpy).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ orderBy: [{ email: 'asc' }, { id: 'asc' }] }),
      )
    })

    it('rejects malformed and unsupported filters', async () => {
      const invalidFilters = [
        'not-json',
        '[{"key":"password","operation":"eq","value":"x"}]',
        '[{"key":"name","operation":"regex","value":"x"}]',
        '[{"key":"name","operation":"isnull"}]',
        '[{"key":"name","operation":"eq","value":1}]',
        '[{"key":"id","operation":"eq","value":"not-a-number"}]',
        '[{"key":"id","operation":"like","value":"1"}]',
        '[{"key":"name","operation":"in","value":"not-an-array"}]',
        '[{"key":"name","operation":"in","value":[{"nested":"object"}]}]',
        '[{"key":"name","operation":"like","value":"   "}]',
      ]

      for (const filter of invalidFilters) {
        await expect(service.searchUsers(undefined, undefined, filter)).rejects.toBeInstanceOf(
          BadRequestException,
        )
      }
    })

    it('requires a useful minimum length for substring filters', async () => {
      const tooShort = 'x'.repeat(MIN_SUBSTRING_FILTER_LENGTH - 1)
      await expect(
        service.searchUsers(
          undefined,
          undefined,
          `[{"key":"name","operation":"like","value":"${tooShort}"}]`,
        ),
      ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('keeps repeated field filters as independent AND conditions with typed ids', async () => {
      const findManySpy = vi.spyOn(prisma.users, 'findMany').mockResolvedValue([])

      await service.searchUsers(
        undefined,
        undefined,
        '[{"key":"id","operation":"gte","value":"10"},{"key":"id","operation":"lt","value":20}]',
      )

      expect(findManySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [
              { id: { gte: expect.any(Prisma.Decimal) } },
              { id: { lt: expect.any(Prisma.Decimal) } },
            ],
          },
        }),
      )
    })

    it('maps string IN filters without allowing an unbounded value list', async () => {
      const findManySpy = vi.spyOn(prisma.users, 'findMany').mockResolvedValue([])

      await service.searchUsers(
        undefined,
        undefined,
        '[{"key":"email","operation":"in","value":["a@example.com","b@example.com"]}]',
      )

      expect(findManySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: { in: ['a@example.com', 'b@example.com'] } },
        }),
      )
    })

    it('rejects requests that provide both after and before cursors', async () => {
      await expect(
        service.searchUsers(undefined, undefined, undefined, 'cursorA', 'cursorB'),
      ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('rejects a malformed cursor', async () => {
      await expect(
        service.searchUsers(undefined, undefined, undefined, 'not-a-valid-cursor'),
      ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('detects a next page with a limit plus one probe and emits a context-bound cursor', async () => {
      vi.spyOn(prisma.users, 'findMany').mockResolvedValue(
        makeRows([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
      )

      const result = await service.searchUsers()

      expect(result.users).toHaveLength(DEFAULT_LIMIT)
      expect(result.hasNextPage).toBe(true)
      expect(result.hasPreviousPage).toBe(false)
      expect(result.nextCursor).not.toBeNull()
      expect(prisma.users.count).not.toHaveBeenCalled()
      expect(decodeCursor(result.nextCursor!)).toEqual({
        version: 1,
        context: expect.any(String),
        values: { id: '10' },
      })
    })

    it('builds a typed indexable keyset predicate from an after cursor', async () => {
      const findManySpy = vi
        .spyOn(prisma.users, 'findMany')
        .mockResolvedValueOnce(makeRows([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]))
        .mockResolvedValueOnce([])

      const firstPage = await service.searchUsers()
      await service.searchUsers(undefined, undefined, undefined, firstPage.nextCursor ?? undefined)

      expect(findManySpy).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          where: {
            AND: [
              {},
              {
                OR: [{ id: { gt: expect.any(Prisma.Decimal) } }],
              },
            ],
          },
          orderBy: [{ id: 'asc' }],
          take: DEFAULT_LIMIT + 1,
        }),
      )
    })

    it('rejects a context-valid cursor whose id is not numeric', async () => {
      vi.spyOn(prisma.users, 'findMany').mockResolvedValue(
        makeRows([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
      )
      const firstPage = await service.searchUsers()
      const malformedPayload = decodeCursor(firstPage.nextCursor!)
      malformedPayload.values.id = 'not-a-number'
      const malformedCursor = Buffer.from(JSON.stringify(malformedPayload), 'utf8').toString(
        'base64url',
      )

      await expect(
        service.searchUsers(undefined, undefined, undefined, malformedCursor),
      ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('rejects a cursor reused with a different sort or filter', async () => {
      vi.spyOn(prisma.users, 'findMany').mockResolvedValue(
        makeRows([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
      )
      const unfilteredPage = await service.searchUsers()
      const filteredPage = await service.searchUsers(
        undefined,
        undefined,
        '[{"key":"name","operation":"like","value":"User"}]',
      )

      await expect(
        service.searchUsers(
          undefined,
          '[{"id":"desc"}]',
          undefined,
          unfilteredPage.nextCursor ?? undefined,
        ),
      ).rejects.toBeInstanceOf(BadRequestException)
      await expect(
        service.searchUsers(
          undefined,
          undefined,
          '[{"key":"name","operation":"like","value":"Other"}]',
          filteredPage.nextCursor ?? undefined,
        ),
      ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('accepts a cursor with equivalent filters in a different JSON order', async () => {
      const findManySpy = vi
        .spyOn(prisma.users, 'findMany')
        .mockResolvedValueOnce(makeRows([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]))
        .mockResolvedValueOnce([])
      const firstPage = await service.searchUsers(
        undefined,
        undefined,
        '[{"key":"id","operation":"gte","value":1},{"key":"id","operation":"lt","value":100}]',
      )

      await expect(
        service.searchUsers(
          undefined,
          undefined,
          '[{"key":"id","operation":"lt","value":100},{"key":"id","operation":"gte","value":1}]',
          firstPage.nextCursor ?? undefined,
        ),
      ).resolves.toMatchObject({ users: [] })
      expect(findManySpy).toHaveBeenCalledTimes(2)
    })

    it('scans backwards then reverses rows to the normal order', async () => {
      const findManySpy = vi
        .spyOn(prisma.users, 'findMany')
        .mockResolvedValueOnce(makeRows([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]))
        .mockResolvedValueOnce(makeRows([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]))
        .mockResolvedValueOnce(makeRows([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]))

      const firstPage = await service.searchUsers()
      const secondPage = await service.searchUsers(
        undefined,
        undefined,
        undefined,
        firstPage.nextCursor ?? undefined,
      )
      const previousPage = await service.searchUsers(
        undefined,
        undefined,
        undefined,
        undefined,
        secondPage.previousCursor ?? undefined,
      )

      expect(previousPage.users.map((user) => user.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      expect(previousPage.hasNextPage).toBe(true)
      expect(previousPage.hasPreviousPage).toBe(false)
      expect(findManySpy).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          where: {
            AND: [
              {},
              {
                OR: [{ id: { lt: expect.any(Prisma.Decimal) } }],
              },
            ],
          },
          orderBy: [{ id: 'desc' }],
        }),
      )
    })

    it('returns empty-page metadata without dangling cursors', async () => {
      const findManySpy = vi
        .spyOn(prisma.users, 'findMany')
        .mockResolvedValueOnce(makeRows([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]))
        .mockResolvedValueOnce([])

      const firstPage = await service.searchUsers()
      const emptyPage = await service.searchUsers(
        undefined,
        undefined,
        undefined,
        firstPage.nextCursor ?? undefined,
      )

      expect(emptyPage).toMatchObject({
        users: [],
        hasNextPage: false,
        hasPreviousPage: false,
        nextCursor: null,
        previousCursor: null,
      })
      expect(findManySpy).toHaveBeenCalledTimes(2)
    })

    it('computes total counts only when includeTotalCount is true', async () => {
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

      expect(countSpy).toHaveBeenCalledWith({ where: {} })
      expect(result.total).toBe(42)
      expect(result.totalPages).toBe(Math.ceil(42 / DEFAULT_LIMIT))
    })

    it.each(['yes', ''])('rejects an invalid includeTotalCount value of %j', async (value) => {
      await expect(
        service.searchUsers(undefined, undefined, undefined, undefined, undefined, value),
      ).rejects.toBeInstanceOf(BadRequestException)
    })
  })
})
