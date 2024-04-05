import { Injectable, NotAcceptableException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUser(email);
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user && passwordValid) {
      return {
        id: user.id,
        name: user.name,
        surname: user.surname,
      };
    }
    return null;
  }

  async login(user: any) {
    const payload = { name: user.name, surname: user.surname, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
