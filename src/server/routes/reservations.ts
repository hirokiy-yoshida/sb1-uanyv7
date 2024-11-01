import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const router = express.Router();

const reservationSchema = z.object({
  roomId: z.string(),
  connectedRoomId: z.string().optional(),
  title: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

const updateStatusSchema = z.object({
  status: z.enum(['IN_PROGRESS', 'COMPLETED']),
  actualEndTime: z.string().optional(),
});

// Get all reservations
router.get('/', async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// Create reservation
router.post('/', async (req, res) => {
  try {
    const data = reservationSchema.parse(req.body);
    
    // Check for existing reservations
    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        OR: [
          { roomId: data.roomId },
          { connectedRoomId: data.roomId },
          ...(data.connectedRoomId ? [
            { roomId: data.connectedRoomId },
            { connectedRoomId: data.connectedRoomId },
          ] : []),
        ],
        AND: [
          {
            startTime: {
              lt: new Date(data.endTime),
            },
          },
          {
            endTime: {
              gt: new Date(data.startTime),
            },
          },
        ],
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS'],
        },
      },
    });

    if (conflictingReservation) {
      return res.status(409).json({ message: '指定した時間帯は既に予約されています' });
    }

    const reservation = await prisma.reservation.create({
      data: {
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        organizerId: req.user!.id,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(reservation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: '入力内容を確認してください' });
    }
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// Update reservation status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const data = updateStatusSchema.parse(req.body);

    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return res.status(404).json({ message: '予約が見つかりません' });
    }

    if (reservation.organizerId !== req.user!.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: '権限がありません' });
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        status: data.status,
        actualEndTime: data.actualEndTime ? new Date(data.actualEndTime) : undefined,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(updatedReservation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: '入力内容を確認してください' });
    }
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// Delete reservation
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return res.status(404).json({ message: '予約が見つかりません' });
    }

    if (reservation.organizerId !== req.user!.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: '権限がありません' });
    }

    await prisma.reservation.delete({
      where: { id },
    });

    res.json({ message: '予約を削除しました' });
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export { router as reservationRouter };