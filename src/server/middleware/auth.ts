import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

interface JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'ADMIN' | 'USER';
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  try {
    const { userId } = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'ユーザーが見つかりません' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'トークンが無効です' });
  }
};