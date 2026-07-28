import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  HttpException,
} from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { DEFAULT_LIMIT, MAX_LIMIT, UsersService } from './users.service'
import type { SearchUsersResult } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  findAll(): Promise<UserDto[]> {
    return this.usersService.findAll()
  }

  @Get('search') // it must be ahead of the below Get(":id") to avoid conflict
  @ApiOperation({
    summary: 'Search users with cursor-based pagination',
    description:
      'Uses keyset pagination. Reuse returned cursors only with the same sort and filter; direct page-number jumps are intentionally unsupported. See [Prisma cursor-based pagination](https://www.prisma.io/docs/orm/v6/prisma-client/queries/pagination#cursor-based-pagination).',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: `Page size (default ${DEFAULT_LIMIT}, max ${MAX_LIMIT})`,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'JSON array of sort fields, ex: [{"name":"desc"},{"id":"asc"}]',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    description:
      'JSON array of filter conditions, ex: [{"key":"name","operation":"like","value":"Jo"}]',
  })
  @ApiQuery({
    name: 'after',
    required: false,
    description: 'Opaque cursor: fetch the page immediately after this position',
  })
  @ApiQuery({
    name: 'before',
    required: false,
    description: 'Opaque cursor: fetch the page immediately before this position',
  })
  @ApiQuery({
    name: 'includeTotalCount',
    required: false,
    description: 'Set to "true" to also compute total/totalPages (runs an extra COUNT query)',
  })
  async searchUsers(
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Query('filter') filter?: string,
    @Query('after') after?: string,
    @Query('before') before?: string,
    @Query('includeTotalCount') includeTotalCount?: string,
  ): Promise<SearchUsersResult> {
    return this.usersService.searchUsers(limit, sort, filter, after, before, includeTotalCount)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id)
    if (!user) {
      throw new HttpException('User not found.', 404)
    }
    return user
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
