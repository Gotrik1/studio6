import { Controller, Get, Param, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { SportsService } from './sports.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSportDto } from './dto/create-sport.dto';

@ApiTags('Sports')
@Controller('sports')
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Получить список всех видов спорта' })
  findAll() {
    return this.sportsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Получить вид спорта по ID (слагу)' })
  findOne(@Param('id') id: string) {
    return this.sportsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новый вид спорта (для админов)' })
  create(@Body() createSportDto: CreateSportDto) {
    return this.sportsService.create(createSportDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить вид спорта (для админов)' })
  remove(@Param('id') id: string) {
    return this.sportsService.remove(id);
  }
}
