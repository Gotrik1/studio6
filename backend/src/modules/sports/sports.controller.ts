import { Controller, Get, Param } from '@nestjs/common';
import { SportsService } from './sports.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

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
}
