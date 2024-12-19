import React, { createContext, useState, useContext } from 'react';

const DIFFICULTY_SETTINGS = {
  easy: {
    timeLimit: 30,
    label: 'קל',
    description: 'גרפים ברורים, 30 שניות להחלטה'
  },
  medium: {
    timeLimit: 20,
    label: 'בינוני',
    description: 'גרפים מתקדמים, 20 שניות להחלטה'
  },
  hard: {
    timeLimit: 15,
    label: 'קשה',
    description: 'גרפים מורכבים וקריפטו, 15 שניות להחלטה'
  }
};

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [difficulty, setDifficulty] = useState('easy');
  const [score, setScore] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const startNewGame = () => {
    setScore(0);
    setGameHistory([]);
  };

  const addResult = (result) => {
    setGameHistory(prev => [...prev, result]);
    if (result.isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  return (
    <GameContext.Provider
      value={{
        difficulty,
        setDifficulty,
        score,
        gameHistory,
        DIFFICULTY_SETTINGS,
        startNewGame,
        addResult,
        isAuthenticated,
        setIsAuthenticated,
        userProfile,
        setUserProfile
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
