import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import StockChart from './StockChart';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useGame } from '../context/GameContext';
import './SwipeCard.css';
import { stockService } from '../services/stockService';

const SwipeCard = ({ onSwipe }) => {
  const { DIFFICULTY_SETTINGS, difficulty } = useGame();
  const [stockData, setStockData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_SETTINGS[difficulty].timeLimit);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    loadNewStock();
  }, [difficulty]);

  useEffect(() => {
    if (!isLoading && !showFeedback) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoading, showFeedback]);

  const loadNewStock = async () => {
    setIsLoading(true);
    setShowFeedback(false);
    const data = await stockService.getRandomStock(difficulty);
    setStockData(data);
    setTimeLeft(DIFFICULTY_SETTINGS[difficulty].timeLimit);
    setIsLoading(false);
  };

  const handleTimeout = () => {
    setShowFeedback(true);
    onSwipe('timeout', false);
  };

  const handleSwipe = (direction) => {
    setShowFeedback(true);
    const isCorrect = (direction === 'right' && stockData.trend === 'up') ||
                     (direction === 'left' && stockData.trend === 'down');
    onSwipe(direction, isCorrect);
  };

  const handleNext = () => {
    loadNewStock();
  };

  if (isLoading) {
    return (
      <Box className="swipe-container loading">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="swipe-container">
      <Box className="timer-wrapper">
        <CircularProgress
          variant="determinate"
          value={(timeLeft / DIFFICULTY_SETTINGS[difficulty].timeLimit) * 100}
          className={timeLeft < 5 ? 'timer-critical' : ''}
        />
        <Typography className="timer-text">{timeLeft}</Typography>
      </Box>

      <TinderCard
        onSwipe={handleSwipe}
        preventSwipe={['up', 'down']}
        className="swipe-card"
      >
        <Box className="card-content">
          <Typography variant="subtitle2" className="timeframe-label">
            {stockData.timeframe}
          </Typography>
          
          <StockChart data={stockData} />
          
          <Box className="action-buttons">
            <IconButton 
              className="swipe-button short"
              onClick={() => handleSwipe('left')}
            >
              <CloseIcon />
              <Typography variant="caption">Short</Typography>
            </IconButton>
            
            <IconButton 
              className="swipe-button long"
              onClick={() => handleSwipe('right')}
            >
              <CheckIcon />
              <Typography variant="caption">Long</Typography>
            </IconButton>
          </Box>
        </Box>
      </TinderCard>

      {showFeedback && (
        <ResultFeedback
          result={stockData}
          onNext={handleNext}
        />
      )}
    </Box>
  );
};

export default SwipeCard;
