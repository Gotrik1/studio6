import { IsEnum } from "class-validator";
import { TeamApplicationStatus } from "@prisma/client";

export class UpdateApplicationStatusDto {
  @IsEnum(TeamApplicationStatus)
  readonly status: TeamApplicationStatus;
}
