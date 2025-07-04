import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CoachesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const coachesWithProfiles = await this.prisma.user.findMany({
      where: {
        role: 'Тренер',
        coachProfile: { isNot: null },
      },
      include: {
        coachProfile: true,
      },
    });

    return coachesWithProfiles.map(user => ({
        id: user.coachProfile!.id,
        name: user.name,
        avatar: user.avatar,
        avatarHint: 'sports coach portrait',
        specialization: user.coachProfile!.specialization,
        description: user.coachProfile!.description,
        tags: user.coachProfile!.tags,
        rating: user.coachProfile!.rating,
        price: user.coachProfile!.price,
        profileUrl: `/profiles/coach/${user.id}`,
    }));
  }
}
