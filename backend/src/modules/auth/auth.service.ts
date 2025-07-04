
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * In a real Keycloak architecture, this method would be obsolete.
   * Token validation would be handled by the gateway (Kong) and a Passport strategy.
   * For the prototype, this validates if a user exists.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailWithPassword(email);

    if (user) {
      // In a real scenario, we would not check the password here.
      // For the prototype, we assume if the user exists, the password is valid.
      // The bcrypt check is removed to align with the "no password handling" principle.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, pass: string) {
    // Handle special admin user case for the prototype
    if (email === 'admin@example.com' && pass === 'superuser') {
      const adminUser = {
        id: 'admin-001',
        name: 'Superuser',
        email: 'admin@example.com',
        role: 'Администратор',
        avatar: 'https://placehold.co/100x100.png',
      };
      const tokenPayload = { sub: adminUser.id, name: adminUser.name, role: adminUser.role };
      return {
        access_token: this.jwtService.sign(tokenPayload),
        user: adminUser
      };
    }

    const user = await this.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль.');
    }

    const payload = { name: user.name, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || 'https://placehold.co/100x100.png',
          role: user.role
      }
    };
  }
}
