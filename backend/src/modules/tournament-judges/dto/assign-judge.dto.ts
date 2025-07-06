import { IsString, IsNotEmpty } from "class-validator";

export class AssignJudgeDto {
  @IsString()
  @IsNotEmpty()
  readonly judgeId: string;
}
