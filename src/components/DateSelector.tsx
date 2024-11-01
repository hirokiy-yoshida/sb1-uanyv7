import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { MonthCalendar } from './MonthCalendar';

interface DateSelectorProps {
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onDateSelect: (date: Date) => void;
}

export function DateSelector({
  currentDate,
  onPrevWeek,
  onNextWeek,
  onDateSelect,
}: DateSelectorProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate week range starting from Monday
  const weekStart = new Date(currentDate);
  const currentDay = weekStart.getDay();
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  weekStart.setDate(weekStart.getDate() + daysToMonday);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onPrevWeek}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="前週"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-sm text-gray-600">
            {weekStart.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
            {' 〜 '}
            {weekEnd.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
          </div>
          <button
            onClick={onNextWeek}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="次週"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="relative" ref={calendarRef}>
          <button
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {currentDate.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </button>

          {showCalendar && (
            <div className="absolute top-12 right-0 z-50">
              <MonthCalendar
                currentDate={currentDate}
                onDateSelect={(date) => {
                  onDateSelect(date);
                  setShowCalendar(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}