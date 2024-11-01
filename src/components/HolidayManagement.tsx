import React, { useState } from 'react';
import { Holiday } from '../types';
import { Trash2 } from 'lucide-react';

interface HolidayManagementProps {
  holidays: Holiday[];
  onAddHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  onDeleteHoliday: (holidayId: string) => void;
}

export function HolidayManagement({
  holidays,
  onAddHoliday,
  onDeleteHoliday,
}: HolidayManagementProps) {
  const [showAddHoliday, setShowAddHoliday] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    date: '',
    name: '',
  });

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    onAddHoliday({
      date: new Date(newHoliday.date),
      name: newHoliday.name,
    });
    setShowAddHoliday(false);
    setNewHoliday({ date: '', name: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">休日設定</h2>
        <button
          onClick={() => setShowAddHoliday(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          休日を追加
        </button>
      </div>

      {showAddHoliday && (
        <form onSubmit={handleAddHoliday} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                日付
              </label>
              <input
                type="date"
                value={newHoliday.date}
                onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                休日名
              </label>
              <input
                type="text"
                value={newHoliday.name}
                onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAddHoliday(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                追加
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {holidays
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((holiday) => (
            <div
              key={holiday.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <div className="font-medium">
                  {new Date(holiday.date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                  })}
                </div>
                <div className="text-sm text-gray-500">{holiday.name}</div>
              </div>
              <button
                onClick={() => onDeleteHoliday(holiday.id)}
                className="text-red-600 hover:bg-red-50 p-2 rounded"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}