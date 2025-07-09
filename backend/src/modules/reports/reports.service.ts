import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { ReportStatus, Report } from "@prisma/client";
import { CreateReportDto } from "./dto/create-report.dto";
import { ResolveReportDto } from "./dto/resolve-report.dto";
import type { Prisma } from "@prisma/client";

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(
    reporterId: string,
    createReportDto: CreateReportDto,
  ): Promise<Report> {
    const { reportedUserId, category, description } = createReportDto;
    return this.prisma.report.create({
      data: {
        reporterId,
        reportedUserId,
        category,
        description,
      },
    });
  }

  async findAll(status?: ReportStatus): Promise<
    Prisma.ReportGetPayload<{
      include: {
        reporter: { select: { id: true; name: true; avatar: true } };
        reportedUser: { select: { id: true; name: true; avatar: true } };
      };
    }>[]
  > {
    const where = status ? { status } : {};
    return this.prisma.report.findMany({
      where,
      include: {
        reporter: { select: { id: true, name: true, avatar: true } },
        reportedUser: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async resolve(
    id: string,
    resolverId: string,
    resolveReportDto: ResolveReportDto,
  ): Promise<Report> {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return this.prisma.report.update({
      where: { id },
      data: {
        ...resolveReportDto,
        resolverId,
        resolvedAt: new Date(),
      },
    });
  }
}
