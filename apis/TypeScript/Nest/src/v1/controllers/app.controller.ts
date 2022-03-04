import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { AppService } from '../service/app.service';
import { User } from '../entities/user.entity';
import { Response } from 'express';
import { Roles } from 'nest-keycloak-connect';
import { ApiBearerAuth } from '@nestjs/swagger';

/**
 * AppController - Controller for the app needs to be named with version for swagger UI to work.
 */
@ApiBearerAuth()
@Controller('/api/v1/user')
export class AppControllerV1 {
  constructor(private readonly appService: AppService) {}

  @Get('/:id')
  @Roles({ roles: [] })
  async getUserByID(@Param('id') id: string): Promise<User> {
    return this.appService.findOne(id);
  }
  @Post()
  @Roles({ roles: [] })
  async create(
    @Body() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    if (user.userId) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY);
      res.json({
        message: 'User ID cannot be set',
      });
    } else {
      const createdUser = await this.appService.save(user);
      Logger.log(`User ${createdUser.userId} created`);
      res.status(HttpStatus.CREATED);
      return createdUser;
    }
  }

  @Put('/:id')
  @Roles({ roles: [] })
  async update(
    @Param('id') id: string,
    @Body() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const existingUser = await this.appService.findOne(id);
    if (existingUser && user.userId === id) {
      res.status(HttpStatus.OK);
      user.userId = id;
      return this.appService.save(user);
    } else {
      res.status(HttpStatus.NOT_FOUND);
    }
  }

  @Delete('/:id')
  @Roles({ roles: [] })
  async remove(@Param('id') id: string): Promise<void> {
    return this.appService.remove(id);
  }
}
