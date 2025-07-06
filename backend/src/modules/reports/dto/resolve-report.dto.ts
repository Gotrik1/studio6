import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { ReportStatus } from "@prisma/client";

export class ResolveReportDto {
  @IsString()
  @IsNotEmpty()
  readonly resolution: string;

  @IsEnum(ReportStatus)
  readonly status: ReportStatus;
}
