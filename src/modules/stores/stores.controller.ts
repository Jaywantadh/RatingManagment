import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { StoresService } from './stores.service';
import { Store } from './entities/store.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ): Promise<{ stores: Store[]; total: number }> {
    try {
      console.log('GET /stores called with:', { page, limit, search });
      
      if (search) {
        return this.storesService.searchStores(search, page, limit);
      }
      return this.storesService.findAll(page, limit, search);
    } catch (error) {
      console.error('Error in stores controller:', error);
      throw error;
    }
  }

  @Get('test')
  async test(): Promise<{ message: string; count: number }> {
    try {
      const count = await this.storesService.storeRepository.count();
      return { message: 'Stores API is working', count };
    } catch (error) {
      console.error('Test endpoint error:', error);
      throw error;
    }
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SYSTEM_ADMIN')
  async getStats(): Promise<{ total: number; totalRatings: number; averageRating: number }> {
    return this.storesService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Store> {
    return this.storesService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('STORE_OWNER', 'SYSTEM_ADMIN')
  async create(
    @Body() storeData: Partial<Store>,
    @Request() req,
  ): Promise<Store> {
    return this.storesService.create(storeData, req.user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('STORE_OWNER', 'SYSTEM_ADMIN')
  async update(
    @Param('id') id: number,
    @Body() storeData: Partial<Store>,
    @Request() req,
  ): Promise<Store> {
    return this.storesService.update(id, storeData, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('STORE_OWNER', 'SYSTEM_ADMIN')
  async delete(
    @Param('id') id: number,
    @Request() req,
  ): Promise<{ message: string }> {
    await this.storesService.delete(id, req.user.id, req.user.role);
    return { message: 'Store deleted successfully' };
  }

  @Get('owner/my-stores')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('STORE_OWNER')
  async getMyStores(@Request() req): Promise<Store[]> {
    return this.storesService.findByOwner(req.user.id);
  }
}
