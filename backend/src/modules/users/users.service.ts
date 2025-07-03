import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    private readonly users = []; // Mock database

  create(createUserDto: CreateUserDto) {
    // In a real app, you would hash the password here
    // before saving to the database.
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }
}
