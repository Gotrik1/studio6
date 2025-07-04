import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateTeamConceptDto } from './dto/generate-team-concept.dto';
import type { GenerateTeamConceptOutput } from '../../ai/flows/schemas/generate-team-concept-schema';
import { GenerateUserAvatarDto } from './dto/generate-user-avatar.dto';
import type { GenerateUserAvatarOutput } from '../../ai/flows/schemas/generate-user-avatar-schema';
import type { NewsWithAudio } from '../../ai/flows/schemas/generate-platform-news-schema';

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
}
