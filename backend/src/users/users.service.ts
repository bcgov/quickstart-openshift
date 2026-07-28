import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
import { Prisma } from '../../generated/prisma/client.js'

// Allow-list of columns that may be sorted/filtered on. This keeps every
// generated query index-able and stops callers from probing arbitrary
// fields. Extend this (and add a matching DB index) when new columns are
// added to the `users` table.
type SortableField = 'id' | 'name' | 'email'
const ALLOWED_FIELDS: ReadonlySet<string> = new Set<SortableField>(['id', 'name', 'email'])

const ALLOWED_FILTER_OPERATIONS: ReadonlySet<string> = new Set([
  'like',
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'in',
  'notin',
  'isnull',
])

type SortDirection = 'asc' | 'desc'

interface SortField {
  key: SortableField
  direction: SortDirection
}

interface FilterCondition {
  key: string
  operation: string
  value: unknown
}

export const DEFAULT_LIMIT = 10
export const MAX_LIMIT = 200
// Hard ceiling for the unpaginated findAll() so a single request can never
// pull an unbounded number of rows into memory - this endpoint should only
// ever be used for small/reference tables.
export const FIND_ALL_MAX_ROWS = 1000

type CursorMode = 'after' | 'before'

export interface SearchUsersResult {
  users: UserDto[]
  limit: number
  count: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextCursor: string | null
  previousCursor: string | null
  total?: number
  totalPages?: number
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(user: CreateUserDto): Promise<UserDto> {
    const savedUser = await this.prisma.users.create({
      data: {
        name: user.name,
        email: user.email,
      },
    })

    return this.toUserDto(savedUser)
  }

  async findAll(): Promise<UserDto[]> {
    // Bounded on purpose: this is an unpaginated convenience endpoint and
    // must never be allowed to load an unbounded number of rows into memory.
    // Callers that need to page through large tables should use
    // `searchUsers` instead.
    const users = await this.prisma.users.findMany({ take: FIND_ALL_MAX_ROWS })
    return users.map((user) => this.toUserDto(user))
  }

