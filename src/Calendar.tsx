import React, { useState } from 'react';
import { getDay, getDaysInMonth, format } from 'date-fns';
import MoodPicker from './MoodPicker';
import './Calendar.css';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const START_YEAR = 2025;
const END_YEAR = 2030;

export default function Calendar() {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [moodByDay, setMoodByDay] = useState<{ [key: string]: string }>({});

  const date = new Date(year, month);
  const daysInMonth = getDaysInMonth(date);
  const firstDayOfWeek = getDay(new Date(year, month, 1));
  const blanks = Array.from({ length: firstDayOfWeek }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarSlots = [...blanks, ...days];

  const goToPreviousMonth = () => {
    if (year === START_YEAR && month === 0) return;
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const goToNextMonth = () => {
    if (year === END_YEAR && month === 11) return;
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  const handleDayClick = (day: number, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
    setSelectedDate(new Date(year, month, day));
    setPickerPosition({ top: rect.top - 130, left: rect.left + 40 }); 
    setShowMoodPicker(true);
  };

  const handleMoodSelect = (mood: { emoji: string }) => {
    if (!selectedDate) return;
    const key = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
    setMoodByDay((prev) => ({ ...prev, [key]: mood.emoji }));
    setShowMoodPicker(false);
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="nav-button" onClick={goToPreviousMonth}>←</button>
        <h2 className="month-label">{format(new Date(year, month), 'MMMM yyyy')}</h2>
        <button className="nav-button" onClick={goToNextMonth}>→</button>
      </div>

      <div className="calendar-weekdays">
        {weekdays.map((day) => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarSlots.map((day, i) => {
          const key = day ? `${year}-${month + 1}-${day}` : `blank-${i}`;
          return (
            <div
              key={key}
              className="calendar-day"
              onClick={(e) => day && handleDayClick(day, e)}
              style={{ cursor: day ? 'pointer' : 'default', position: 'relative' }}
            >
              {day && (
                <>
                  <span>{day}</span>
                  {moodByDay[key] && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 4,
                        right: 4,
                        fontSize: '1.7rem',
                      }}
                      aria-label="Mood emoji"
                    >
                      {moodByDay[key]}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {showMoodPicker && selectedDate && (
        <div
          style={{
            position: 'fixed',
            top: pickerPosition.top,
            left: pickerPosition.left,
            zIndex: 1000,
          }}
        >
          <MoodPicker
            date={selectedDate}
            onClose={() => setShowMoodPicker(false)}
            onSelectMood={handleMoodSelect}
          />
        </div>
      )}
    </div>
  );
}
