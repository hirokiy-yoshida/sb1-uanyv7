import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { sendPasswordResetEmail } from '../lib/email';

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const resetRequestSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: 'メールアドレスまたはパスワードが正しくありません',
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: '入力内容を確認してください' });
    }
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

router.post('/reset-request', async (req, res) => {
  try {
    const { email } = resetRequestSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: 'メールアドレスが見つかりません',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: new Date(Date.now() + 3600000), // 1時間後
      },
    });

    await sendPasswordResetEmail(user, resetToken);

    res.json({
      message: 'パスワードリセット用のメールを送信しました',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: '入力内容を確認してください' });
    }
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: {
        resetToken: { not: null },
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: 'リセットトークンが無効または期限切れです',
      });
    }

    const isValidToken = await bcrypt.compare(token, user.resetToken!);
    if (!isValidToken) {
      return res.status(400).json({
        message: 'リセットトークンが無効です',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({
      message: 'パスワードを更新しました',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: '入力内容を確認してください' });
    }
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export { router as authRouter };