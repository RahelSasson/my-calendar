//Floating pop up that comes up when the user clicks on a day in the calendar 
//Allows the user to select a mood emoji for a specific day 

import React from 'react';
import './MoodPicker.css';

type Mood = {
  emoji: string;
  label: string;
  description: string;
};

type MoodPickerProps = {
  date: Date;
  onClose: () => void;
  onSelectMood: (mood: Mood) => void;
};

const moods: Mood[] = [
  { emoji: '😄', label: 'Happy', description: 'Happy' },
  { emoji: '😐', label: 'Meh', description: 'Just another day' },
  { emoji: '😢', label: 'Sad', description: 'Sad' },
  { emoji: '😠', label: 'Angry', description: 'Feeling frustrated' },
  { emoji: '😴', label: 'Tired', description: 'Running low on energy' },
  { emoji: '🤩', label: 'Excited', description: 'Excited!' },
  { emoji: '😰', label: 'Anxious', description: 'Anxious' },
  { emoji: '🥰', label: 'Loved', description: 'Loved' },
  { emoji: '😎', label: 'Cool', description: 'Chill and confident' },
  { emoji: '🤯', label: 'Overwhelmed', description: 'Overwhelmed' },
];

export default function MoodPicker({ date, onClose, onSelectMood }: MoodPickerProps) {
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  return (
    <div className="mood-picker-bubble">
      <img
        src="cloud-sun.png"
        alt="Cloud background"
        className="mood-picker-image"
        aria-hidden="true"
        draggable={false}
      />

      <div className="mood-picker-header">
        <span className="mood-picker-title">
          {isToday ? 'How are you feeling today?' : `Modify mood for ${formattedDate}`}
        </span>
        <button className="mood-picker-close" onClick={onClose}>×</button>
      </div>

      <div className="mood-emoji-row">
        {moods.map((mood) => (
          <button
            key={mood.label}
            className="mood-emoji-button"
            onClick={() => onSelectMood(mood)}
            title={mood.description}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
