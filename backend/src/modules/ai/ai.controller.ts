import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateTeamConceptDto } from './dto/generate-team-concept.dto';
import type { GenerateTeamConceptOutput } from '../../ai/flows/schemas/generate-team-concept-schema';
import { GenerateUserAvatarDto } from './dto/generate-user-avatar.dto';
import type { GenerateUserAvatarOutput } from '../../ai/flows/schemas/generate-user-avatar-schema';
import type { NewsWithAudio } from '../../ai/flows/schemas/generate-platform-news-schema';
import { AnalyzeJoinRequestDto } from './dto/analyze-join-request.dto';
import type { AnalyzeJoinRequestOutput } from '@/ai/flows/schemas/analyze-join-request-schema';
import { AnalyzeTeamPerformanceDto } from './dto/analyze-team-performance.dto';
import type { AnalyzeTeamPerformanceOutput } from '@/ai/flows/schemas/analyze-team-performance-schema';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-team-concept')
  @HttpCode(HttpStatus.OK)
  async generateTeamConcept(
    @Body() generateTeamConceptDto: GenerateTeamConceptDto,
  ): Promise<GenerateTeamConceptOutput> {
    return this.aiService.generateTeamConcept(generateTeamConceptDto.prompt);
  }

  @Post('generate-user-avatar')
  @HttpCode(HttpStatus.OK)
  async generateUserAvatar(
    @Body() generateUserAvatarDto: GenerateUserAvatarDto,
  ): Promise<GenerateUserAvatarOutput> {
    return this.aiService.generateUserAvatar(generateUserAvatarDto.prompt);
  }

  @Get('dashboard-news')
  @HttpCode(HttpStatus.OK)
  async getDashboardNews(): Promise<NewsWithAudio> {
      return this.aiService.generateDashboardNews();
  }

  @Post('analyze-join-request')
  @HttpCode(HttpStatus.OK)
  async analyzeJoinRequest(
    @Body() analyzeJoinRequestDto: AnalyzeJoinRequestDto,
  ): Promise<AnalyzeJoinRequestOutput> {
    return this.aiService.analyzeJoinRequest(analyzeJoinRequestDto);
  }

  @Post('analyze-team-performance')
  @HttpCode(HttpStatus.OK)
  async analyzeTeamPerformance(
    @Body() analyzeTeamPerformanceDto: AnalyzeTeamPerformanceDto,
  ): Promise<AnalyzeTeamPerformanceOutput> {
    return this.aiService.analyzeTeamPerformance(analyzeTeamPerformanceDto);
  }
}
