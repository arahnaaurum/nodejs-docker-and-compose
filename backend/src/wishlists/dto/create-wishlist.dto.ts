import { PickType } from '@nestjs/mapped-types';
import { Wishlist } from '../entities/wishlist.entity';
import {
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  IsInt,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWishlistDto extends PickType(Wishlist, [
  'name',
  'image',
  'description',
]) {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @Type(() => Number)
  itemsId: number[];
}
