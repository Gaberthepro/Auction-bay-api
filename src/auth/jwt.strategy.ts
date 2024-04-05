import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret', // put this to env
    });
  }

  async validate(payload: any) {
    //getuser from user service
    return {
      id: payload.sub,
      name: payload.name,
      surname: payload.surname,
    };
  }
}
