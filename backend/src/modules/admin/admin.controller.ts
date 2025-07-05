import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Получить статистику для дашборда администратора' })
  @ApiResponse({ status: 200, description: 'Статистика для дашборда.'})
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }
}
