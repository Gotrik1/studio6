import { IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAnnouncementDto {
  @ApiProperty({
    description: "Тема объявления",
    example: "Изменение расписания",
  })
  @IsString()
  @MinLength(3, { message: "Тема должна быть не менее 3 символов." })
  readonly subject: string;

  @ApiProperty({
    description: "Текст объявления",
    example:
      "Внимание, участники! Матчи завтрашнего дня переносятся на 1 час вперед.",
  })
  @IsString()
  @MinLength(10, { message: "Сообщение должно быть не менее 10 символов." })
  readonly message: string;
}
