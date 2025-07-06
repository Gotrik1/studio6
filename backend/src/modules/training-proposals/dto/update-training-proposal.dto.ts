import { IsString, IsIn } from "class-validator";

export class UpdateTrainingProposalDto {
  @IsString()
  @IsIn(["ACCEPTED", "DECLINED"])
  readonly status: "ACCEPTED" | "DECLINED";
}
