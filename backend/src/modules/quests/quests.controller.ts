import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { QuestsService } from "./quests.service";
import { CreateQuestDto } from "./dto/create-quest.dto";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("Quests")
@Controller("quests")
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Создать новый квест (для админов)" })
  create(@Body() createQuestDto: CreateQuestDto) {
    return this.questsService.create(createQuestDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: "Получить все квесты" })
  findAll() {
    return this.questsService.findAll();
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Удалить квест (для админов)" })
  remove(@Param("id") id: string) {
    return this.questsService.remove(id);
  }
}
