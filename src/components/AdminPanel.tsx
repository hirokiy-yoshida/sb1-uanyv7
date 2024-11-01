import React, { useState } from 'react';
import { Room, User, Holiday } from '../types';
import { UserManagement } from './UserManagement';
import { MaintenanceModal } from './MaintenanceModal';
import { HolidayManagement } from './HolidayManagement';
import { Layers, Users, Calendar } from 'lucide-react';

interface AdminPanelProps {
  rooms: Room[];
  holidays: Holiday[];
  onAddRoom: (room: Omit<Room, 'id'>) => void;
  onUpdateRoom: (room: Room) => void;
  onAddHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  onDeleteHoliday: (holidayId: string) => void;
}

type AdminTab = 'rooms' | 'users' | 'holidays';

export function AdminPanel({ 
  rooms, 
  holidays,
  onAddRoom, 
  onUpdateRoom,
  onAddHoliday,
  onDeleteHoliday,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('rooms');
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newRoom, setNewRoom] = useState({
    name: '',
    capacity: 0,
    type: 'SINGLE' as const,
  });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRoom(newRoom);
    setShowAddRoom(false);
    setNewRoom({ name: '', capacity: 0, type: 'SINGLE' });
  };

  const handleMaintenanceClick = (room: Room) => {
    setSelectedRoom(room);
    setShowMaintenanceModal(true);
  };

  const handleMaintenanceSubmit = (maintenance: {
    reason: string;
    startDate: Date;
    endDate: Date;
  }) => {
    if (selectedRoom) {
      onUpdateRoom({
        ...selectedRoom,
        maintenance: {
          isUnderMaintenance: true,
          ...maintenance,
        },
      });
    }
    setShowMaintenanceModal(false);
    setSelectedRoom(null);
  };

  const handleMaintenanceEnd = (room: Room) => {
    onUpdateRoom({
      ...room,
      maintenance: undefined,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="管理タブ">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex items-center py-4 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'rooms'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Layers className="w-5 h-5 mr-2" />
            会議室管理
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center py-4 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            ユーザー管理
          </button>
          <button
            onClick={() => setActiveTab('holidays')}
            className={`flex items-center py-4 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'holidays'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="w-5 h-5 mr-2" />
            休日設定
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'rooms' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">会議室管理</h2>
              <button
                onClick={() => setShowAddRoom(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                会議室を追加
              </button>
            </div>

            {showAddRoom && (
              <form onSubmit={handleAddRoom} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      会議室名
                    </label>
                    <input
                      type="text"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      定員
                    </label>
                    <input
                      type="number"
                      value={newRoom.capacity}
                      onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
                      required
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      タイプ
                    </label>
                    <select
                      value={newRoom.type}
                      onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value as 'SINGLE' | 'CONNECTED' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    >
                      <option value="SINGLE">個別</option>
                      <option value="CONNECTED">連結可能</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowAddRoom(false)}
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
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{room.name}</h3>
                      <p className="text-sm text-gray-500">
                        定員: {room.capacity}名 / タイプ: {room.type === 'SINGLE' ? '個別' : '連結可能'}
                      </p>
                      {room.maintenance?.isUnderMaintenance && (
                        <div className="mt-2">
                          <p className="text-red-500 text-sm font-medium">メンテナンス中</p>
                          <p className="text-sm text-gray-500">
                            期間: {new Date(room.maintenance.startDate).toLocaleString()} 〜{' '}
                            {new Date(room.maintenance.endDate).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            理由: {room.maintenance.reason}
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => room.maintenance?.isUnderMaintenance 
                        ? handleMaintenanceEnd(room)
                        : handleMaintenanceClick(room)
                      }
                      className={`px-4 py-2 rounded ${
                        room.maintenance?.isUnderMaintenance
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      {room.maintenance?.isUnderMaintenance 
                        ? 'メンテナンス解除'
                        : 'メンテナンス登録'
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'users' && <UserManagement />}
        
        {activeTab === 'holidays' && (
          <HolidayManagement
            holidays={holidays}
            onAddHoliday={onAddHoliday}
            onDeleteHoliday={onDeleteHoliday}
          />
        )}
      </div>

      {showMaintenanceModal && selectedRoom && (
        <MaintenanceModal
          room={selectedRoom}
          onSubmit={handleMaintenanceSubmit}
          onClose={() => {
            setShowMaintenanceModal(false);
            setSelectedRoom(null);
          }}
        />
      )}
    </div>
  );
}