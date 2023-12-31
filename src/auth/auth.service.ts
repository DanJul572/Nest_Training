import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto) {
    const user = await this.usersService.findByEmail(authDto.email);
    const validPassword = await compareSync(authDto.password, user.password);
    if (!user || !validPassword) {
      throw new UnauthorizedException('unauthorize');
    } else {
      const payload = { sub: user.id, username: user.email };
      const token = await this.jwtService.signAsync(payload, {
        secret: user.password,
      });
      delete user.password;
      return {
        ...user,
        token: token,
      };
    }
  }
}
