
import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateTeamConceptDto } from './dto/generate-team-concept.dto';
import type { GenerateTeamConceptOutput } from '../../ai/flows/schemas/generate-team-concept-schema';
import { GenerateUserAvatarDto } from './dto/generate-user-avatar.dto';
import type { GenerateUserAvatarOutput } from '../../ai/flows/schemas/generate-user-avatar-schema';
import { GenerateProfileBannerDto } from './dto/generate-profile-banner.dto';
import type { GenerateProfileBannerOutput } from '../../ai/flows/schemas/generate-profile-banner-schema';
import type { NewsWithAudio } from '../../ai/flows/schemas/generate-platform-news-schema';
import { AnalyzeJoinRequestDto } from './dto/analyze-join-request.dto';
import type { AnalyzeJoinRequestOutput } from '@/ai/flows/schemas/analyze-join-request-schema';
import { AnalyzeTeamPerformanceDto } from './dto/analyze-team-performance.dto';
import type { AnalyzeTeamPerformanceOutput } from '@/ai/flows/schemas/analyze-team-performance-schema';
import { AnalyzeEsportsPerformanceDto } from './dto/analyze-esports-performance.dto';
import type { AnalyzeEsportsPerformanceOutput } from '@/ai/flows/schemas/analyze-esports-performance-schema';
import { AnalyzeContentDto } from './dto/analyze-content.dto';
import { GenerateContentDto } from './dto/generate-content.dto';
import { GenerateDialogueDto } from './dto/generate-dialogue.dto';
import { MultiSpeakerTtsDto } from './dto/multi-speaker-tts.dto';
import { AnalyzeDisputeDto } from './dto/analyze-dispute.dto';
import { TextToSpeechDto } from './dto/text-to-speech.dto';
import type { AnalyzeContentOutput } from '@/ai/flows/schemas/analyze-content-generation-schema';
import type { GenerateContentOutput } from '@/ai/flows/schemas/generate-content-schema';
import type { GenerateDialogueOutput } from '@/ai/flows/schemas/dialogue-generation-schema';
import type { MultiSpeakerTtsOutput } from '@/ai/flows/schemas/multi-speaker-tts-schema';
import type { AnalyzeDisputeOutput } from '@/ai/flows/schemas/analyze-dispute-schema';
import type { TextToSpeechOutput } from '@/ai/flows/schemas/tts-schema';
import { AnalyzeSecurityDto } from './dto/analyze-security.dto';
import type { AnalyzeSecurityOutput } from '@/ai/flows/schemas/analyze-security-schema';

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

  @Post('generate-profile-banner')
  @HttpCode(HttpStatus.OK)
  async generateProfileBanner(
    @Body() generateProfileBannerDto: GenerateProfileBannerDto,
  ): Promise<GenerateProfileBannerOutput> {
    return this.aiService.generateProfileBanner(generateProfileBannerDto.prompt);
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

  @Post('analyze-esports-performance')
  @HttpCode(HttpStatus.OK)
  async analyzeEsportsPerformance(
    @Body() analyzeEsportsPerformanceDto: AnalyzeEsportsPerformanceDto,
  ): Promise<AnalyzeEsportsPerformanceOutput> {
    return this.aiService.analyzeEsportsPerformance(analyzeEsportsPerformanceDto);
  }

  @Post('analyze-content')
  @HttpCode(HttpStatus.OK)
  async analyzeContent(
    @Body() analyzeContentDto: AnalyzeContentDto,
  ): Promise<AnalyzeContentOutput> {
    return this.aiService.analyzeContent(analyzeContentDto);
  }

  @Post('generate-content')
  @HttpCode(HttpStatus.OK)
  async generateContent(
    @Body() generateContentDto: GenerateContentDto,
  ): Promise<GenerateContentOutput> {
    return this.aiService.generateContent(generateContentDto);
  }

  @Post('generate-dialogue')
  @HttpCode(HttpStatus.OK)
  async generateDialogue(
    @Body() generateDialogueDto: GenerateDialogueDto,
  ): Promise<GenerateDialogueOutput> {
    return this.aiService.generateDialogue(generateDialogueDto.topic);
  }

  @Post('multi-speaker-tts')
  @HttpCode(HttpStatus.OK)
  async multiSpeakerTts(
    @Body() multiSpeakerTtsDto: MultiSpeakerTtsDto,
  ): Promise<MultiSpeakerTtsOutput> {
    return this.aiService.multiSpeakerTts(multiSpeakerTtsDto.script);
  }

  @Post('analyze-dispute')
  @HttpCode(HttpStatus.OK)
  async analyzeDispute(
    @Body() analyzeDisputeDto: AnalyzeDisputeDto,
  ): Promise<AnalyzeDisputeOutput> {
    return this.aiService.analyzeDispute(analyzeDisputeDto);
  }

  @Post('text-to-speech')
  @HttpCode(HttpStatus.OK)
  async textToSpeech(
    @Body() textToSpeechDto: TextToSpeechDto,
  ): Promise<TextToSpeechOutput> {
    return this.aiService.textToSpeech(textToSpeechDto.text);
  }

  @Post('analyze-security')
  @HttpCode(HttpStatus.OK)
  async analyzeSecurity(
    @Body() analyzeSecurityDto: AnalyzeSecurityDto,
  ): Promise<AnalyzeSecurityOutput> {
    return this.aiService.analyzeSecurity(analyzeSecurityDto);
  }
}
