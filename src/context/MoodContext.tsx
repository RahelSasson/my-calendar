//Creates a global state manager for mood entries across the entire app 
//This allows for any component (in our case HomeView and Calendar)...
//To read and update mood and diary entries without needing to pass props 
//Also saves the mood data to local storage so that its remembered even after a refresh

import React, { createContext, useContext, useEffect, useState } from 'react';

type MoodEntry = {
  mood: string;
  note: string;
};

type MoodData = {
  [date: string]: MoodEntry;
};

type MoodContextType = {
  moodData: MoodData;
  updateMoodData: (date: string, mood: string, note: string) => void;
};

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider = ({ children }: { children: React.ReactNode }) => {
  const [moodData, setMoodData] = useState<MoodData>({});

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('moodData');
    if (stored) {
      setMoodData(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('moodData', JSON.stringify(moodData));
  }, [moodData]);

  const updateMoodData = (date: string, mood: string, note: string) => {
    setMoodData(prev => ({
      ...prev,
      [date]: { mood, note },
    }));
  };

  return (
    <MoodContext.Provider value={{ moodData, updateMoodData }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMoodContext = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error("useMoodContext must be used within a MoodProvider");
  }
  return context;
};
