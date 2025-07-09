import type { Role } from "@prisma/client";

export interface JwtPayload {
  userId: string;
  name: string;
  role: Role;
}
