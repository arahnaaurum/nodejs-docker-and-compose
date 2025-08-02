/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { exclude } from 'src/helpers/exclude';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(userId: number, createWishDto: CreateWishDto) {
    const wish = this.wishRepository.create({
      ...createWishDto,
      owner: { id: userId } as User,
    });
    return this.wishRepository.save(wish);
  }

  findAll() {
    return this.wishRepository.find();
  }

  findOne(query: FindOneOptions<Wish>) {
    return this.wishRepository.findOneOrFail(query);
  }

  findById(id: number) {
    return this.wishRepository.findOneOrFail({
      where: { id },
      relations: ['owner', 'offers'],
    });
  }

  findMany(query: FindManyOptions<Wish>) {
    return this.wishRepository.find(query);
  }

  findLast() {
    return this.findMany({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner'],
    });
  }

  findTop() {
    return this.findMany({
      order: { copied: 'DESC' },
      take: 20,
      relations: ['owner'],
    });
  }

  async updateOne(query: FindOneOptions<Wish>, updateWishDto: UpdateWishDto) {
    await this.wishRepository.update(query.where!, updateWishDto);
    return this.findOne(query);
  }

  async removeOne(query: FindOneOptions<Wish>) {
    const wish = await this.findOne(query);
    return this.wishRepository.delete(wish.id);
  }

  async validateAndUpdate(
    wishId: number,
    userId: number,
    updateWishDto: UpdateWishDto,
  ) {
    const query = {
      where: {
        id: wishId,
        owner: {
          id: userId,
        },
      },
    };
    try {
      const wish = await this.findOne(query);
      if (
        wish.raised > 0 &&
        ('price' in updateWishDto || 'description' in updateWishDto)
      ) {
        throw new UnauthorizedException(
          'Цену и описание этого подарка уже нельзя редактировать',
        );
      }
    } catch (error) {
      if (error.name === 'EntityNotFoundError') {
        throw new UnauthorizedException(
          'У вас нет прав на редактирование этого подарка',
        );
      }
      throw error;
    }
    return await this.updateOne(query, updateWishDto);
  }

  async validateAndDelete(wishId: number, userId: number) {
    const query = {
      where: {
        id: wishId,
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
          'У вас нет прав на удаление этого подарка',
        );
      }
      throw error;
    }
    return this.removeOne(query);
  }

  async copyWish(wishId: number, userId: number) {
    const wish = await this.findOne({
      where: { id: wishId },
      select: {
        name: true,
        link: true,
        image: true,
        price: true,
        description: true,
        copied: true,
      },
    });
    await this.wishRepository.update(
      { id: wishId },
      { copied: (wish.copied || 0) + 1 },
    );
    return this.create(userId, exclude(wish, ['copied']));
  }

  async updateRaisedSumm(id: number, raised: number) {
    await this.wishRepository.update({ id }, { raised });
  }
}
