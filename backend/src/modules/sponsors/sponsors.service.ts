import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import type { Sponsor } from "@prisma/client";

@Injectable()
export class SponsorsService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Sponsor[]> {
    return this.prisma.sponsor.findMany();
  }
}
