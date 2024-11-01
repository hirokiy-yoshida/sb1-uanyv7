import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const router = express.Router();

const holidaySchema = z.object({
  date: z.string(),
  name: z.string(),
});

// Get all holidays
router.get('/', async (req, res) => {
  try {
    const holidays = await prisma.holiday.findMany();
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// Create holiday (admin only)
router.post('/', async (req, res) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: '権限がありません' });
  }

  try {
    const data = holidaySchema.parse(req.body);
    const holiday = await prisma.holiday.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
    });
    res.json(holiday);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: '入力内容を確認してください' });
    }
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// Delete holiday (admin only)
router.delete('/:id', async (req, res) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: '権限がありません' });
  }

  try {
    const { id } = req.params;
    await prisma.holiday.delete({
      where: { id },
    });
    res.json({ message: '休日を削除しました' });
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export { router as holidayRouter };