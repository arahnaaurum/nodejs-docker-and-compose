import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { IsString, Length, IsUrl, IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity({ name: 'wishlists' })
export class Wishlist extends BaseEntity {
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

  @IsOptional()
  @IsString()
  @Length(1, 1500)
  @Column({ type: 'varchar', length: 1500, nullable: true })
  description: string;

  @IsUrl()
  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ManyToMany(() => Wish, (wish) => wish.wishlists)
  items: Wish[];
}
