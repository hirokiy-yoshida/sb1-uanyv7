import { Room } from '../types';

export const mockRooms: Room[] = [
  {
    id: 'room-1',
    name: '大会議室 A',
    capacity: 20,
    type: 'CONNECTED',
    connectedTo: 'room-2',
  },
  {
    id: 'room-2',
    name: '大会議室 B',
    capacity: 20,
    type: 'CONNECTED',
    connectedTo: 'room-1',
  },
  {
    id: 'room-3',
    name: '中会議室 C',
    capacity: 12,
    type: 'SINGLE',
  },
  {
    id: 'room-4',
    name: '小会議室 D',
    capacity: 6,
    type: 'SINGLE',
  },
  {
    id: 'room-5',
    name: '小会議室 E',
    capacity: 6,
    type: 'SINGLE',
  },
  {
    id: 'room-6',
    name: '応接室 F',
    capacity: 4,
    type: 'SINGLE',
  }
];