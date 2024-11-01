import { Reservation } from '../types';

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

export const mockReservations: Reservation[] = [
  {
    id: 'reservation-1',
    roomId: 'room-1',
    connectedRoomId: 'room-2',
    title: '全体会議',
    description: '',
    startTime: new Date(today.getTime() + 11 * 3600 * 1000), // 今日の11:00
    endTime: new Date(today.getTime() + 12 * 3600 * 1000), // 今日の12:00
    organizer: {
      id: 'user-1',
      name: 'システム管理者'
    },
    attendees: ['システム管理者'],
    status: 'SCHEDULED',
    createdAt: new Date(today.getTime() - 24 * 3600 * 1000),
    updatedAt: new Date(today.getTime() - 24 * 3600 * 1000)
  },
  {
    id: 'reservation-2',
    roomId: 'room-3',
    title: '部門ミーティング',
    description: '',
    startTime: new Date(today.getTime() + 14 * 3600 * 1000), // 今日の14:00
    endTime: new Date(today.getTime() + 15 * 3600 * 1000), // 今日の15:00
    organizer: {
      id: 'user-2',
      name: '山田 太郎'
    },
    attendees: ['山田 太郎'],
    status: 'SCHEDULED',
    createdAt: new Date(today.getTime() - 2 * 24 * 3600 * 1000),
    updatedAt: new Date(today.getTime() - 2 * 24 * 3600 * 1000)
  },
  {
    id: 'reservation-3',
    roomId: 'room-4',
    title: 'プロジェクトMTG',
    description: '',
    startTime: new Date(today.getTime() + 10 * 3600 * 1000), // 今日の10:00
    endTime: new Date(today.getTime() + 11 * 3600 * 1000), // 今日の11:00
    organizer: {
      id: 'user-3',
      name: '佐藤 花子'
    },
    attendees: ['佐藤 花子'],
    status: 'IN_PROGRESS',
    createdAt: new Date(today.getTime() - 24 * 3600 * 1000),
    updatedAt: new Date(today.getTime() - 24 * 3600 * 1000)
  }
];