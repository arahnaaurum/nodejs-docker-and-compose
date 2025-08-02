import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(userId: number, createOfferDto: CreateOfferDto) {
    const { amount, itemId } = createOfferDto;
    const wish = await this.wishesService.findOne({
      where: { id: itemId },
      relations: ['owner'],
    });
    if (wish.owner.id === userId) {
      throw new BadRequestException(
        'Нельзя скидываться на собственный подарок',
      );
    }
    if (amount > wish.price - wish.raised) {
      throw new BadRequestException(
        'Предложение больше оставшейся стоимости подарка',
      );
    }
    const offer = this.offerRepository.create({
      ...createOfferDto,
      item: wish,
      user: { id: userId } as User,
    });
    await this.wishesService.updateRaisedSumm(itemId, wish.raised + amount);
    return this.offerRepository.save(offer);
  }

  findAll() {
    return this.offerRepository.find();
  }

  findOne(query: FindOneOptions<Offer>) {
    return this.offerRepository.findOneOrFail(query);
  }

  findById(id: number) {
    return this.offerRepository.findOneOrFail({ where: { id } });
  }

  findMany(query: FindManyOptions<Offer>) {
    return this.offerRepository.find(query);
  }

  async updateOne(
    query: FindOneOptions<Offer>,
    updateOfferDto: UpdateOfferDto,
  ) {
    const offer = await this.findOne(query);
    return this.offerRepository.save({ ...offer, ...updateOfferDto });
  }

  async removeOne(query: FindOneOptions<Offer>) {
    const offer = await this.findOne(query);
    return this.offerRepository.delete(offer.id);
  }
}
