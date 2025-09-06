import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    public storeRepository: Repository<Store>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ stores: Store[]; total: number }> {
    console.log('Finding stores with page:', page, 'limit:', limit, 'search:', search);
    
    // Get stores with owner and ratings relationships
    const stores = await this.storeRepository.find({
      relations: ['owner', 'ratings', 'ratings.user'],
      order: { created_at: 'DESC' }
    });
    
    console.log('Stores with relations:', stores.length);
    
    // Calculate rating statistics for each store
    const storesWithStats = stores.map(store => {
      const ratings = store.ratings || [];
      const total_ratings = ratings.length;
      let average_rating = 0;
      
      if (total_ratings > 0) {
        const sum = ratings.reduce((acc, rating) => acc + parseInt(rating.rating_value), 0);
        average_rating = sum / total_ratings;
      }
      
      return {
        ...store,
        total_ratings,
        average_rating: parseFloat(average_rating.toFixed(1)),
        owner_name: store.owner?.name || 'Unknown'
      };
    });
    
    return {
      stores: storesWithStats,
      total: storesWithStats.length
    };
  }

  async findById(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['owner', 'ratings', 'ratings.user'],
    });
    
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    
    return store;
  }

  async findByOwner(ownerId: number): Promise<Store[]> {
    console.log('Finding stores for owner:', ownerId);
    
    // Get stores with owner and ratings relationships
    const stores = await this.storeRepository.find({
      where: { owner_id: ownerId },
      relations: ['owner', 'ratings', 'ratings.user'],
      order: { created_at: 'DESC' }
    });
    
    console.log('Owner stores with relations:', stores.length);
    
    // Calculate rating statistics for each store
    const storesWithStats = stores.map(store => {
      const ratings = store.ratings || [];
      const total_ratings = ratings.length;
      let average_rating = 0;
      
      if (total_ratings > 0) {
        const sum = ratings.reduce((acc, rating) => acc + parseInt(rating.rating_value), 0);
        average_rating = sum / total_ratings;
      }
      
      return {
        ...store,
        total_ratings,
        average_rating: parseFloat(average_rating.toFixed(1)),
        owner_name: store.owner?.name || 'Unknown'
      };
    });
    
    return storesWithStats;
  }

  async create(storeData: Partial<Store>, ownerId: number): Promise<Store> {
    const store = this.storeRepository.create({
      ...storeData,
      owner_id: ownerId,
    });
    
    return this.storeRepository.save(store);
  }

  async update(id: number, storeData: Partial<Store>, userId: number, userRole: string): Promise<Store> {
    const store = await this.findById(id);
    
    // Check if user can update this store
    if (userRole !== 'SYSTEM_ADMIN' && store.owner_id !== userId) {
      throw new ForbiddenException('You can only update your own stores');
    }
    
    Object.assign(store, storeData);
    return this.storeRepository.save(store);
  }

  async delete(id: number, userId: number, userRole: string): Promise<void> {
    const store = await this.findById(id);
    
    // Check if user can delete this store
    if (userRole !== 'SYSTEM_ADMIN' && store.owner_id !== userId) {
      throw new ForbiddenException('You can only delete your own stores');
    }
    
    await this.storeRepository.remove(store);
  }

  async getStats(): Promise<{ total: number; totalRatings: number; averageRating: number }> {
    const total = await this.storeRepository.count();
    
    const result = await this.storeRepository
      .createQueryBuilder('store')
      .leftJoin('store.ratings', 'rating')
      .select('COUNT(DISTINCT store.id)', 'total')
      .addSelect('COUNT(rating.id)', 'totalRatings')
      .addSelect('AVG(rating.rating_value::text::integer)', 'averageRating')
      .getRawOne();
    
    return {
      total: parseInt(result.total),
      totalRatings: parseInt(result.totalRatings),
      averageRating: parseFloat(result.averageRating) || 0,
    };
  }

  async searchStores(query: string, page: number = 1, limit: number = 10): Promise<{ stores: Store[]; total: number }> {
    const queryBuilder = this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.owner', 'owner')
      .leftJoinAndSelect('store.ratings', 'ratings')
      .where('store.name ILIKE :query OR store.address ILIKE :query', { query: `%${query}%` });
    
    const [stores, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('store.name', 'ASC')
      .getManyAndCount();
    
    return { stores, total };
  }
}
