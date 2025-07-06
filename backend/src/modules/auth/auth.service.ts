import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Logs in a user.
   * NOTE: This is a prototype implementation. In a real Keycloak architecture,
   * the backend would not handle passwords. The API gateway would validate the JWT,
   * and this service might handle token exchange or simply trust the validated token.
   * This implementation simulates a successful login for any existing user for development purposes.
   */
  async login(email: string, pass: string) {
    // Handle special admin user case for the prototype
    if (email === "admin@example.com" && pass === "superuser") {
      const adminUser = {
        id: "admin-001",
        name: "Superuser",
        email: "admin@example.com",
        role: "Администратор",
        avatar: "https://placehold.co/100x100.png",
        status: "Активен",
        xp: 99999,
      };
      const tokenPayload = {
        sub: adminUser.id,
        name: adminUser.name,
        role: adminUser.role,
      };
      return {
        access_token: this.jwtService.sign(tokenPayload),
        user: adminUser,
      };
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Неверный email или пароль.");
    }

    const payload = { name: user.name, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "https://placehold.co/100x100.png",
        role: user.role,
        status: user.status,
        xp: user.xp,
      },
    };
  }
}
