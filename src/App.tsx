import React, { useState } from 'react';
import { Room, User, Holiday, Reservation, Tab } from './types';
import { useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { AdminPanel } from './components/AdminPanel';
import { RoomList } from './components/RoomList';
import { DateSelector } from './components/DateSelector';
import { WeeklyCalendar } from './components/WeeklyCalendar';
import { mockRooms } from './data/mockRooms';
import { mockReservations } from './data/mockReservations';
import { mockHolidays } from './data/mockHolidays';
import { LogOut } from 'lucide-react';

function App() {
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('rooms');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState(mockRooms);
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
  };

  const getConnectedRoom = () => {
    if (!selectedRoom?.connectedTo) return null;
    return rooms.find(room => room.id === selectedRoom.connectedTo) || null;
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleAddRoom = (newRoom: Omit<Room, 'id'>) => {
    const room: Room = {
      ...newRoom,
      id: `room-${rooms.length + 1}`,
    };
    setRooms([...rooms, room]);
  };

  const handleUpdateRoom = (updatedRoom: Room) => {
    setRooms(rooms.map(room => 
      room.id === updatedRoom.id ? updatedRoom : room
    ));
  };

  const handleAddReservation = (newReservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const reservation: Reservation = {
      ...newReservation,
      id: `reservation-${reservations.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setReservations([...reservations, reservation]);
  };

  const handleUpdateReservation = (updatedReservation: Reservation) => {
    setReservations(reservations.map(reservation =>
      reservation.id === updatedReservation.id ? updatedReservation : reservation
    ));
  };

  const handleDeleteReservation = (reservationId: string) => {
    setReservations(reservations.filter(reservation => reservation.id !== reservationId));
  };

  const handleAddHoliday = (newHoliday: Omit<Holiday, 'id'>) => {
    const holiday: Holiday = {
      ...newHoliday,
      id: `holiday-${holidays.length + 1}`,
    };
    setHolidays([...holidays, holiday]);
  };

  const handleDeleteHoliday = (holidayId: string) => {
    setHolidays(holidays.filter(holiday => holiday.id !== holidayId));
  };

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">会議室予約システム</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user.name}</span>
              <button
                onClick={logout}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
          {isAdmin && (
            <nav className="flex space-x-8 -mb-px">
              <button
                onClick={() => setActiveTab('rooms')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rooms'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                会議室予約
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'admin'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                システム管理
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'admin' && isAdmin ? (
          <AdminPanel
            rooms={rooms}
            holidays={holidays}
            onAddRoom={handleAddRoom}
            onUpdateRoom={handleUpdateRoom}
            onAddHoliday={handleAddHoliday}
            onDeleteHoliday={handleDeleteHoliday}
          />
        ) : (
          <div className="grid grid-cols-4 gap-8">
            <div className="col-span-1">
              <RoomList
                rooms={rooms}
                selectedRoom={selectedRoom}
                onRoomSelect={handleRoomSelect}
              />
            </div>
            <div className="col-span-3">
              {selectedRoom ? (
                <>
                  <DateSelector
                    currentDate={currentDate}
                    onPrevWeek={handlePrevWeek}
                    onNextWeek={handleNextWeek}
                    onDateSelect={setCurrentDate}
                  />
                  <WeeklyCalendar
                    room={selectedRoom}
                    connectedRoom={getConnectedRoom()}
                    currentDate={currentDate}
                    reservations={reservations}
                    holidays={holidays}
                    currentUser={user}
                    onAddReservation={handleAddReservation}
                    onUpdateReservation={handleUpdateReservation}
                    onDeleteReservation={handleDeleteReservation}
                  />
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                  左の会議室一覧から会議室を選択してください
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;