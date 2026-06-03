import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth/auth.utils";

interface JWTPayload {
  user_id: number;
  public_id: string;
  email: string;
  name: string;
  role: "admin" | "employee";
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export function authenticateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ message: "Authentication header is required" });
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  try {
    const decoded = verifyToken(token) as JWTPayload;

    req.user = {
      user_id: decoded.user_id,
      email: decoded.email,
      name: decoded.name,
      public_id: decoded.public_id,
      role: decoded.role
    };

    next(); // IMPORTANT
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
}