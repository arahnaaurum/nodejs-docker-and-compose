import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/auth.request';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() createWishDto: CreateWishDto,
  ) {
    return this.wishesService.create(+req.user.userId, createWishDto);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copyWish(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.wishesService.copyWish(+id, +req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return await this.wishesService.validateAndUpdate(
      +id,
      +req.user.userId,
      updateWishDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    await this.wishesService.validateAndDelete(+id, +req.user.userId);
  }
}
