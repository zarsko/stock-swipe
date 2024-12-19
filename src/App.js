import React from 'react';
import { GameProvider } from './context/GameContext';
import SwipeCard from './components/SwipeCard';
import { Box } from '@mui/material';

function App() {
  const handleSwipe = (direction, isCorrect) => {
    console.log(`Swiped ${direction}, Correct: ${isCorrect}`);
  };

  return (
    <GameProvider>
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        bgcolor: '#f5f5f5'
      }}>
        <SwipeCard onSwipe={handleSwipe} />
      </Box>
    </GameProvider>
  );
}

export default App;
