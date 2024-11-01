import React from 'react';
import { Room } from '../types';

interface ConnectedRoomAlertProps {
  room: Room;
  connectedRoom: Room;
  onConfirm: (useConnected: boolean) => void;
  onClose: () => void;
}

export function ConnectedRoomAlert({
  room,
  connectedRoom,
  onConfirm,
  onClose,
}: ConnectedRoomAlertProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">連結会議室の選択</h3>
        <p className="text-gray-600 mb-6">
          {room.name}は{connectedRoom.name}と連結して使用できます。
          連結して予約しますか？
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => onConfirm(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            個別に予約
          </button>
          <button
            onClick={() => onConfirm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            連結して予約
          </button>
        </div>
      </div>
    </div>
  );
}