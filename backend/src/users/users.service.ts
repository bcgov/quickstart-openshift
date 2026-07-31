import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
import { SearchUsersQueryDto } from './dto/search-users-query.dto'
import { Prisma } from '../../generated/prisma/client.js'

type UserField = 'id' | 'name' | 'email'
type FilterOperation =
  'like' | 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'notin' | 'isnull'
type UserSearchFilter = { key: UserField; operation: FilterOperation; value: unknown }
type RawUserSearchFilter = { key: string; operation: string; value: unknown }

export type UserSearchResult = {
  users: UserDto[]
  page: number
  limit: number
  total: number
  totalPages: number
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
    const users = await this.prisma.users.findMany()
    return users.map((user) => this.toUserDto(user))
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.prisma.users.findUnique({
      where: {
        id: new Prisma.Decimal(id),
      },
    })
    if (!user) {
      throw new NotFoundException(`User #${id} not found`)
    }
    return this.toUserDto(user)
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    try {
      const user = await this.prisma.users.update({
        where: {
          id: new Prisma.Decimal(id),
        },
        data: updateUserDto,
      })
      return this.toUserDto(user)
    } catch (error) {
      this.throwIfUserNotFound(error, id)
      throw error
    }
  }

  async remove(id: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.prisma.users.delete({
        where: {
          id: new Prisma.Decimal(id),
        },
      })
      return { deleted: true }
    } catch (error) {
      this.throwIfUserNotFound(error, id)
      throw error
    }
  }

  async searchUsers(query: SearchUsersQueryDto): Promise<UserSearchResult> {
    const { page, limit } = query
    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 200
    ) {
      throw new BadRequestException('Invalid query parameters')
    }
    const sortObj = this.parseSort(query.sort)
    const filterObj = this.parseFilters(query.filter)
    const where = this.convertFiltersToPrismaFormat(filterObj)

    const [users, count] = await Promise.all([
      this.prisma.users.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortObj,
        where,
      }),
      this.prisma.users.count({ where }),
    ])

    return {
      users: users.map((user) => this.toUserDto(user)),
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    }
  }

  public convertFiltersToPrismaFormat(
    filterObj: ReadonlyArray<RawUserSearchFilter>,
  ): Prisma.usersWhereInput {
    const prismaFilterObj: Prisma.usersWhereInput = {}

    for (const item of filterObj) {
      const filter = this.validateFilter(item)
      Object.assign(prismaFilterObj, {
        [filter.key]: this.toPrismaFilter(filter),
      })
    }
    return prismaFilterObj
  }

  private toUserDto(user: { id: { toNumber(): number }; name: string; email: string }): UserDto {
    return {
      id: user.id.toNumber(),
      name: user.name,
      email: user.email,
    }
  }

  private parseSort(sort: string): Prisma.usersOrderByWithRelationInput[] {
    const parsed: unknown = this.parseJson(sort)
    const entries = Array.isArray(parsed) ? parsed : [parsed]

    return entries.map((entry) => {
      if (!this.isRecord(entry) || Object.keys(entry).length === 0) {
        throw new BadRequestException('Invalid query parameters')
      }

      const order: Prisma.usersOrderByWithRelationInput = {}
      for (const [key, value] of Object.entries(entry)) {
        const normalizedValue = this.normalizeSortOrder(value)
        if (!this.isUserField(key) || normalizedValue === null) {
          throw new BadRequestException('Invalid query parameters')
        }
        Object.assign(order, { [key]: normalizedValue })
      }
      return order
    })
  }

  private parseFilters(filter: string): UserSearchFilter[] {
    const parsed: unknown = this.parseJson(filter)
    if (!Array.isArray(parsed)) {
      throw new BadRequestException('Invalid query parameters')
    }

    return parsed.map((item) => {
      if (
        !this.isRecord(item) ||
        typeof item.key !== 'string' ||
        typeof item.operation !== 'string'
      ) {
        throw new BadRequestException('Invalid query parameters')
      }
      return this.validateFilter({
        key: item.key,
        operation: item.operation,
        value: item.value,
      })
    })
  }

  private parseJson(value: string): unknown {
    try {
      return JSON.parse(value)
    } catch {
      throw new BadRequestException('Invalid query parameters')
    }
  }

  private validateFilter(filter: RawUserSearchFilter): UserSearchFilter {
    if (!this.isUserField(filter.key) || !this.isFilterOperation(filter.operation)) {
      throw new BadRequestException('Invalid query parameters')
    }
    if (
      (filter.operation === 'in' || filter.operation === 'notin') &&
      !Array.isArray(filter.value)
    ) {
      throw new BadRequestException('Invalid query parameters')
    }
    if (filter.operation === 'like' && (filter.key === 'id' || typeof filter.value !== 'string')) {
      throw new BadRequestException('Invalid query parameters')
    }
    return {
      key: filter.key,
      operation: filter.operation,
      value: filter.value,
    }
  }

  private toPrismaFilter(filter: UserSearchFilter): Record<string, unknown> {
    switch (filter.operation) {
      case 'like':
        return { contains: filter.value }
      case 'eq':
        return { equals: filter.value }
      case 'neq':
        return { not: { equals: filter.value } }
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
        return { not: { in: filter.value } }
      case 'isnull':
        return { equals: null }
    }
  }

  private throwIfUserNotFound(error: unknown, id: number): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundException(`User #${id} not found`)
    }
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  private isUserField(value: string): value is UserField {
    return value === 'id' || value === 'name' || value === 'email'
  }

  private isFilterOperation(value: string): value is FilterOperation {
    return (
      value === 'like' ||
      value === 'eq' ||
      value === 'neq' ||
      value === 'gt' ||
      value === 'gte' ||
      value === 'lt' ||
      value === 'lte' ||
      value === 'in' ||
      value === 'notin' ||
      value === 'isnull'
    )
  }

  private normalizeSortOrder(value: unknown): Prisma.SortOrder | null {
    if (value === 'asc' || value === 'ASC') {
      return 'asc'
    }
    if (value === 'desc' || value === 'DESC') {
      return 'desc'
    }
    return null
  }
}
