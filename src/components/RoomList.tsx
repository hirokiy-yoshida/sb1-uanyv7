import React from 'react';
import { Room } from '../types';

interface RoomListProps {
  rooms: Room[];
  selectedRoom: Room | null;
  onRoomSelect: (room: Room) => void;
}

export function RoomList({ rooms, selectedRoom, onRoomSelect }: RoomListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">会議室一覧</h2>
      <div className="space-y-2">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onRoomSelect(room)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedRoom?.id === room.id
                ? 'bg-blue-50 text-blue-700'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{room.name}</div>
            <div className="text-sm text-gray-500">
              定員: {room.capacity}名
              {room.type === 'CONNECTED' && ' (連結可能)'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}