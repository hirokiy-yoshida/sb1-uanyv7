import React, { useState } from 'react';
import { Room, Reservation, User } from '../types';
import { Edit2, Trash2, X, PlayCircle, StopCircle } from 'lucide-react';

interface ReservationDetailsProps {
  reservation: Reservation;
  room: Room;
  connectedRoom: Room | null;
  currentUser: User;
  onClose: () => void;
  onUpdate: (reservation: Reservation) => void;
  onDelete: (reservationId: string) => void;
}

export function ReservationDetails({
  reservation,
  room,
  connectedRoom,
  currentUser,
  onClose,
  onUpdate,
  onDelete,
}: ReservationDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(reservation.title);
  const [notification, setNotification] = useState<string>('');

  const canEdit = currentUser.role === 'ADMIN' || 
                 currentUser.id === reservation.organizer.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...reservation,
      title,
      updatedAt: new Date(),
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('予約を削除してもよろしいですか？')) {
      onDelete(reservation.id);
      onClose();
    }
  };

  const handleStart = () => {
    onUpdate({
      ...reservation,
      status: 'IN_PROGRESS',
      updatedAt: new Date(),
    });
    setNotification('利用を開始しました');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleEnd = () => {
    const now = new Date();
    onUpdate({
      ...reservation,
      status: 'COMPLETED',
      actualEndTime: now,
      updatedAt: now,
    });
    setNotification('利用を終了しました');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const roomTitle = connectedRoom
    ? `${room.name} + ${connectedRoom.name}`
    : room.name;

  const now = new Date();
  const startTime = new Date(reservation.startTime);
  const endTime = new Date(reservation.endTime);
  
  const oneHourBefore = new Date(startTime);
  oneHourBefore.setHours(startTime.getHours() - 1);
  
  const canStart = reservation.status === 'SCHEDULED' && 
                  now >= oneHourBefore && 
                  now < endTime;
                  
  const canEnd = reservation.status === 'IN_PROGRESS';

  if (notification) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div className={`text-xl font-medium ${
            notification.includes('開始') ? 'text-green-600' : 'text-blue-600'
          }`}>
            {notification}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">予約詳細</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                更新
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500">会議室</div>
              <div className="font-medium">{roomTitle}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">日時</div>
              <div className="font-medium">
                {new Date(reservation.startTime).toLocaleString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {' 〜 '}
                {new Date(reservation.endTime).toLocaleString('ja-JP', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              {reservation.actualEndTime && (
                <div className="text-sm text-gray-500 mt-1">
                  実際の終了時間: {new Date(reservation.actualEndTime).toLocaleString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}
            </div>

            <div>
              <div className="text-sm text-gray-500">会議内容</div>
              <div className="font-medium">{reservation.title}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">予約者</div>
              <div className="font-medium">{reservation.organizer.name}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">状態</div>
              <div className={`font-medium ${
                reservation.status === 'IN_PROGRESS'
                  ? 'text-green-600'
                  : reservation.status === 'COMPLETED'
                  ? 'text-gray-600'
                  : 'text-blue-600'
              }`}>
                {reservation.status === 'IN_PROGRESS'
                  ? '利用中'
                  : reservation.status === 'COMPLETED'
                  ? '利用終了'
                  : '予約済み'}
              </div>
              {reservation.status === 'SCHEDULED' && now >= oneHourBefore && now < startTime && (
                <div className="text-xs text-blue-600 mt-1">
                  ※開始時間の1時間前から利用開始できます
                </div>
              )}
            </div>

            {canEdit && (
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="space-x-2">
                  {canStart && (
                    <button
                      onClick={handleStart}
                      className="flex items-center px-3 py-2 text-green-600 hover:bg-green-50 rounded"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      利用開始
                    </button>
                  )}
                  {canEnd && (
                    <button
                      onClick={handleEnd}
                      className="flex items-center px-3 py-2 text-orange-600 hover:bg-orange-50 rounded"
                    >
                      <StopCircle className="w-4 h-4 mr-2" />
                      利用終了
                    </button>
                  )}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    編集
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    削除
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}