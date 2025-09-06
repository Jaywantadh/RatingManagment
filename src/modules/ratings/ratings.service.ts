import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rating, RatingValue } from './entities/rating.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{ ratings: Rating[]; total: number }> {
    const [ratings, total] = await this.ratingRepository.findAndCount({
      relations: ['user', 'store'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });
    
    return { ratings, total };
  }

  async findById(id: number): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({
      where: { id },
      relations: ['user', 'store'],
    });
    
    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
    
    return rating;
  }

  async findByStore(storeId: number): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: { store_id: storeId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: { user_id: userId },
      relations: ['store'],
      order: { created_at: 'DESC' },
    });
  }

  async create(ratingData: Partial<Rating>, userId: number): Promise<Rating> {
    // Check if user already rated this store
    const existingRating = await this.ratingRepository.findOne({
      where: { user_id: userId, store_id: ratingData.store_id },
    });
    
    if (existingRating) {
      throw new ConflictException('You have already rated this store');
    }
    
    const rating = this.ratingRepository.create({
      ...ratingData,
      user_id: userId,
    });
    
    return this.ratingRepository.save(rating);
  }

  async update(id: number, ratingData: Partial<Rating>, userId: number, userRole: string): Promise<Rating> {
    const rating = await this.findById(id);
    
    // Check if user can update this rating
    if (userRole !== 'SYSTEM_ADMIN' && rating.user_id !== userId) {
      throw new ForbiddenException('You can only update your own ratings');
    }
    
    Object.assign(rating, ratingData);
    return this.ratingRepository.save(rating);
  }

  async delete(id: number, userId: number, userRole: string): Promise<void> {
    const rating = await this.findById(id);
    
    // Check if user can delete this rating
    if (userRole !== 'SYSTEM_ADMIN' && rating.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own ratings');
    }
    
    await this.ratingRepository.remove(rating);
  }

  async getStoreStats(storeId: number): Promise<{
    totalRatings: number;
    averageRating: number;
    ratingDistribution: Record<string, number>;
  }> {
    const ratings = await this.findByStore(storeId);
    
    if (ratings.length === 0) {
      return {
        totalRatings: 0,
        averageRating: 0,
        ratingDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
      };
    }
    
    const totalRatings = ratings.length;
    const averageRating = ratings.reduce((sum, rating) => sum + parseInt(rating.rating_value), 0) / totalRatings;
    
    const ratingDistribution = {
      '1': ratings.filter(r => r.rating_value === RatingValue.ONE).length,
      '2': ratings.filter(r => r.rating_value === RatingValue.TWO).length,
      '3': ratings.filter(r => r.rating_value === RatingValue.THREE).length,
      '4': ratings.filter(r => r.rating_value === RatingValue.FOUR).length,
      '5': ratings.filter(r => r.rating_value === RatingValue.FIVE).length,
    };
    
    return {
      totalRatings,
      averageRating: Math.round(averageRating * 100) / 100,
      ratingDistribution,
    };
  }

  async getOverallStats(): Promise<{
    totalRatings: number;
    averageRating: number;
    totalStores: number;
    totalUsers: number;
  }> {
    const totalRatings = await this.ratingRepository.count();
    
    const result = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(CAST(rating.rating_value AS INTEGER))', 'averageRating')
      .getRawOne();
    
    const averageRating = parseFloat(result.averageRating) || 0;
    
    // Get unique stores and users
    const uniqueStores = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('COUNT(DISTINCT rating.store_id)', 'count')
      .getRawOne();
    
    const uniqueUsers = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('COUNT(DISTINCT rating.user_id)', 'count')
      .getRawOne();
    
    return {
      totalRatings,
      averageRating: Math.round(averageRating * 100) / 100,
      totalStores: parseInt(uniqueStores.count),
      totalUsers: parseInt(uniqueUsers.count),
    };
  }
}
