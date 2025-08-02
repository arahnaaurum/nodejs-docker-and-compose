/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async create(userId: number, createWishlistDto: CreateWishlistDto) {
    const { itemsId } = createWishlistDto;
    const wishes = await this.wishesService.findMany({
      where: { id: In(itemsId) },
    });
    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      items: wishes,
      owner: { id: userId } as User,
    });
    return this.wishlistRepository.save(wishlist);
  }

  findAll() {
    return this.wishlistRepository.find();
  }

  findOne(query: FindOneOptions<Wishlist>) {
    return this.wishlistRepository.findOneOrFail(query);
  }

  findById(id: number) {
    return this.wishlistRepository.findOneOrFail({ where: { id } });
  }

  findMany(query: FindManyOptions<Wishlist>) {
    return this.wishlistRepository.find(query);
  }

  async updateOne(
    query: FindOneOptions<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.findOne(query);
    return this.wishlistRepository.save({ ...wishlist, ...updateWishlistDto });
  }

  async removeOne(query: FindOneOptions<Wishlist>) {
    const wishlist = await this.findOne(query);
    wishlist.items = [];
    await this.wishlistRepository.save(wishlist);
    return this.wishlistRepository.delete(wishlist.id);
  }

  async validateAndUpdate(
    wishlistId: number,
    userId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const query = {
      where: {
        id: wishlistId,
        owner: {
          id: userId,
        },
      },
    };

    try {
      await this.findOne(query);
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new UnauthorizedException(
          'У вас нет прав на удаление этой коллекции',
        );
      }
      throw error;
    }
    return await this.updateOne(query, updateWishlistDto);
  }

  async validateAndDelete(wishlistId: number, userId: number) {
    const query = {
      where: {
        id: wishlistId,
        owner: {
          id: userId,
        },
      },
      relations: ['items'],
    };
    try {
      await this.findOne(query);
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new UnauthorizedException(
          'У вас нет прав на удаление этой коллекции',
        );
      }
      throw error;
    }
    return this.removeOne(query);
  }
}
