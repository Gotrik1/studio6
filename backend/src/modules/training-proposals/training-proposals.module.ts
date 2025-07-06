import { Module } from "@nestjs/common";
import { TrainingProposalsService } from "./training-proposals.service";
import { TrainingProposalsController } from "./training-proposals.controller";

@Module({
  controllers: [TrainingProposalsController],
  providers: [TrainingProposalsService],
})
export class TrainingProposalsModule {}
