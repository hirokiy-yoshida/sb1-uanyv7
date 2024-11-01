import { Holiday } from '../types';

export const mockHolidays: Holiday[] = [
  {
    id: 'holiday-1',
    date: new Date(2024, 0, 1), // 元日
    name: '元日'
  },
  {
    id: 'holiday-2',
    date: new Date(2024, 0, 8), // 成人の日
    name: '成人の日'
  },
  {
    id: 'holiday-3',
    date: new Date(2024, 1, 11), // 建国記念の日
    name: '建国記念の日'
  },
  {
    id: 'holiday-4',
    date: new Date(2024, 1, 23), // 天皇誕生日
    name: '天皇誕生日'
  },
  {
    id: 'holiday-5',
    date: new Date(2024, 2, 20), // 春分の日
    name: '春分の日'
  }
];