import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || jwtConstants.secret,
    });
  }

  async validate(jwtPayload: { sub: number; username: string }) {
    const { sub, username } = jwtPayload;
    const user = await this.usersService.findOne({
      where: { id: sub },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: sub, username };
  }
}
