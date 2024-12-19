import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ResultFeedback = ({ result, onNext }) => {
  const { isCorrect, explanation, stockName } = result;

  return (
    <Box className="feedback-container">
      <Box className="feedback-header" sx={{ 
        display: 'flex', 
        alignItems: 'center',
        color: isCorrect ? 'success.main' : 'error.main' 
      }}>
        {isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
        <Typography variant="h6" sx={{ ml: 1 }}>
          {isCorrect ? 'צדקת!' : 'לא מדויק'}
        </Typography>
      </Box>

      <Typography variant="body1" sx={{ mt: 2 }}>
        {stockName}
      </Typography>

      <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
        {explanation}
      </Typography>

      <Button 
        variant="contained" 
        color="primary"
        onClick={onNext}
        fullWidth
      >
        המשך למניה הבאה
      </Button>
    </Box>
  );
};

export default ResultFeedback;
