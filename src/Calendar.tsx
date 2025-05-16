import React from 'react';
import './Calendar.css'; 

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="nav-button">←</button>
        <h2 className="month-label">May 2025</h2>
        <button className="nav-button">→</button>
      </div>

      {/* Weekday Labels */}
      <div className="calendar-weekdays">
        {weekdays.map((day) => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="calendar-grid">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="calendar-day" />
        ))}
      </div>
    </div>
  );
}
