//Allows for the user to switch between views of the Calendar and Home pages. 
//Keeps the user entries in sync across both views 
//Stores and manages mood and diary entries by date via local storage 

import React from 'react';
import Calendar from './Calendar';
import HomeView from './HomeView';
import './MoodTrackerApp.css';

export default function MoodTrackerApp() {
  const [entries, setEntries] = React.useState<Record<string, { mood?: string; note?: string }>>({});

  const [activeTab, setActiveTab] = React.useState<'calendar' | 'home'>('calendar');

  return (
    <div className="page">
      <h1 className="app-header">My Mood Diary</h1>

      <div className="tab-bar">
        <button
          className={`tab-button ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
          aria-label="Calendar tab"
        >
          Calendar
        </button>

        <button
          className={`tab-button ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
          aria-label="Home tab"
        >
          Home
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'calendar' && <Calendar entries={entries} setEntries={setEntries} />}
        {activeTab === 'home' && <HomeView entries={entries} setEntries={setEntries} />}
      </div>
    </div>
  );
}
