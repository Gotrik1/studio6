import { Controller, Get } from '@nestjs/common';
import { FaqService } from './faq.service';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FaqCategoryDto } from './dto/faq.dto';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Получить все вопросы и ответы' })
  @ApiResponse({
    status: 200,
    description: 'Список категорий с вопросами и ответами.',
    type: [FaqCategoryDto],
  })
  findAll() {
    return this.faqService.findAllGroupedByCategory();
  }
}
