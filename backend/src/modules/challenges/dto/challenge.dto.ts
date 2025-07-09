import { ChallengeStatus } from "@prisma/client";

class ChallengeParticipantDto {
  id: string;
  name: string;
  avatar: string | null;
  avatarHint: string;
}

export class ChallengeDto {
  id: string;
  title: string;
  description: string;
  discipline: string;
  wager: number;
  status: ChallengeStatus;
  result: string | null;
  creator: ChallengeParticipantDto;
  opponent: ChallengeParticipantDto | null;
}
