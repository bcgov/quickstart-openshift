import {HttpException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, SelectQueryBuilder} from "typeorm";
import {Users} from "./entities/users.entity";

import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>
  ) {
  }

  async create(user: CreateUserDto): Promise<Users> {
    const newUser = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async findOne(id: any): Promise<Users> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    await this.usersRepository.update({id}, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.usersRepository.delete(id);
      return {deleted: true};
    } catch (err) {
      return {deleted: false, message: err.message};
    }
  }

  async searchUsers(page: number,
                    limit: number,
                    sort: string, // JSON string to store sort key and sort value, ex: {name: "ASC"}
                    filter: string): Promise<any> { // JSON array for key, operation and value, ex: [{key: "name", operation: "like", value: "Peter"}]


    page = page || 1; // default page is 1
    if (!limit || limit > 200) {
      limit = 10; // default limit is 10 for no value or value > 200
    }

    const queryBuilder = this.usersRepository.createQueryBuilder('users');
    if (filter) {
      this.setFilter(filter, queryBuilder);
    }
    if (sort) {
      this.setSort(sort, queryBuilder);
    }
    // Apply pagination condition
    queryBuilder.skip((page - 1) * limit).take(limit);
    const [users, count] = await queryBuilder.getManyAndCount();
    return {
      users,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    };
  }

  private setSort(sort: string, queryBuilder: SelectQueryBuilder<Users>) {
    let sortObj;
    try {
      sortObj = JSON.parse(sort);
    } catch (e) {
      throw new HttpException("Invalid query parameters as sort", 400);
    }
    Object.keys(sortObj).forEach((item, index) => {
      if (index === 0) {
        queryBuilder.orderBy(`users.${item}`, sortObj[item]);
      } else {
        queryBuilder.addOrderBy(`users.${item}`, sortObj[item]);
      }
    });
  }

  private setFilter(filter: string, queryBuilder: SelectQueryBuilder<Users>) {
    let filterObj;
    try {
      filterObj = JSON.parse(filter);
    } catch (e) {
      throw new HttpException("Invalid query parameters as filter", 400);
    }
    for (const item of filterObj) {
      if (item.operation === "like") {
        queryBuilder.andWhere(`users.${item.key} ${item.operation} :${item.key}`, {[item.key]: `%${item.value}%`});
      } else {
        queryBuilder.andWhere(`users.${item.key} ${item.operation} :${item.key}`, {[item.key]: item.value});
      }
    }
  }
}
