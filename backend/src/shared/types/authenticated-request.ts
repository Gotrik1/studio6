import type { Request } from "express";
import type { JwtPayload } from "@/modules/auth/types/jwt-payload";

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
