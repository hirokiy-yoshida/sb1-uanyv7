export type Tab = 'rooms' | 'admin';

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: 'SINGLE' | 'CONNECTED';
  connectedTo?: string;
  maintenance?: {
    isUnderMaintenance: boolean;
    reason: string;
    startDate: Date;
    endDate: Date;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

export interface Holiday {
  id: string;
  date: Date;
  name: string;
}

export interface Reservation {
  id: string;
  roomId: string;
  connectedRoomId?: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  actualEndTime?: Date;
  organizer: {
    id: string;
    name: string;
  };
  attendees: string[];
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}