
import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../auth/decorators/public.decorator';
import { LeaderboardPlayerDto } from './dto/leaderboard-player.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @Get('leaderboard')
  getLeaderboard(): Promise<LeaderboardPlayerDto[]> {
    return this.usersService.getLeaderboard();
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id/teams')
  findUserTeams(@Param('id') id: string) {
    return this.usersService.findUserTeams(id);
  }

  @Get(':id/gallery')
  findUserGallery(@Param('id') id: string) {
    return this.usersService.findUserGallery(id);
  }

  @Get(':id/career')
  findUserCareer(@Param('id') id: string) {
    return this.usersService.findUserCareer(id);
  }
}
