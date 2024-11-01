import React from 'react';
import { Reservation } from '../types';
import { Clock, Calendar, User, FileText } from 'lucide-react';

interface ReservationChangeConfirmProps {
  reservation: Reservation;
  originalStartTime: Date;
  originalEndTime: Date;
  newStartTime: Date;
  newEndTime: Date;
  onConfirm: (confirmed: boolean) => void;
  onClose: () => void;
}

export function ReservationChangeConfirm({
  reservation,
  originalStartTime,
  originalEndTime,
  newStartTime,
  newEndTime,
  onConfirm,
  onClose,
}: ReservationChangeConfirmProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-6">予約時間の変更確認</h3>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500">会議内容</div>
              <div className="font-medium">{reservation.title}</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500">予約者</div>
              <div className="font-medium">{reservation.organizer.name}</div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-start space-x-3 mb-4">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500">現在の予約</div>
                <div className="font-medium">{formatDate(new Date(originalStartTime))}</div>
                <div className="flex items-center mt-1">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-gray-600">
                    {formatTime(new Date(originalStartTime))} 〜 {formatTime(new Date(originalEndTime))}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <div className="text-sm text-blue-500 font-medium">変更後の予約</div>
                <div className="font-medium">{formatDate(newStartTime)}</div>
                <div className="flex items-center mt-1">
                  <Clock className="w-4 h-4 text-blue-400 mr-1" />
                  <span className="text-blue-600">
                    {formatTime(newStartTime)} 〜 {formatTime(newEndTime)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={() => {
              onConfirm(false);
              onClose();
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={() => {
              onConfirm(true);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            変更する
          </button>
        </div>
      </div>
    </div>
  );
}