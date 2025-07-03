import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    // Handle special admin user case
    if (email === 'admin@example.com' && pass === 'superuser') {
        // This is a security risk for production, but acceptable for this prototype's backdoor.
        // It bypasses the DB check for the admin.
        return {
            id: 'admin-001',
            name: 'Superuser',
            email: 'admin@example.com',
            role: 'Администратор',
            avatar: 'https://placehold.co/100x100.png',
        };
    }
    
    const user = await this.usersService.findByEmailWithPassword(email);
    
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }
}
