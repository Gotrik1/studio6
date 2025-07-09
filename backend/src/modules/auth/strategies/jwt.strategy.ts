import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../users/users.service";
import { Role } from "@prisma/client";

const roleMap: { [key: string]: Role } = {
  Игрок: Role.PLAYER,
  Капитан: Role.CAPTAIN,
  Тренер: Role.COACH,
  Организатор: Role.ORGANIZER,
  Судья: Role.JUDGE,
  Менеджер: Role.MANAGER,
  Болельщик: Role.FAN,
  Модератор: Role.MODERATOR,
  Администратор: Role.ADMINISTRATOR,
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    // Convert cyrillic role from token payload to prisma enum role for internal use
    const prismaRole = roleMap[payload.role] || user.role;

    // This object will be attached to req.user
    return { userId: user.id, name: user.name, role: prismaRole };
  }
}