  async findOne(id: number): Promise<UserDto | null> {
    const user = await this.prisma.users.findUnique({
      where: {
        id: new Prisma.Decimal(id),
      },
    })
    if (!user) {
      return null
    }
    return this.toUserDto(user)
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.prisma.users.update({
      where: {
        id: new Prisma.Decimal(id),
      },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
      },
    })
    return this.toUserDto(user)
  }

  async remove(id: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.prisma.users.delete({
        where: {
          id: new Prisma.Decimal(id),
        },
      })
      return { deleted: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { deleted: false, message }
    }
  }

  /**
   * Keyset ("seek method") pagination over the users table.
   *
   * Offset pagination (`skip`/`take`) requires the database to walk and
   * discard every preceding row, so it gets linearly slower the deeper you
   * page - at billions of rows a page near the end can take minutes. Keyset
   * pagination instead carries the last-seen row's sort values in an opaque
   * cursor and turns every page into an indexed `WHERE (sort cols) > (cursor
   * values) ORDER BY ... LIMIT n` query, so cost stays roughly constant
   * regardless of table size or page depth.
   *
   * `limit`/`sort`/`filter`/`after`/`before`/`includeTotalCount` all arrive
   * as raw query-string values (or undefined) and are validated here so a
   * malformed request always yields a 400 instead of a 500 or a silently
   * wrong query.
   */
  async searchUsers(
    limit?: string,
    sort?: string, // JSON array of sort fields, ex: [{"name":"desc"},{"id":"asc"}]
    filter?: string, // JSON array for key, operation and value, ex: [{"key": "name", "operation": "like", "value": "Jo"}]
    after?: string, // opaque cursor: fetch the page immediately after this position
    before?: string, // opaque cursor: fetch the page immediately before this position
    includeTotalCount?: string, // set to "true" to also compute total/totalPages (extra COUNT(*) query)
  ): Promise<SearchUsersResult> {
    if (after && before) {
      throw new BadRequestException('Provide only one of "after" or "before", not both')
    }

    const parsedLimit = this.parseLimit(limit)
    const requestedSort = this.parseSort(sort)
    const filterConditions = this.parseFilter(filter)
    const filterWhere = this.convertFiltersToPrismaFormat(filterConditions)

    // Append `id` as a final tiebreaker whenever it isn't already part of
    // the sort so ordering - and therefore the cursor - is always a total,
    // deterministic order even when name/email contain duplicate values.
    const orderFields: SortField[] = requestedSort.some((field) => field.key === 'id')
      ? requestedSort
      : [...requestedSort, { key: 'id', direction: 'asc' }]

    const mode: CursorMode = before ? 'before' : 'after'
    const cursor = mode === 'before' ? before : after

    let where: Record<string, unknown> = filterWhere
    if (cursor) {
      const cursorValues = this.decodeCursor(cursor, orderFields)
      where = { AND: [filterWhere, this.buildKeysetWhere(orderFields, cursorValues, mode)] }
    }

    // Paging backwards is done by scanning in the opposite direction (so
    // LIMIT keeps the rows nearest the cursor rather than the ones farthest
    // away) and then flipping the page back to normal display order.
    const scanFields = mode === 'before' ? this.invertDirections(orderFields) : orderFields
    const orderBy = scanFields.map((field) => ({
      [field.key]: field.direction,
    })) as Prisma.usersOrderByWithRelationInput[]

    // Fetch one extra row so we can tell whether another page exists without
    // running a separate (expensive, at scale) COUNT(*) query.
    const rows = await this.prisma.users.findMany({
      where,
      orderBy,
      take: parsedLimit + 1,
    })

    const hasMore = rows.length > parsedLimit
    const pageRows = hasMore ? rows.slice(0, parsedLimit) : rows
    const orderedRows = mode === 'before' ? pageRows.slice().reverse() : pageRows

    const hasNextPage = mode === 'before' ? true : hasMore
    const hasPreviousPage = mode === 'before' ? hasMore : Boolean(after)

    const firstRow = orderedRows[0]
    const lastRow = orderedRows[orderedRows.length - 1]

    const result: SearchUsersResult = {
      users: orderedRows.map((row) => this.toUserDto(row)),
      limit: parsedLimit,
      count: orderedRows.length,
      hasNextPage,
      hasPreviousPage,
      nextCursor: hasNextPage && lastRow ? this.encodeCursor(lastRow, orderFields) : null,
      previousCursor: hasPreviousPage && firstRow ? this.encodeCursor(firstRow, orderFields) : null,
    }

    if (includeTotalCount === 'true') {
      const total = await this.prisma.users.count({ where: filterWhere })
      result.total = total
      result.totalPages = Math.ceil(total / parsedLimit)
    }

    return result
  }

  private parseLimit(limit?: string): number {
    if (limit === undefined || limit === null || limit === '') {
      return DEFAULT_LIMIT
    }
    const parsed = Number(limit)
    if (!Number.isInteger(parsed) || parsed < 1) {
      throw new BadRequestException('"limit" must be a positive integer')
    }
    // Clamp rather than silently reset to the default: a caller asking for
    // too much still gets the largest page we're willing to serve.
    return Math.min(parsed, MAX_LIMIT)
  }

  private parseSort(sort?: string): SortField[] {
    if (sort === undefined || sort === null || sort === '') {
      return []
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(sort)
    } catch {
      throw new BadRequestException('"sort" must be valid JSON')
    }
    if (!Array.isArray(parsed)) {
      throw new BadRequestException('"sort" must be a JSON array, e.g. [{"name":"asc"}]')
    }

    return parsed.map((entry) => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        throw new BadRequestException('Each "sort" entry must be an object, e.g. {"name":"asc"}')
      }
      const keys = Object.keys(entry as Record<string, unknown>)
      const key = keys[0]
      if (keys.length !== 1 || !key) {
        throw new BadRequestException('Each "sort" entry must contain exactly one field')
      }
      if (!ALLOWED_FIELDS.has(key)) {
        throw new BadRequestException(`Field "${key}" cannot be sorted on`)
      }
      const direction = (entry as Record<string, unknown>)[key]
      if (direction !== 'asc' && direction !== 'desc') {
        throw new BadRequestException(`Sort direction for "${key}" must be "asc" or "desc"`)
      }
      return { key: key as SortableField, direction }
    })
  }

  private parseFilter(filter?: string): FilterCondition[] {
    if (filter === undefined || filter === null || filter === '') {
      return []
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(filter)
    } catch {
      throw new BadRequestException('"filter" must be valid JSON')
    }
    if (!Array.isArray(parsed)) {
      throw new BadRequestException('"filter" must be a JSON array')
    }

    return parsed.map((entry) => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        throw new BadRequestException('Each "filter" entry must be an object')
      }
      const { key, operation, value } = entry as Partial<FilterCondition>
      if (!key || !ALLOWED_FIELDS.has(key)) {
        throw new BadRequestException(`Field "${String(key)}" cannot be filtered on`)
      }
      if (!operation || !ALLOWED_FILTER_OPERATIONS.has(operation)) {
        throw new BadRequestException(`Filter operation "${String(operation)}" is not supported`)
      }
      if ((operation === 'in' || operation === 'notin') && !Array.isArray(value)) {
        throw new BadRequestException(`Filter operation "${operation}" requires an array value`)
      }
      return { key, operation, value }
    })
  }

  /**
   * Builds the standard "seek method" WHERE clause for N ordered fields:
   * an OR of N branches, where branch i asserts equality on fields 0..i-1
   * and a strict >/< on field i (direction depends on asc/desc and
   * after/before mode). This is what lets Postgres answer the page with a
   * single index range scan instead of a full sort of the whole table.
   */
  private buildKeysetWhere(
    orderFields: SortField[],
    cursorValues: Record<string, string>,
    mode: CursorMode,
  ): Record<string, unknown> {
    const clauses: Record<string, unknown>[] = []
    const precedingEqualities: Record<string, unknown> = {}

    for (const field of orderFields) {
      const rawValue = cursorValues[field.key]
      if (rawValue === undefined) {
        throw new BadRequestException('Invalid cursor')
      }
      const value = this.resolveCursorValue(field.key, rawValue)
      const wantGreaterThan =
        mode === 'after' ? field.direction === 'asc' : field.direction === 'desc'
      clauses.push({
        ...precedingEqualities,
        [field.key]: wantGreaterThan ? { gt: value } : { lt: value },
      })
      precedingEqualities[field.key] = { equals: value }
    }

    return { OR: clauses }
  }

  private resolveCursorValue(key: SortableField, raw: string): unknown {
    return key === 'id' ? new Prisma.Decimal(raw) : raw
  }

  private invertDirections(fields: SortField[]): SortField[] {
    return fields.map((field) => ({
      key: field.key,
      direction: field.direction === 'asc' ? 'desc' : ('asc' as SortDirection),
    }))
  }

  private encodeCursor<T extends { id: Prisma.Decimal; name: string; email: string }>(
    row: T,
    orderFields: SortField[],
  ): string {
    const payload: Record<string, string> = {}
    for (const field of orderFields) {
      const value = row[field.key]
      payload[field.key] = value instanceof Prisma.Decimal ? value.toString() : String(value)
    }
    return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  }

  private decodeCursor(cursor: string, orderFields: SortField[]): Record<string, string> {
    let payload: unknown
    try {
      payload = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'))
    } catch {
      throw new BadRequestException('Invalid cursor')
    }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new BadRequestException('Invalid cursor')
    }

    const record = payload as Record<string, unknown>
    const values: Record<string, string> = {}
    for (const field of orderFields) {
      const value = record[field.key]
      if (typeof value !== 'string') {
        throw new BadRequestException('Invalid cursor')
      }
      values[field.key] = value
    }
    return values
  }

  private toUserDto(user: { id: Prisma.Decimal; name: string; email: string }): UserDto {
    return {
      id: user.id.toNumber(),
      name: user.name,
      email: user.email,
    }
  }

  public convertFiltersToPrismaFormat(filterObj: FilterCondition[]): Record<string, unknown> {
    const prismaFilterObj: Record<string, unknown> = {}

    for (const item of filterObj) {
      if (item.operation === 'like') {
        prismaFilterObj[item.key] = { contains: item.value }
      } else if (item.operation === 'eq') {
        prismaFilterObj[item.key] = { equals: item.value }
      } else if (item.operation === 'neq') {
        prismaFilterObj[item.key] = { not: { equals: item.value } }
      } else if (item.operation === 'gt') {
        prismaFilterObj[item.key] = { gt: item.value }
      } else if (item.operation === 'gte') {
        prismaFilterObj[item.key] = { gte: item.value }
      } else if (item.operation === 'lt') {
        prismaFilterObj[item.key] = { lt: item.value }
      } else if (item.operation === 'lte') {
        prismaFilterObj[item.key] = { lte: item.value }
      } else if (item.operation === 'in') {
        prismaFilterObj[item.key] = { in: item.value }
      } else if (item.operation === 'notin') {
        prismaFilterObj[item.key] = { not: { in: item.value } }
      } else if (item.operation === 'isnull') {
        prismaFilterObj[item.key] = { equals: null }
      }
    }
    return prismaFilterObj
  }
}
