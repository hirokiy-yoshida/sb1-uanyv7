import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@example.com',
    name: 'システム管理者',
    role: 'ADMIN'
  },
  {
    id: 'user-2',
    email: 'user1@example.com',
    name: '山田 太郎',
    role: 'USER'
  },
  {
    id: 'user-3',
    email: 'user2@example.com',
    name: '佐藤 花子',
    role: 'USER'
  },
  {
    id: 'user-4',
    email: 'user3@example.com',
    name: '鈴木 一郎',
    role: 'USER'
  },
  {
    id: 'user-5',
    email: 'user4@example.com',
    name: '田中 美咲',
    role: 'USER'
  }
];