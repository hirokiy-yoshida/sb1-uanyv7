import React, { useState, useRef } from 'react';
import { Room, Reservation, User, Holiday } from '../types';
import { ReservationModal } from './ReservationModal';
import { ReservationDetails } from './ReservationDetails';
import { ConnectedRoomAlert } from './ConnectedRoomAlert';
import { ReservationChangeConfirm } from './ReservationChangeConfirm';

interface WeeklyCalendarProps {
  room: Room;
  connectedRoom: Room | null;
  currentDate: Date;
  reservations: Reservation[];
  holidays: Holiday[];
  currentUser: User;
  onAddReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateReservation: (reservation: Reservation) => void;
  onDeleteReservation: (reservationId: string) => void;
}

interface DragState {
  reservation: Reservation;
  startSlot: { date: Date; hour: number; minute: number };
  originalStartTime: Date;
  originalEndTime: Date;
  duration: number; // Duration in milliseconds
}

export function WeeklyCalendar({
  room,
  connectedRoom,
  currentDate,
  reservations = [],
  holidays = [],
  currentUser,
  onAddReservation,
  onUpdateReservation,
  onDeleteReservation,
}: WeeklyCalendarProps) {
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    hour: number;
    minute: number;
  } | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showConnectedAlert, setShowConnectedAlert] = useState(false);
  const [useConnectedRoom, setUseConnectedRoom] = useState(false);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [showChangeConfirm, setShowChangeConfirm] = useState(false);
  const [proposedChange, setProposedChange] = useState<{
    reservation: Reservation;
    newStartTime: Date;
    newEndTime: Date;
  } | null>(null);

  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? 0 : 30;
    return { hour, minute };
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    const currentDay = date.getDay();
    const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    date.setDate(date.getDate() + daysToMonday + i);
    return date;
  });

  const isHoliday = (date: Date) => {
    return holidays.some(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.getFullYear() === date.getFullYear() &&
             holidayDate.getMonth() === date.getMonth() &&
             holidayDate.getDate() === date.getDate();
    });
  };

  const getHolidayName = (date: Date) => {
    const holiday = holidays.find(h => {
      const holidayDate = new Date(h.date);
      return holidayDate.getFullYear() === date.getFullYear() &&
             holidayDate.getMonth() === date.getMonth() &&
             holidayDate.getDate() === date.getDate();
    });
    return holiday?.name;
  };

  const isUnderMaintenance = (date: Date, hour: number, minute: number = 0) => {
    if (!room.maintenance?.isUnderMaintenance) return false;
    
    const timeSlot = new Date(date);
    timeSlot.setHours(hour, minute, 0, 0);
    
    return timeSlot >= room.maintenance.startDate && 
           timeSlot <= room.maintenance.endDate;
  };

  const getReservationForSlot = (date: Date, hour: number, minute: number) => {
    if (!Array.isArray(reservations)) return null;
    
    const slotTime = new Date(date);
    slotTime.setHours(hour, minute, 0, 0);

    return reservations.find(reservation => {
      const start = new Date(reservation.startTime);
      const end = new Date(reservation.endTime);
      const actualEnd = reservation.actualEndTime;
      
      if (reservation.status === 'COMPLETED' && actualEnd) {
        return slotTime >= start && slotTime < actualEnd &&
          (reservation.roomId === room.id || reservation.connectedRoomId === room.id);
      }
      
      return slotTime >= start && slotTime < end &&
        (reservation.roomId === room.id || reservation.connectedRoomId === room.id);
    });
  };

  const isStartOfReservation = (date: Date, hour: number, minute: number, reservation: Reservation) => {
    const slotTime = new Date(date);
    slotTime.setHours(hour, minute, 0, 0);
    const startTime = new Date(reservation.startTime);
    
    return slotTime.getTime() === startTime.getTime();
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-green-50 hover:bg-green-100';
      case 'COMPLETED':
        return 'bg-gray-50 hover:bg-gray-100';
      default:
        return 'bg-blue-50 hover:bg-blue-100';
    }
  };

  const getStatusText = (status: Reservation['status']) => {
    switch (status) {
      case 'IN_PROGRESS':
        return '利用中';
      case 'COMPLETED':
        return '利用終了';
      default:
        return '';
    }
  };

  const handleSlotClick = (date: Date, hour: number, minute: number) => {
    if (isHoliday(date)) return;
    
    const reservation = getReservationForSlot(date, hour, minute);
    if (reservation) {
      setSelectedReservation(reservation);
    } else if (!isUnderMaintenance(date, hour, minute)) {
      if (room.type === 'CONNECTED' && connectedRoom) {
        setShowConnectedAlert(true);
        setSelectedSlot({ date, hour, minute });
      } else {
        setSelectedSlot({ date, hour, minute });
      }
    }
  };

  const handleConnectedRoomConfirm = (useConnected: boolean) => {
    setUseConnectedRoom(useConnected);
    setShowConnectedAlert(false);
  };

  const handleReservationSubmit = (data: {
    startTime: Date;
    endTime: Date;
    title: string;
  }) => {
    onAddReservation({
      ...data,
      roomId: room.id,
      connectedRoomId: useConnectedRoom ? connectedRoom?.id : undefined,
      organizer: {
        id: currentUser.id,
        name: currentUser.name,
      },
      description: '',
      attendees: [currentUser.name],
      status: 'SCHEDULED',
    });
    setSelectedSlot(null);
    setUseConnectedRoom(false);
  };

  const handleDragStart = (e: React.DragEvent, date: Date, hour: number, minute: number) => {
    const reservation = getReservationForSlot(date, hour, minute);
    if (!reservation || reservation.status !== 'SCHEDULED') return;

    if (reservation.organizer.id !== currentUser.id && currentUser.role !== 'ADMIN') return;

    const startTime = new Date(reservation.startTime);
    const endTime = new Date(reservation.endTime);
    const duration = endTime.getTime() - startTime.getTime();

    e.stopPropagation();
    setDragState({
      reservation,
      startSlot: { date, hour, minute },
      originalStartTime: startTime,
      originalEndTime: endTime,
      duration,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, date: Date, hour: number, minute: number) => {
    e.preventDefault();
    if (!dragState) return;

    const dropTime = new Date(date);
    dropTime.setHours(hour, minute, 0, 0);

    // Calculate new start and end times maintaining the original duration
    const newStartTime = dropTime;
    const newEndTime = new Date(newStartTime.getTime() + dragState.duration);

    // Check if the new time slot is valid
    if (isHoliday(date) || isUnderMaintenance(date, hour, minute)) {
      setDragState(null);
      return;
    }

    // Check for conflicts with existing reservations
    const hasConflict = reservations.some(res => {
      if (res.id === dragState.reservation.id) return false;
      const resStart = new Date(res.startTime);
      const resEnd = new Date(res.endTime);
      return (
        (newStartTime >= resStart && newStartTime < resEnd) ||
        (newEndTime > resStart && newEndTime <= resEnd) ||
        (newStartTime <= resStart && newEndTime >= resEnd)
      );
    });

    if (hasConflict) {
      setDragState(null);
      return;
    }

    setProposedChange({
      reservation: dragState.reservation,
      newStartTime,
      newEndTime,
    });
    setShowChangeConfirm(true);
    setDragState(null);
  };

  const handleChangeConfirm = (confirmed: boolean) => {
    if (confirmed && proposedChange) {
      onUpdateReservation({
        ...proposedChange.reservation,
        startTime: proposedChange.newStartTime,
        endTime: proposedChange.newEndTime,
        updatedAt: new Date(),
      });
    }
    setShowChangeConfirm(false);
    setProposedChange(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-8 border-b">
        <div className="p-4 border-r text-sm text-gray-500">時間</div>
        {weekDays.map((date) => {
          const holiday = isHoliday(date);
          const holidayName = getHolidayName(date);
          
          return (
            <div
              key={date.toISOString()}
              className={`p-4 text-center border-r last:border-r-0 ${
                holiday ? 'bg-red-50' : ''
              }`}
            >
              <div className={`text-sm font-medium ${
                holiday ? 'text-red-600' : ''
              }`}>
                {date.toLocaleDateString('ja-JP', { weekday: 'short' })}
              </div>
              <div className={`text-sm ${
                holiday ? 'text-red-600' : 'text-gray-500'
              }`}>
                {date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
              </div>
              {holiday && (
                <div className="text-xs text-red-500 mt-1">
                  {holidayName}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-8">
        <div className="border-r">
          {timeSlots.map(({ hour, minute }) => (
            <div
              key={`${hour}-${minute}`}
              className="h-12 border-b text-sm text-gray-500 px-2 py-1"
            >
              {`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}
            </div>
          ))}
        </div>

        {weekDays.map((date) => {
          const holiday = isHoliday(date);
          
          return (
            <div 
              key={date.toISOString()} 
              className="border-r last:border-r-0"
              onDragOver={handleDragOver}
            >
              {timeSlots.map(({ hour, minute }) => {
                const isMaintenance = isUnderMaintenance(date, hour, minute);
                const reservation = getReservationForSlot(date, hour, minute);
                const isStart = reservation && isStartOfReservation(date, hour, minute, reservation);
                const canDrag = reservation?.status === 'SCHEDULED' && 
                              (reservation.organizer.id === currentUser.id || currentUser.role === 'ADMIN');

                return (
                  <div
                    key={`${hour}-${minute}`}
                    onClick={() => handleSlotClick(date, hour, minute)}
                    onDragStart={(e) => handleDragStart(e, date, hour, minute)}
                    onDrop={(e) => handleDrop(e, date, hour, minute)}
                    draggable={canDrag}
                    className={`h-12 border-b relative ${
                      holiday
                        ? 'bg-red-50 cursor-not-allowed'
                        : isMaintenance
                        ? 'bg-red-50 cursor-not-allowed'
                        : reservation
                        ? `${getStatusColor(reservation.status)} ${canDrag ? 'cursor-move' : ''}`
                        : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    {holiday && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs text-red-600 font-medium px-2 py-1">
                          休日
                        </span>
                      </div>
                    )}
                    {isMaintenance && !holiday && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs text-red-600 font-medium px-2 py-1">
                          メンテナンス中
                        </span>
                      </div>
                    )}
                    {reservation && isStart && !holiday && !isMaintenance && (
                      <div className="absolute inset-x-0 top-0 p-1">
                        <div className="text-xs font-medium text-gray-900">
                          {reservation.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {reservation.organizer.name}
                        </div>
                        {reservation.status !== 'SCHEDULED' && (
                          <div className={`text-xs ${
                            reservation.status === 'IN_PROGRESS' 
                              ? 'text-green-600' 
                              : 'text-gray-600'
                          }`}>
                            {getStatusText(reservation.status)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {showConnectedAlert && selectedSlot && (
        <ConnectedRoomAlert
          room={room}
          connectedRoom={connectedRoom!}
          onConfirm={handleConnectedRoomConfirm}
          onClose={() => {
            setShowConnectedAlert(false);
            setSelectedSlot(null);
          }}
        />
      )}

      {selectedSlot && !showConnectedAlert && (
        <ReservationModal
          room={room}
          connectedRoom={useConnectedRoom ? connectedRoom : null}
          date={selectedSlot.date}
          hour={selectedSlot.hour}
          minute={selectedSlot.minute}
          currentUser={currentUser}
          onClose={() => {
            setSelectedSlot(null);
            setUseConnectedRoom(false);
          }}
          onSubmit={handleReservationSubmit}
        />
      )}

      {selectedReservation && (
        <ReservationDetails
          reservation={selectedReservation}
          room={room}
          connectedRoom={connectedRoom}
          currentUser={currentUser}
          onClose={() => setSelectedReservation(null)}
          onUpdate={onUpdateReservation}
          onDelete={onDeleteReservation}
        />
      )}

      {showChangeConfirm && proposedChange && (
        <ReservationChangeConfirm
          reservation={proposedChange.reservation}
          originalStartTime={proposedChange.reservation.startTime}
          originalEndTime={proposedChange.reservation.endTime}
          newStartTime={proposedChange.newStartTime}
          newEndTime={proposedChange.newEndTime}
          onConfirm={handleChangeConfirm}
          onClose={() => {
            setShowChangeConfirm(false);
            setProposedChange(null);
          }}
        />
      )}
    </div>
  );
}