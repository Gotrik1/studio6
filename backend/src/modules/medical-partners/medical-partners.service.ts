import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";

const seedMedics = [
  {
    name: 'Бригада СМП "МедЭкспресс"',
    specialization: "Скорая помощь",
    contact: "+7 (495) 123-45-67",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "medical logo",
  },
  {
    name: "Доктор Айболит",
    specialization: "Спортивная травматология",
    contact: "doc@example.com",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "doctor portrait",
  },
];

@Injectable()
export class MedicalPartnersService implements OnModuleInit {
  private readonly logger = new Logger(MedicalPartnersService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.medicalPartner.count();
    if (count > 0) return;

    this.logger.log("Seeding initial medical partners...");
    await this.prisma.medicalPartner.createMany({
      data: seedMedics,
    });
    this.logger.log("Medical partners seeded successfully.");
  }

  async findAll() {
    return this.prisma.medicalPartner.findMany();
  }
}
