import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Post,
  Body,
  Patch,
  Delete,
} from "@nestjs/common";
import { TrainingService } from "./training.service";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { Public } from "../auth/decorators/public.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "@/shared/types/authenticated-request";
import { AssignProgramDto } from "./dto/assign-program.dto";
import { CreateProgramData, UpdateProgramData } from "./dto/program.dto";

@ApiTags("Training")
@Controller("training")
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Public()
  @Get("exercises")
  @ApiOperation({ summary: "Получить список всех упражнений" })
  findAllExercises() {
    return this.trainingService.findAllExercises();
  }

  @Public()
  @Get("exercises/:id")
  @ApiOperation({ summary: "Получить упражнение по ID" })
  findOneExercise(@Param("id") id: string) {
    return this.trainingService.findOneExercise(id);
  }

  @Public()
  @Get("programs")
  @ApiOperation({ summary: "Получить список всех программ тренировок" })
  findAllPrograms() {
    return this.trainingService.findAllPrograms();
  }

  @Post("programs")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Создать новую программу тренировок" })
  createProgram(
    @Body() createDto: CreateProgramData,
    @Req() req: AuthenticatedRequest,
  ) {
    const authorName = req.user.name;
    return this.trainingService.createProgram(createDto, authorName);
  }

  @Patch("programs/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Обновить программу тренировок" })
  updateProgram(@Param("id") id: string, @Body() updateDto: UpdateProgramData) {
    // In a real app, you'd check if the user is the author or an admin
    return this.trainingService.updateProgram(id, updateDto);
  }

  @Delete("programs/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Удалить программу тренировок" })
  deleteProgram(@Param("id") id: string) {
    // In a real app, you would add logic to check if the current user is the author
    return this.trainingService.deleteProgram(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("log")
  @ApiOperation({
    summary: "Получить журнал тренировок для текущего пользователя",
  })
  getTrainingLog(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.trainingService.getLogsForUser(userId);
  }

  @Post("programs/assign")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Назначить программу тренировок игрокам" })
  assignProgram(@Body() assignProgramDto: AssignProgramDto) {
    return this.trainingService.assignProgram(assignProgramDto);
  }
}
