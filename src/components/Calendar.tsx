//Displays Moods per day and color associated with that mood, using emoji icons 
//Allows the user to navigate between months and years (2025-2030)
//Opens a mood picker when a date is clicked, letting users choose a mood for a specific day 
//Stores selected mood data in the entries state, which is synched wit the rest of the app 

import React, { useState } from 'react';
import { getDay, getDaysInMonth, format } from 'date-fns';
import MoodPicker from './MoodPicker';
import moodColors from './moodColors'; 
import './Calendar.css';

interface Entry {
  mood?: string;
  note?: string;
}

interface CalendarProps {
  entries: Record<string, Entry>;
  setEntries: React.Dispatch<React.SetStateAction<Record<string, Entry>>>;
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const START_YEAR = 2025;
const END_YEAR = 2030;

function formatKey(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function Calendar({ entries, setEntries }: CalendarProps) {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

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
    const key = formatKey(selectedDate);
    setEntries(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        mood: mood.emoji,
      },
    }));
    setShowMoodPicker(false);
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="arrow left" onClick={goToPreviousMonth}>
          &lt;
        </button>
        <h2 className="month-label">{format(new Date(year, month), 'MMMM yyyy')}</h2>
        <button className="arrow right" onClick={goToNextMonth}>
          &gt;
        </button>
      </div>

      <div className="calendar-weekdays">
        {weekdays.map(day => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarSlots.map((day, i) => {
          const key = day ? formatKey(new Date(year, month, day)) : `blank-${i}`;
          const mood = day ? entries[key]?.mood : undefined;
          const bgColor = mood ? moodColors[mood] : '#d3e7f7'; 

          return (
            <div
              key={key}
              className="calendar-day"
              onClick={e => day && handleDayClick(day, e)}
              style={{
                cursor: day ? 'pointer' : 'default',
                position: 'relative',
                backgroundColor: bgColor,
              }}
            >
              {day && (
                <>
                  <span>{day}</span>
                  {mood && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 4,
                        right: 4,
                        fontSize: '1.7rem',
                      }}
                      aria-label="Mood emoji"
                    >
                      {mood}
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
          <MoodPicker date={selectedDate} onClose={() => setShowMoodPicker(false)} onSelectMood={handleMoodSelect} />
        </div>
      )}
    </div>
  );
}
