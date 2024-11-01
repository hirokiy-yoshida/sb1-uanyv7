import express from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

const router = express.Router();

const userSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'USER']),
});

// Get all users (admin only)
router.get('/', async (req, res) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: '権限がありません' });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// Create user (admin only)
router.post('/', async (req, res) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: '権限がありません' });
  }

  try {
    const data = userSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'このメールアドレスは既に使用されています' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: '入力内容を確認してください' });
    }
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export { router as userRouter };