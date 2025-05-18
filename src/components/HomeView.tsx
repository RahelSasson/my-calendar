//Home screen view for the mood tracker, which displays: 
//The current week calendar 
//Mood emojis that can be selected by the user to choose their mood for that day 
//A textarea for diary entries 
//A save button that isnt functional yet 
//Allows for nivagtion between weeks just as Calendar.tsx allows for navigation between months 

import React, { useState, useEffect } from 'react';
import './homeStyles.css';

interface Entry {
  mood?: string;
  note?: string;
}

interface HomeViewProps {
  entries: Record<string, Entry>;
  setEntries: React.Dispatch<React.SetStateAction<Record<string, Entry>>>;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function formatKey(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const getStartOfWeek = (date: Date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  start.setHours(0, 0, 0, 0);
  return start;
};

const generateWeekDates = (start: Date) =>
  Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date;
  });

const HomeView = ({ entries, setEntries }: HomeViewProps) => {
  const [currentStartOfWeek, setCurrentStartOfWeek] = useState(getStartOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [note, setNote] = useState('');

  useEffect(() => {
    const key = formatKey(selectedDate);
    setNote(entries[key]?.note || '');
  }, [selectedDate, entries]);

  const weekDates = generateWeekDates(currentStartOfWeek);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleMoodSelect = (mood: string) => {
    const key = formatKey(selectedDate);
    setEntries(prev => ({
      ...prev,
      [key]: {
        ...prev[key],  
        mood,
      }
    }));
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedNote = e.target.value;
    setNote(updatedNote);
    const key = formatKey(selectedDate);
    setEntries(prev => ({
      ...prev,
      [key]: {
        ...prev[key],  // merge with existing mood 
        note: updatedNote,
      }
    }));
  };

  const handlePreviousWeek = () => {
    const newStart = new Date(currentStartOfWeek);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentStartOfWeek(newStart);
    setSelectedDate(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(currentStartOfWeek);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentStartOfWeek(newStart);
    setSelectedDate(newStart);
  };

  const selectedKey = formatKey(selectedDate);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="arrow left" onClick={handlePreviousWeek}>&lt;</button>

        <div style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
          {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </div>

        <button className="arrow right" onClick={handleNextWeek}>&gt;</button>
      </div>

      <div className="week-days">
        {weekDates.map((date, index) => {
          const isSelected = formatKey(date) === selectedKey;
          return (
            <div
              key={index}
              className={`day-item ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDayClick(date)}
            >
              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{date.getDate()}</div>
              <div>{daysOfWeek[date.getDay()]}</div>
            </div>
          );
        })}
      </div>

      <div className="home-prompt">How are you feeling today?</div>

      <div className="emoji-picker">
        {[
          { emoji: '😄', label: 'Happy' },
          { emoji: '😐', label: 'Meh' },
          { emoji: '😢', label: 'Sad' },
          { emoji: '😠', label: 'Angry' },
          { emoji: '😴', label: 'Tired' },
          { emoji: '🤩', label: 'Excited' },
          { emoji: '😰', label: 'Anxious' },
          { emoji: '🥰', label: 'Loved' },
          { emoji: '😎', label: 'Cool' },
          { emoji: '🤯', label: 'Overwhelmed' },
        ].map(({ emoji, label }) => {
          const isSelected = entries[selectedKey]?.mood === emoji;
          return (
            <div
              key={label}
              className={`emoji-bubble ${isSelected ? 'selected' : ''}`}
              onClick={() => handleMoodSelect(emoji)}
            >
              <button className={`emoji-option ${isSelected ? 'selected' : ''}`}>
                {emoji}
              </button>
              <div className="emoji-label">{label}</div>
            </div>
          );
        })}
      </div>

      <textarea
        className="note-area"
        placeholder="Write a note about your day..."
        value={note}
        onChange={handleNoteChange}
      />

      <button className="save-button" onClick={() => {}}>
        Save
      </button>
    </div>
  );
};

export default HomeView;
