import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreatePlaygroundReportDto } from "./dto/create-playground-report.dto";
import { analyzePlaygroundReport } from "@/ai/flows/analyze-playground-report-flow";
import { ReportStatus } from "@prisma/client";

@Injectable()
export class PlaygroundReportsService {
  constructor(private prisma: PrismaService) {}

  async createReport(reporterId: string, dto: CreatePlaygroundReportDto) {
    const playground = await this.prisma.playground.findUnique({
      where: { id: dto.playgroundId },
    });

    if (!playground) {
      throw new NotFoundException(
        `Площадка с ID ${dto.playgroundId} не найдена.`,
      );
    }

    // Call AI flow to analyze the report
    const analysis = await analyzePlaygroundReport({
      playgroundName: playground.name,
      issueCategory: dto.category,
      userComment: dto.comment,
    });

    // Save report with analysis to DB
    return this.prisma.playgroundReport.create({
      data: {
        playgroundId: dto.playgroundId,
        reporterId,
        category: dto.category,
        comment: dto.comment,
        severity: analysis.severity,
        summary: analysis.summary,
        status: ReportStatus.PENDING, // Re-using status from user reports
      },
    });
  }

  async getLatestConditionReport(playgroundId: string) {
    return this.prisma.playgroundReport.findFirst({
      where: {
        playgroundId,
        status: "PENDING", // Only show unresolved issues
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
