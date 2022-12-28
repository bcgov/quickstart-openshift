import {Body, Controller, Delete, Get, Header, Param, Patch, Post,} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@ApiTags("users")
@Controller("/users")

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Header('content-type', 'application/json')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Header('content-type', 'application/json')
  async findAll() {
    const users = await this.usersService.findAll();
    if(users && users.length > 0){
      return users;
    }
    return [];
  }

  @Get(":id")
  @Header('content-type', 'application/json')
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @Header('content-type', 'application/json')
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @Header('content-type', 'application/json')
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
