import React, { useState } from 'react';
import { Room, User } from '../types';

interface ReservationModalProps {
  room: Room | null;
  connectedRoom: Room | null;
  date: Date;
  hour: number;
  minute: number;
  currentUser: User | null;
  onClose: () => void;
  onSubmit: (data: {
    startTime: Date;
    endTime: Date;
    title: string;
    description: string;
    attendees: string[];
  }) => void;
}

export function ReservationModal({
  room,
  connectedRoom,
  date,
  hour,
  minute,
  currentUser,
  onClose,
  onSubmit,
}: ReservationModalProps) {
  const startTime = new Date(date);
  startTime.setHours(hour, minute, 0, 0);
  
  // 終了時間を開始時間の1時間後に設定
  const defaultEndTime = new Date(startTime);
  defaultEndTime.setHours(startTime.getHours() + 1);
  
  const [endDate, setEndDate] = useState(defaultEndTime.toISOString().split('T')[0]);
  const [endTime, setEndTime] = useState(
    `${defaultEndTime.getHours().toString().padStart(2, '0')}:${defaultEndTime.getMinutes().toString().padStart(2, '0')}`
  );
  const [title, setTitle] = useState('');

  if (!room || !currentUser) {
    return null;
  }

  const roomTitle = connectedRoom
    ? `${room.name} + ${connectedRoom.name}`
    : room.name;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const endDateTime = new Date(`${endDate}T${endTime}`);
    
    onSubmit({
      startTime,
      endTime: endDateTime,
      title,
      description: '',
      attendees: [currentUser.name],
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">{roomTitle}の予約</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                予約者
              </label>
              <p className="mt-1 text-gray-600">{currentUser.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                開始日時
              </label>
              <p className="mt-1 text-gray-600">
                {startTime.toLocaleString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  終了日
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startTime.toISOString().split('T')[0]}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  終了時間
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                会議内容
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              予約する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}