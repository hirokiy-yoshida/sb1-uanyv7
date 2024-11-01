import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const router = express.Router();

const roomSchema = z.object({
  name: z.string(),
  capacity: z.number().min(1),
  type: z.enum(['SINGLE', 'CONNECTED']),
  connectedToId: z.string().optional(),
});

const maintenanceSchema = z.object({
  reason: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        maintenance: true,
        connectedTo: true,
      },
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// Create room (admin only)
router.post('/', async (req, res) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: '権限がありません' });
  }

  try {
    const data = roomSchema.parse(req.body);
    const room = await prisma.room.create({
      data,
      include: {
        maintenance: true,
        connectedTo: true,
      },
    });
    res.json(room);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: '入力内容を確認してください' });
    }
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// Set maintenance (admin only)
router.post('/:id/maintenance', async (req, res) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: '権限がありません' });
  }

  try {
    const { id } = req.params;
    const data = maintenanceSchema.parse(req.body);

    const maintenance = await prisma.maintenance.create({
      data: {
        roomId: id,
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });

    res.json(maintenance);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: '入力内容を確認してください' });
    }
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// Remove maintenance (admin only)
router.delete('/:id/maintenance', async (req, res) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: '権限がありません' });
  }

  try {
    const { id } = req.params;
    await prisma.maintenance.delete({
      where: { roomId: id },
    });
    res.json({ message: 'メンテナンスを解除しました' });
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export { router as roomRouter };