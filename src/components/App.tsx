import React from 'react';
import logo from './logo.svg';
import Calendar from './Calendar';
import MoodTrackerApp from './MoodTrackerApp';

import { MoodProvider } from '../context/MoodContext';

export default function App() {
  return (
    <MoodProvider>
      <MoodTrackerApp />
    </MoodProvider>
  );
}
