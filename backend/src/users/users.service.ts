import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashValue } from 'src/helpers/hash';
import { WishesService } from 'src/wishes/wishes.service';
import { FindUsersDto } from './dto/find-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private wishesService: WishesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const user = this.userRepository.create({
      ...createUserDto,
      password: await hashValue(password),
    });
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(query: FindOneOptions<User>) {
    return this.userRepository.findOneOrFail(query);
  }

  findByUsername(username: string) {
    return this.userRepository.findOneOrFail({ where: { username } });
  }

  findOwn(id: number) {
    return this.userRepository.findOneOrFail({
      where: { id },
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findMany(findUsersDto: FindUsersDto) {
    return this.userRepository.find({
      where: [
        { username: ILike(`%${findUsersDto.query}%`) },
        { email: ILike(`%${findUsersDto.query}%`) },
      ],
    });
  }

  async updateOne(query: FindOneOptions<User>, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    await this.userRepository.update(query.where!, updateUserDto);
    return this.findOne(query);
  }

  async updateOwn(id: number, updateUserDto: UpdateUserDto) {
    return this.updateOne(
      {
        where: { id },
        select: {
          username: true,
          about: true,
          avatar: true,
          email: true,
        },
      },
      updateUserDto,
    );
  }

  async removeOne(query: FindOneOptions<User>) {
    const user = await this.findOne(query);
    return this.userRepository.delete(user.id);
  }

  getWishes(username: string) {
    return this.wishesService.findMany({
      where: {
        owner: {
          username,
        },
      },
    });
  }

  getOwnWishes(id: number) {
    return this.wishesService.findMany({
      where: {
        owner: {
          id,
        },
      },
      relations: ['offers'],
    });
  }
}
