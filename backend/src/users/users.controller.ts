import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/auth.request';
import { FindUsersDto } from './dto/find-users.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findOwn(@Req() req: AuthenticatedRequest) {
    return this.usersService.findOwn(+req.user.userId);
  }

  @Patch('me')
  update(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateOwn(+req.user.userId, updateUserDto);
  }

  @Get('me/wishes')
  getOwnWishes(@Req() req: AuthenticatedRequest) {
    return this.usersService.getOwnWishes(+req.user.userId);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  getWishes(@Param('username') username: string) {
    return this.usersService.getWishes(username);
  }

  @Post('find')
  findMany(@Body() findUsersDto: FindUsersDto) {
    return this.usersService.findMany(findUsersDto);
  }
}
