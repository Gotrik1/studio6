
import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../auth/decorators/public.decorator';
import { LeaderboardPlayerDto } from './dto/leaderboard-player.dto';
import { ApiOperation, ApiQuery, ApiTags, ApiResponse } from '@nestjs/swagger';
import { PlayerStatsDto } from './dto/player-stats.dto';
import { User } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: CreateUserDto })
  @ApiResponse({ status: 409, description: 'User with this email already exists.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @Get('leaderboard')
  getLeaderboard(): Promise<LeaderboardPlayerDto[]> {
    return this.usersService.getLeaderboard();
  }

  @Public()
  @Get(':id/stats')
  @ApiResponse({ status: 200, description: 'Статистика игрока.', type: PlayerStatsDto })
  getStats(@Param('id') id: string) {
    return this.usersService.getStatsForUser(id);
  }

  @Public() // Make this public for scouting available judges without auth
  @Get()
  @ApiQuery({ name: 'role', required: false, description: 'Фильтр по роли пользователя' })
  findAll(@Query('role') role?: string) {
    return this.usersService.findAll({ role });
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
