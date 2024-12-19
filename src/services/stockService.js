const TIMEFRAMES = {
  easy: ['1W', '2W'], // שבוע עד שבועיים
  medium: ['1M', '3M'], // חודש עד שלושה חודשים
  hard: ['6M', '1Y'] // חצי שנה עד שנה
};

const STOCK_PATTERNS = [
  {
    symbol: 'AAPL',
    name: 'Apple',
    period: '2020-03',
    timeframe: '1M',
    trend: 'up',
    explanation: 'התאוששות מהירה אחרי משבר הקורונה עם נרות ירוקים חזקים ועליה בווליום'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA',
    period: '2023-05',
    timeframe: '2W',
    trend: 'up',
    explanation: 'פריצת שיא כל הזמנים עם גאפ למעלה ונפח מסחר חריג על רקע טרנד ה-AI'
  },
  {
    symbol: 'META',
    name: 'Meta (Facebook)',
    period: '2022-02',
    timeframe: '1M',
    trend: 'down',
    explanation: 'שבירת תמיכה ארוכת טווח עם נפח מסחר גבוה על רקע ירידה ברווחיות הפרסום'
  },
  {
    symbol: 'BTC-USD',
    name: 'Bitcoin',
    period: '2021-11',
    timeframe: '1M',
    trend: 'down',
    explanation: 'היפוך מגמה חד בשיא כל הזמנים עם נפח מסחר חריג',
    difficulty: 'hard'
  }
];

const fetchHistoricalData = async (symbol, period, timeframe) => {
  try {
    // כאן נשתמש ב-API אמיתי כמו Alpha Vantage או Yahoo Finance
    const response = await fetch(
      `https://your-api.com/historical/${symbol}?period=${period}&timeframe=${timeframe}`
    );
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch historical data:', error);
    return null;
  }
};

const getRandomStock = async (difficulty) => {
  const possibleTimeframes = TIMEFRAMES[difficulty];
  const timeframe = possibleTimeframes[Math.floor(Math.random() * possibleTimeframes.length)];
  
  const patterns = STOCK_PATTERNS.filter(p => {
    if (difficulty === 'easy') {
      return p.timeframe === timeframe && p.trend === 'up';
    }
    if (difficulty === 'medium') {
      return p.timeframe === timeframe;
    }
    return true;
  });

  const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  const historicalData = await fetchHistoricalData(
    selectedPattern.symbol,
    selectedPattern.period,
    timeframe
  );

  if (!historicalData) {
    return generateOHLCData(difficulty);
  }

  return {
    ohlc: historicalData,
    trend: selectedPattern.trend,
    explanation: selectedPattern.explanation,
    stockName: selectedPattern.name,
    timeframe: timeframe
  };
};

const generateOHLCData = (difficulty) => {
  const days = 14;
  const data = [];
  let basePrice = 100;
  let date = new Date();
  date.setDate(date.getDate() - days);

  const volatility = {
    easy: 0.02,
    medium: 0.03,
    hard: 0.05
  }[difficulty];

  const trendBias = difficulty === 'easy' ? (Math.random() > 0.5 ? 0.3 : -0.3) : 0;

  for (let i = 0; i < days; i++) {
    const change = basePrice * volatility * (Math.random() - 0.5 + trendBias);
    
    const open = basePrice;
    const close = basePrice + change;
    const high = Math.max(open, close) + (basePrice * volatility * Math.random());
    const low = Math.min(open, close) - (basePrice * volatility * Math.random());
    
    data.push({
      timestamp: new Date(date),
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 1000000)
    });

    basePrice = close;
    date.setDate(date.getDate() + 1);
  }

  const trend = basePrice > 100 ? 'up' : 'down';
  const explanation = generateExplanation(data, trend);

  return {
    ohlc: data,
    trend,
    explanation
  };
};

const generateExplanation = (data, trend) => {
  if (trend === 'up') {
    return 'ניתן לראות מגמת עליה ברורה עם נרות ירוקים חזקים ועליה בווליום המסחר';
  }
  return 'ניתן לראות מגמת ירידה עם נרות אדומים ולחץ מכירות שמשתקף בווליום';
};

export const stockService = {
  getRandomStock
};
