import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDto } from "./dto/user.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService
  ) {
  }

  async create(user: CreateUserDto): Promise<UserDto> {
    const savedUser = await this.prisma.users.create({
      data: {
        name: user.name,
        email: user.email
      }
    });

    return {
      id: savedUser.id.toNumber(),
      name: savedUser.name,
      email: savedUser.email
    };
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.prisma.users.findMany();
    return users.flatMap(user => {
      const userDto: UserDto = {
        id: user.id.toNumber(),
        name: user.name,
        email: user.email
      };
      return userDto;
    });
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.prisma.users.findUnique({
      where: {
        id: new Prisma.Decimal(id)
      }
    });
    return {
      id: user.id.toNumber(),
      name: user.name,
      email: user.email
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.prisma.users.update({
      where: {
        id: new Prisma.Decimal(id)
      },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email
      }
    });
    return {
      id: user.id.toNumber(),
      name: user.name,
      email: user.email
    };
  }

  async remove(id: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.prisma.users.delete({
        where: {
          id: new Prisma.Decimal(id)
        }
      });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }

  async searchUsers(page: number,
                    limit: number,
                    sort: string, // JSON string to store sort key and sort value, ex: [{"name":"desc"},{"email":"asc"}]
                    filter: string // JSON array for key, operation and value, ex: [{"key": "name", "operation": "like", "value": "Jo"}]
  ): Promise<any> {

    page = page || 1;
    if (!limit || limit > 200) {
      limit = 10;
    }

    let sortObj=[];
    let filterObj = {};
    try {
      sortObj = JSON.parse(sort);
      filterObj = JSON.parse(filter);
    } catch (e) {
      throw new Error("Invalid query parameters");
    }
    const users = await this.prisma.users.findMany({
      skip: (page - 1) * limit,
      take: parseInt(String(limit)),
      orderBy: sortObj,
      where: this.convertFiltersToPrismaFormat(filterObj)
    });

    const count = await this.prisma.users.count({
      orderBy: sortObj,
      where: this.convertFiltersToPrismaFormat(filterObj)
    });

    return {
      users,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    };
  }

  public convertFiltersToPrismaFormat(filterObj): any {

    let prismaFilterObj = {};

    for (const item of filterObj) {

      if (item.operation === "like") {
        prismaFilterObj[item.key] = { contains: item.value };
      } else if (item.operation === "eq") {
        prismaFilterObj[item.key] = { equals: item.value };
      } else if (item.operation === "neq") {
        prismaFilterObj[item.key] = { not: { equals: item.value } };
      } else if (item.operation === "gt") {
        prismaFilterObj[item.key] = { gt: item.value };
      } else if (item.operation === "gte") {
        prismaFilterObj[item.key] = { gte: item.value };
      } else if (item.operation === "lt") {
        prismaFilterObj[item.key] = { lt: item.value };
      } else if (item.operation === "lte") {
        prismaFilterObj[item.key] = { lte: item.value };
      } else if (item.operation === "in") {
        prismaFilterObj[item.key] = { in: item.value };
      } else if (item.operation === "notin") {
        prismaFilterObj[item.key] = { not: { in: item.value } };
      } else if (item.operation === "isnull") {
        prismaFilterObj[item.key] = { equals: null };
      }
    }
    return prismaFilterObj;
  }
}
