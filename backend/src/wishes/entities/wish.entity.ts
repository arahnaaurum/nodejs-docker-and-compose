import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import {
  IsString,
  Length,
  IsUrl,
  IsNumber,
  IsInt,
  IsOptional,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Entity({ name: 'wishes' })
export class Wish extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @IsString()
  @Length(1, 250)
  @Column({ type: 'varchar', length: 250 })
  name: string;

  @IsUrl()
  @Column()
  link: string;

  @IsUrl()
  @Column()
  image: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Column()
  price: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Column({ default: 0 })
  raised: number;

  @IsString()
  @Length(1, 1024)
  @Column({ type: 'varchar', length: 1024 })
  description: string;

  @IsOptional()
  @IsInt()
  @Column({ default: 0 })
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  @JoinTable()
  wishlists: Wishlist[];
}
