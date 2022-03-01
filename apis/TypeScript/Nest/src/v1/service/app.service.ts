import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {randomUUID} from "crypto";

@Injectable()
export class AppService {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (user) {
      return user;
    } else {
      throw new HttpException(
        `User with id '${id}' is not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async save(user: User): Promise<User> {
    try {
      const userModel: User = {
        ...user,
        userId: randomUUID(),
      };

      return await this.usersRepository.save(userModel);
    } catch (err) {
      Logger.error(err);
      // since we have errors lets rollback the changes we made
    } finally {
      // you need to release a queryRunner which was manually instantiated
    }
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
