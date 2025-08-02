import { PickType } from '@nestjs/mapped-types';
import { Offer } from '../entities/offer.entity';
import { IsInt, IsPositive } from 'class-validator';

export class CreateOfferDto extends PickType(Offer, ['amount', 'hidden']) {
  @IsInt()
  @IsPositive()
  itemId: number;
}
