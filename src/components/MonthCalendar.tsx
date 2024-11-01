import React from 'react';

interface MonthCalendarProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
}

export function MonthCalendar({ currentDate, onDateSelect }: MonthCalendarProps) {
  const today = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Adjust to start from Monday
  const startDate = new Date(firstDayOfMonth);
  const firstDayOfWeek = startDate.getDay();
  const daysToMonday = firstDayOfWeek === 0 ? -6 : 1 - firstDayOfWeek;
  startDate.setDate(startDate.getDate() + daysToMonday);
  
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  const endDate = new Date(lastDayOfMonth);
  const lastDayOfWeek = endDate.getDay();
  const daysToSunday = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
  endDate.setDate(endDate.getDate() + daysToSunday);
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(new Date(date));
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-64">
      <div className="text-center mb-4">
        {currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['月', '火', '水', '木', '金', '土', '日'].map((day) => (
          <div key={day} className="text-center text-sm text-gray-500 py-1">
            {day}
          </div>
        ))}
        {weeks.map((week, weekIndex) =>
          week.map((date, dateIndex) => {
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === currentDate.toDateString();

            return (
              <button
                key={`${weekIndex}-${dateIndex}`}
                onClick={() => onDateSelect(date)}
                className={`
                  p-2 text-sm rounded-full w-8 h-8 flex items-center justify-center
                  ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${isToday ? 'bg-blue-100' : ''}
                  ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}
                `}
              >
                {date.getDate()}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}