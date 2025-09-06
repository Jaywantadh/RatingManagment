import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('SYSTEM_ADMIN')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ): Promise<{ users: User[]; total: number }> {
    return this.usersService.findAll(page, limit, search);
  }

  @Get('stats')
  @Roles('SYSTEM_ADMIN')
  async getStats(): Promise<{ total: number; byRole: Record<string, number> }> {
    return this.usersService.getStats();
  }

  @Get(':id')
  @Roles('SYSTEM_ADMIN')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findById(id);
  }

  @Post()
  @Roles('SYSTEM_ADMIN')
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Put(':id')
  @Roles('SYSTEM_ADMIN')
  async update(
    @Param('id') id: number,
    @Body() userData: Partial<User>,
  ): Promise<User> {
    return this.usersService.update(id, userData);
  }

  @Delete(':id')
  @Roles('SYSTEM_ADMIN')
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    await this.usersService.delete(id);
    return { message: 'User deleted successfully' };
  }

  @Get('profile/me')
  async getProfile(@Request() req): Promise<User> {
    return this.usersService.findById(req.user.id);
  }

  @Put('profile/me')
  async updateProfile(
    @Request() req,
    @Body() userData: Partial<User>,
  ): Promise<User> {
    // Remove sensitive fields that shouldn't be updated via profile
    const { password, role, ...safeUserData } = userData;
    return this.usersService.update(req.user.id, safeUserData);
  }
}
