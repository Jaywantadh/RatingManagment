import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RatingsService } from './ratings.service';
import { Rating } from './entities/rating.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SYSTEM_ADMIN')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ ratings: Rating[]; total: number }> {
    return this.ratingsService.findAll(page, limit);
  }

  @Get('stats/overall')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SYSTEM_ADMIN')
  async getOverallStats(): Promise<{
    totalRatings: number;
    averageRating: number;
    totalStores: number;
    totalUsers: number;
  }> {
    return this.ratingsService.getOverallStats();
  }

  @Get('store/:storeId')
  async findByStore(@Param('storeId') storeId: number): Promise<Rating[]> {
    return this.ratingsService.findByStore(storeId);
  }

  @Get('store/:storeId/stats')
  async getStoreStats(@Param('storeId') storeId: number): Promise<{
    totalRatings: number;
    averageRating: number;
    ratingDistribution: Record<string, number>;
  }> {
    return this.ratingsService.getStoreStats(storeId);
  }

  @Get('user/my-ratings')
  @UseGuards(AuthGuard('jwt'))
  async getMyRatings(@Request() req): Promise<Rating[]> {
    return this.ratingsService.findByUser(req.user.id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('NORMAL_USER', 'SYSTEM_ADMIN')
  async create(
    @Body() ratingData: Partial<Rating>,
    @Request() req,
  ): Promise<Rating> {
    return this.ratingsService.create(ratingData, req.user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('NORMAL_USER', 'SYSTEM_ADMIN')
  async update(
    @Param('id') id: number,
    @Body() ratingData: Partial<Rating>,
    @Request() req,
  ): Promise<Rating> {
    return this.ratingsService.update(id, ratingData, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('NORMAL_USER', 'SYSTEM_ADMIN')
  async delete(
    @Param('id') id: number,
    @Request() req,
  ): Promise<{ message: string }> {
    await this.ratingsService.delete(id, req.user.id, req.user.role);
    return { message: 'Rating deleted successfully' };
  }
}
