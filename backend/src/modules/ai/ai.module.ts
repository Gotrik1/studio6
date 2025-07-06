import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { PromotionsModule } from "../promotions/promotions.module";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [PromotionsModule, PrismaModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
