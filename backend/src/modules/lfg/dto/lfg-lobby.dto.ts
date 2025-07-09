import { LfgLobbyStatus, LfgLobbyType } from "@prisma/client";

export class LfgLobbyDto {
  id: string;
  type: LfgLobbyType;
  sport: string;
  location: string;
  playgroundId: string | null;
  startTime: Date;
  endTime: Date;
  playersNeeded: number;
  playersJoined: number;
  comment: string;
  creator: {
    name: string;
    avatar: string | null;
  };
  status: LfgLobbyStatus;
}
