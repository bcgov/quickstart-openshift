import { createHash } from 'node:crypto'
import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
import { Prisma } from '../../generated/prisma/client.js'

const SORTABLE_FIELDS = ['id', 'name', 'email'] as const
const SET_FILTER_OPERATIONS = ['in', 'notin'] as const
const STRING_SCALAR_FILTER_OPERATIONS = ['like', 'eq', 'neq', 'gt', 'gte', 'lt', 'lte'] as const
const DECIMAL_SCALAR_FILTER_OPERATIONS = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'] as const

type SortableField = (typeof SORTABLE_FIELDS)[number]
type StringFilterField = Exclude<SortableField, 'id'>
type SetFilterOperation = (typeof SET_FILTER_OPERATIONS)[number]
type StringScalarFilterOperation = (typeof STRING_SCALAR_FILTER_OPERATIONS)[number]
type DecimalScalarFilterOperation = (typeof DECIMAL_SCALAR_FILTER_OPERATIONS)[number]
type StringFilterOperation = StringScalarFilterOperation | SetFilterOperation
type DecimalFilterOperation = DecimalScalarFilterOperation | SetFilterOperation
type SortDirection = 'asc' | 'desc'
type CursorMode = 'after' | 'before'

interface SortField {
  key: SortableField
  direction: SortDirection
}

type StringFilterCondition =
  | {
      key: StringFilterField
      operation: StringScalarFilterOperation
      value: string
    }
  | {
      key: StringFilterField
      operation: SetFilterOperation
      value: string[]
    }

type DecimalFilterCondition =
  | {
      key: 'id'
      operation: DecimalScalarFilterOperation
      value: Prisma.Decimal
    }
  | {
      key: 'id'
      operation: SetFilterOperation
      value: Prisma.Decimal[]
    }

type FilterCondition = StringFilterCondition | DecimalFilterCondition

interface CursorPayload {
  version: number
  context: string
  values: Record<string, unknown>
}

interface SearchRequest {
  limit: number
  orderFields: SortField[]
  filterConditions: FilterCondition[]
  filterWhere: Prisma.usersWhereInput
  mode: CursorMode
  cursor?: string
  cursorContext: string
  includeTotalCount: boolean
}

export type SearchUsersQueryParameter = string | string[]

export const DEFAULT_LIMIT = 10
export const MAX_LIMIT = 200
export const MAX_FILTER_CONDITIONS = 10
export const MAX_FILTER_VALUES = 100
export const MIN_SUBSTRING_FILTER_LENGTH = 3
// Hard ceiling for the unpaginated findAll() so a single request can never
// pull an unbounded number of rows into memory - this endpoint should only
// ever be used for small/reference tables.
export const FIND_ALL_MAX_ROWS = 1000

