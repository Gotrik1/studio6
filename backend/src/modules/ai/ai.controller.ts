import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateTeamConceptDto } from './dto/generate-team-concept.dto';
import type { GenerateTeamConceptOutput } from '../../ai/flows/schemas/generate-team-concept-schema';

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
}