const CURSOR_VERSION = 1

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
   *
   * @see https://www.prisma.io/docs/orm/v6/prisma-client/queries/pagination#cursor-based-pagination
   */
  async searchUsers(
    limit?: SearchUsersQueryParameter,
    sort?: SearchUsersQueryParameter,
    filter?: SearchUsersQueryParameter,
    after?: SearchUsersQueryParameter,
    before?: SearchUsersQueryParameter,
    includeTotalCount?: SearchUsersQueryParameter,
  ): Promise<SearchUsersResult> {
    const request = this.parseSearchRequest(limit, sort, filter, after, before, includeTotalCount)
    const rows = await this.findSearchRows(request)
    const page = this.createSearchResult(rows, request)

    return this.addOptionalTotalCount(page, request)
  }

  private parseSearchRequest(
    limit: SearchUsersQueryParameter | undefined,
    sort: SearchUsersQueryParameter | undefined,
    filter: SearchUsersQueryParameter | undefined,
    after: SearchUsersQueryParameter | undefined,
    before: SearchUsersQueryParameter | undefined,
    includeTotalCount: SearchUsersQueryParameter | undefined,
  ): SearchRequest {
    const cursors = this.parseCursors(after, before)
    const orderFields = this.resolveOrderFields(this.parseSort(sort))
    const filterConditions = this.parseFilter(filter)
    const filterWhere = this.convertFiltersToPrismaFormat(filterConditions)

    return {
      limit: this.parseLimit(limit),
      orderFields,
      filterConditions,
      filterWhere,
      mode: cursors.before ? 'before' : 'after',
      cursor: cursors.before ?? cursors.after,
      cursorContext: this.createCursorContext(orderFields, filterConditions),
      includeTotalCount: this.parseIncludeTotalCount(includeTotalCount),
    }
  }

  private parseCursors(
    after: SearchUsersQueryParameter | undefined,
    before: SearchUsersQueryParameter | undefined,
  ): { after?: string; before?: string } {
    const parsedAfter = this.parseCursorParameter('after', after)
    const parsedBefore = this.parseCursorParameter('before', before)
    if (parsedAfter && parsedBefore) {
      throw new BadRequestException('Provide only one of "after" or "before", not both')
    }
    return { after: parsedAfter, before: parsedBefore }
  }

  private async findSearchRows(request: SearchRequest) {
    return this.prisma.users.findMany({
      where: this.buildSearchWhere(request),
      orderBy: this.getScanOrder(request.orderFields, request.mode),
      take: request.limit + 1,
    })
  }

  private buildSearchWhere(request: SearchRequest): Prisma.usersWhereInput {
    if (!request.cursor) {
      return request.filterWhere
    }

    const cursorValues = this.decodeCursor(
      request.cursor,
      request.orderFields,
      request.cursorContext,
    )
    return {
      AND: [
        request.filterWhere,
        this.buildKeysetWhere(request.orderFields, cursorValues, request.mode),
      ],
    }
  }

  private createSearchResult(
    rows: Array<{ id: Prisma.Decimal; name: string; email: string }>,
    request: SearchRequest,
  ): SearchUsersResult {
    const hasMore = rows.length > request.limit
    const pageRows = hasMore ? rows.slice(0, request.limit) : rows
    const orderedRows = request.mode === 'before' ? pageRows.slice().reverse() : pageRows
    const pageInfo = this.getPageInfo(
      orderedRows.length,
      request.mode,
      request.cursor !== undefined,
      hasMore,
    )
    const firstRow = orderedRows[0]
    const lastRow = orderedRows.at(-1)

    return {
      users: orderedRows.map((row) => this.toUserDto(row)),
      limit: request.limit,
      count: orderedRows.length,
      hasNextPage: pageInfo.hasNextPage,
      hasPreviousPage: pageInfo.hasPreviousPage,
      nextCursor:
        pageInfo.hasNextPage && lastRow
          ? this.encodeCursor(lastRow, request.orderFields, request.cursorContext)
          : null,
      previousCursor:
        pageInfo.hasPreviousPage && firstRow
          ? this.encodeCursor(firstRow, request.orderFields, request.cursorContext)
          : null,
    }
  }

  private getPageInfo(
    rowCount: number,
    mode: CursorMode,
    hasCursor: boolean,
    hasMore: boolean,
  ): Pick<SearchUsersResult, 'hasNextPage' | 'hasPreviousPage'> {
    if (rowCount === 0) {
      return { hasNextPage: false, hasPreviousPage: false }
    }
    if (mode === 'before') {
      return { hasNextPage: true, hasPreviousPage: hasMore }
    }
    return { hasNextPage: hasMore, hasPreviousPage: hasCursor }
  }

  private async addOptionalTotalCount(
    page: SearchUsersResult,
    request: SearchRequest,
  ): Promise<SearchUsersResult> {
    if (!request.includeTotalCount) {
      return page
    }

    const total = await this.prisma.users.count({ where: request.filterWhere })
    return {
      ...page,
      total,
      totalPages: Math.ceil(total / request.limit),
    }
  }

  private parseLimit(limit: unknown): number {
    const rawLimit = this.parseOptionalQueryString('limit', limit)
    if (rawLimit === undefined || rawLimit === '') {
      return DEFAULT_LIMIT
    }

    const parsed = Number(rawLimit)
    if (!Number.isInteger(parsed) || parsed < 1) {
      throw new BadRequestException('"limit" must be a positive integer')
    }
    return Math.min(parsed, MAX_LIMIT)
  }

  private parseSort(sort: unknown): SortField[] {
    const rawSort = this.parseOptionalQueryString('sort', sort)
    if (rawSort === undefined || rawSort === '') {
      return []
    }

    const parsed = this.parseJsonArray('sort', rawSort)
    if (parsed.length === 0) {
      return []
    }
    if (parsed.length > 2) {
      throw new BadRequestException(
        '"sort" supports one field and an optional matching "id" tiebreaker',
      )
    }

    const sortFields = parsed.map((entry) => this.parseSortField(entry))
    if (sortFields.length === 2) {
      this.validateExplicitTieBreaker(sortFields)
    }

    const primarySort = sortFields[0]
    return primarySort ? [primarySort] : []
  }

  private parseSortField(entry: unknown): SortField {
    if (!this.isRecord(entry)) {
      throw new BadRequestException('Each "sort" entry must be an object, e.g. {"name":"asc"}')
    }

    const keys = Object.keys(entry)
    const key = keys[0]
    if (keys.length !== 1 || !key || !this.isSortableField(key)) {
      throw new BadRequestException('Each "sort" entry must contain one supported field')
    }

    const direction = entry[key]
    if (direction !== 'asc' && direction !== 'desc') {
      throw new BadRequestException(`Sort direction for "${key}" must be "asc" or "desc"`)
    }
    return { key, direction }
  }

  private validateExplicitTieBreaker(sortFields: SortField[]): void {
    const primarySort = sortFields[0]
    const tieBreaker = sortFields[1]
    if (
      !primarySort ||
      !tieBreaker ||
      primarySort.key === 'id' ||
      tieBreaker.key !== 'id' ||
      primarySort.direction !== tieBreaker.direction
    ) {
      throw new BadRequestException(
        'An explicit "id" tiebreaker must follow one non-id sort field with the same direction',
      )
    }
  }

  private resolveOrderFields(requestedSort: SortField[]): SortField[] {
    const primarySort = requestedSort[0]
    if (!primarySort) {
      return [{ key: 'id', direction: 'asc' }]
    }
    if (primarySort.key === 'id') {
      return [primarySort]
    }
    return [primarySort, { key: 'id', direction: primarySort.direction }]
  }

  private parseFilter(filter: unknown): FilterCondition[] {
    const rawFilter = this.parseOptionalQueryString('filter', filter)
    if (rawFilter === undefined || rawFilter === '') {
      return []
    }

    const parsed = this.parseJsonArray('filter', rawFilter)
    if (parsed.length > MAX_FILTER_CONDITIONS) {
      throw new BadRequestException(`"filter" supports at most ${MAX_FILTER_CONDITIONS} conditions`)
    }
    return parsed.map((entry) => this.parseFilterCondition(entry))
  }

  private parseFilterCondition(entry: unknown): FilterCondition {
    if (!this.isRecord(entry)) {
      throw new BadRequestException('Each "filter" entry must be an object')
    }
    if (entry.key === 'id') {
      return this.parseDecimalFilterCondition(entry)
    }
    if (entry.key === 'name' || entry.key === 'email') {
      return this.parseStringFilterCondition(entry, entry.key)
    }
    throw new BadRequestException(`Field "${String(entry.key)}" cannot be filtered on`)
  }

  private parseStringFilterCondition(
    entry: Record<string, unknown>,
    key: StringFilterField,
  ): StringFilterCondition {
    const operation = entry.operation
    if (typeof operation !== 'string' || !this.isStringFilterOperation(operation)) {
      throw new BadRequestException(
        `Filter operation "${String(operation)}" is not supported for "${key}"`,
      )
    }
    if (this.isSetFilterOperation(operation)) {
      return { key, operation, value: this.parseStringArrayValue(entry.value) }
    }
    if (!this.isStringScalarFilterOperation(operation)) {
      throw new BadRequestException(`Filter operation "${operation}" is not supported for "${key}"`)
    }
    return {
      key,
      operation,
      value: this.parseStringScalarValue(operation, entry.value),
    }
  }

  private parseDecimalFilterCondition(entry: Record<string, unknown>): DecimalFilterCondition {
    const operation = entry.operation
    if (typeof operation !== 'string' || !this.isDecimalFilterOperation(operation)) {
      throw new BadRequestException('Filter operation is not supported for "id"')
    }
    if (this.isSetFilterOperation(operation)) {
      return { key: 'id', operation, value: this.parseDecimalArrayValue(entry.value) }
    }
    if (!this.isDecimalScalarFilterOperation(operation)) {
      throw new BadRequestException('Filter operation is not supported for "id"')
    }
    return { key: 'id', operation, value: this.parseDecimalValue(entry.value) }
  }

  private parseStringScalarValue(operation: StringScalarFilterOperation, value: unknown): string {
    const parsedValue = this.parseStringValue(value)
    if (operation === 'like' && parsedValue.trim().length < MIN_SUBSTRING_FILTER_LENGTH) {
      throw new BadRequestException(
        `"like" filters require at least ${MIN_SUBSTRING_FILTER_LENGTH} characters`,
      )
    }
    return parsedValue
  }

  private parseStringArrayValue(value: unknown): string[] {
    if (!Array.isArray(value) || value.length === 0 || value.length > MAX_FILTER_VALUES) {
      throw new BadRequestException(
        `Array filter values must contain between 1 and ${MAX_FILTER_VALUES} strings`,
      )
    }
    return value.map((item) => this.parseStringValue(item))
  }

  private parseDecimalArrayValue(value: unknown): Prisma.Decimal[] {
    if (!Array.isArray(value) || value.length === 0 || value.length > MAX_FILTER_VALUES) {
      throw new BadRequestException(
        `Array filter values must contain between 1 and ${MAX_FILTER_VALUES} numbers`,
      )
    }
    return value.map((item) => this.parseDecimalValue(item))
  }

  private parseStringValue(value: unknown): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('String filters require a string value')
    }
    return value
  }

  private parseDecimalValue(value: unknown): Prisma.Decimal {
    if (!this.isDecimalInput(value)) {
      throw new BadRequestException('ID filters require a finite numeric value')
    }
    try {
      const decimal = new Prisma.Decimal(value)
      if (!decimal.isFinite()) {
        throw new Error('Decimal value is not finite')
      }
      return decimal
    } catch {
      throw new BadRequestException('ID filters require a finite numeric value')
    }
  }

  private parseIncludeTotalCount(includeTotalCount: unknown): boolean {
    const rawValue = this.parseOptionalQueryString('includeTotalCount', includeTotalCount)
    if (rawValue === undefined || rawValue === 'false') {
      return false
    }
    if (rawValue === 'true') {
      return true
    }
    throw new BadRequestException('"includeTotalCount" must be "true" or "false"')
  }

  private parseCursorParameter(name: 'after' | 'before', value: unknown): string | undefined {
    const cursor = this.parseOptionalQueryString(name, value)
    if (cursor === '') {
      throw new BadRequestException(`"${name}" must be a non-empty cursor`)
    }
    return cursor
  }

  private parseOptionalQueryString(name: string, value: unknown): string | undefined {
    if (value === undefined) {
      return undefined
    }
    if (typeof value !== 'string') {
      throw new BadRequestException(`"${name}" must be provided once as a string`)
    }
    return value
  }

  private parseJsonArray(name: 'sort' | 'filter', rawValue: string): unknown[] {
    let parsed: unknown
    try {
      parsed = JSON.parse(rawValue)
    } catch {
      throw new BadRequestException(`"${name}" must be valid JSON`)
    }
    if (!Array.isArray(parsed)) {
      throw new BadRequestException(`"${name}" must be a JSON array`)
    }
    return parsed
  }

  private createCursorContext(orderFields: SortField[], filters: FilterCondition[]): string {
    const normalizedFilters = filters
      .map((filter) =>
        JSON.stringify({
          key: filter.key,
          operation: filter.operation,
          value: this.normalizeCursorFilterValue(filter.value),
        }),
      )
      .sort()

    return createHash('sha256')
      .update(JSON.stringify({ orderFields, filters: normalizedFilters }))
      .digest('base64url')
  }

  private normalizeCursorFilterValue(value: FilterCondition['value']): string | string[] {
    if (Array.isArray(value)) {
      return value.map((item) => item.toString()).sort()
    }
    return value.toString()
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
  ): Prisma.usersWhereInput {
    const clauses: Prisma.usersWhereInput[] = []
    let precedingEqualities: Prisma.usersWhereInput = {}

    for (const field of orderFields) {
      const rawValue = cursorValues[field.key]
      if (rawValue === undefined) {
        throw new BadRequestException('Invalid cursor')
      }
      clauses.push({
        ...precedingEqualities,
        ...this.createCursorComparison(field, rawValue, mode),
      })
      precedingEqualities = {
        ...precedingEqualities,
        ...this.createCursorEquality(field.key, rawValue),
      }
    }

    return { OR: clauses }
  }

  private createCursorComparison(
    field: SortField,
    rawValue: string,
    mode: CursorMode,
  ): Prisma.usersWhereInput {
    const useGreaterThan = mode === 'after' ? field.direction === 'asc' : field.direction === 'desc'

    if (field.key === 'id') {
      const value = this.resolveCursorId(rawValue)
      return { id: useGreaterThan ? { gt: value } : { lt: value } }
    }
    if (field.key === 'name') {
      return { name: useGreaterThan ? { gt: rawValue } : { lt: rawValue } }
    }
    return { email: useGreaterThan ? { gt: rawValue } : { lt: rawValue } }
  }

  private createCursorEquality(key: SortableField, rawValue: string): Prisma.usersWhereInput {
    if (key === 'id') {
      return { id: { equals: this.resolveCursorId(rawValue) } }
    }
    if (key === 'name') {
      return { name: { equals: rawValue } }
    }
    return { email: { equals: rawValue } }
  }

  private resolveCursorId(rawValue: string): Prisma.Decimal {
    try {
      const decimal = new Prisma.Decimal(rawValue)
      if (!decimal.isFinite()) {
        throw new Error('Cursor value is not finite')
      }
      return decimal
    } catch {
      throw new BadRequestException('Invalid cursor')
    }
  }

  private getScanOrder(
    orderFields: SortField[],
    mode: CursorMode,
  ): Prisma.usersOrderByWithRelationInput[] {
    const scanFields = mode === 'before' ? this.invertDirections(orderFields) : orderFields
    return scanFields.map((field) => this.toPrismaOrderBy(field))
  }

  private toPrismaOrderBy(field: SortField): Prisma.usersOrderByWithRelationInput {
    if (field.key === 'id') {
      return { id: field.direction }
    }
    if (field.key === 'name') {
      return { name: field.direction }
    }
    return { email: field.direction }
  }

  private invertDirections(fields: SortField[]): SortField[] {
    return fields.map((field) => ({
      key: field.key,
      direction: field.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  private encodeCursor(
    row: { id: Prisma.Decimal; name: string; email: string },
    orderFields: SortField[],
    context: string,
  ): string {
    const values: Record<string, string> = {}
    for (const field of orderFields) {
      const value = row[field.key]
      values[field.key] = value instanceof Prisma.Decimal ? value.toString() : value
    }
    const payload: CursorPayload = {
      version: CURSOR_VERSION,
      context,
      values,
    }
    return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  }

  private decodeCursor(
    cursor: string,
    orderFields: SortField[],
    expectedContext: string,
  ): Record<string, string> {
    let payload: unknown
    try {
      payload = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'))
    } catch {
      throw new BadRequestException('Invalid cursor')
    }
    if (!this.isCursorPayload(payload) || payload.version !== CURSOR_VERSION) {
      throw new BadRequestException('Invalid cursor')
    }
    if (payload.context !== expectedContext) {
      throw new BadRequestException('Cursor does not match the requested sort and filter')
    }

    const expectedFields = orderFields.map((field) => field.key)
    const cursorFields = Object.keys(payload.values)
    if (
      cursorFields.length !== expectedFields.length ||
      !expectedFields.every((field) => typeof payload.values[field] === 'string')
    ) {
      throw new BadRequestException('Invalid cursor')
    }

    const values: Record<string, string> = {}
    for (const field of expectedFields) {
      const value = payload.values[field]
      if (typeof value !== 'string') {
        throw new BadRequestException('Invalid cursor')
      }
      values[field] = value
    }
    return values
  }

  private isCursorPayload(value: unknown): value is CursorPayload {
    return (
      this.isRecord(value) &&
      typeof value.version === 'number' &&
      typeof value.context === 'string' &&
      this.isRecord(value.values)
    )
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  private isSortableField(value: string): value is SortableField {
    return SORTABLE_FIELDS.some((field) => field === value)
  }

  private isSetFilterOperation(value: string): value is SetFilterOperation {
    return SET_FILTER_OPERATIONS.some((operation) => operation === value)
  }

  private isStringFilterOperation(value: string): value is StringFilterOperation {
    return (
      this.isSetFilterOperation(value) ||
      STRING_SCALAR_FILTER_OPERATIONS.some((operation) => operation === value)
    )
  }

  private isStringScalarFilterOperation(value: string): value is StringScalarFilterOperation {
    return STRING_SCALAR_FILTER_OPERATIONS.some((operation) => operation === value)
  }

  private isDecimalFilterOperation(value: string): value is DecimalFilterOperation {
    return (
      this.isSetFilterOperation(value) ||
      DECIMAL_SCALAR_FILTER_OPERATIONS.some((operation) => operation === value)
    )
  }

  private isDecimalScalarFilterOperation(value: string): value is DecimalScalarFilterOperation {
    return DECIMAL_SCALAR_FILTER_OPERATIONS.some((operation) => operation === value)
  }

  private isDecimalInput(value: unknown): value is string | number {
    return (
      (typeof value === 'string' && value.trim() !== '') ||
      (typeof value === 'number' && Number.isFinite(value))
    )
  }

  private toUserDto(user: { id: Prisma.Decimal; name: string; email: string }): UserDto {
    return {
      id: user.id.toNumber(),
      name: user.name,
      email: user.email,
    }
  }

  public convertFiltersToPrismaFormat(filterObj: FilterCondition[]): Prisma.usersWhereInput {
    const filters = filterObj.map((filter) => this.toPrismaFilter(filter))
    const onlyFilter = filters.at(0)
    if (filters.length === 0) {
      return {}
    }
    return filters.length === 1 && onlyFilter ? onlyFilter : { AND: filters }
  }

  private toPrismaFilter(filter: FilterCondition): Prisma.usersWhereInput {
    if (filter.key === 'id') {
      return { id: this.toDecimalPrismaFilter(filter) }
    }

    const stringFilter = this.toStringPrismaFilter(filter)
    return filter.key === 'name' ? { name: stringFilter } : { email: stringFilter }
  }

  private toStringPrismaFilter(filter: StringFilterCondition): Prisma.StringFilter {
    switch (filter.operation) {
      case 'like':
        return { contains: filter.value }
      case 'eq':
        return { equals: filter.value }
      case 'neq':
        return { not: filter.value }
      case 'gt':
        return { gt: filter.value }
      case 'gte':
        return { gte: filter.value }
      case 'lt':
        return { lt: filter.value }
      case 'lte':
        return { lte: filter.value }
      case 'in':
        return { in: filter.value }
      case 'notin':
        return { notIn: filter.value }
    }
  }

  private toDecimalPrismaFilter(filter: DecimalFilterCondition): Prisma.DecimalFilter {
    switch (filter.operation) {
      case 'eq':
        return { equals: filter.value }
      case 'neq':
        return { not: filter.value }
      case 'gt':
        return { gt: filter.value }
      case 'gte':
        return { gte: filter.value }
      case 'lt':
        return { lt: filter.value }
      case 'lte':
        return { lte: filter.value }
      case 'in':
        return { in: filter.value }
      case 'notin':
        return { notIn: filter.value }
    }
  }
}
