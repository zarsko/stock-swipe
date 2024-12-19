import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CandlestickElement,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CandlestickElement
);

const StockChart = ({ data }) => {
  const chartData = {
    datasets: [
      {
        label: 'מחיר',
        data: data?.ohlc?.map(item => ({
          x: new Date(item.timestamp),
          o: item.open,
          h: item.high,
          l: item.low,
          c: item.close
        })) || [],
        type: 'candlestick',
      },
      {
        label: 'נפח מסחר',
        data: data?.ohlc?.map(item => ({
          x: new Date(item.timestamp),
          y: item.volume
        })) || [],
        type: 'bar',
        yAxisID: 'volume',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        barThickness: 'flex',
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const point = context.raw;
            return [
              `פתיחה: $${point.o?.toFixed(2)}`,
              `גבוה: $${point.h?.toFixed(2)}`,
              `נמוך: $${point.l?.toFixed(2)}`,
              `סגירה: $${point.c?.toFixed(2)}`,
              `נפח: ${point.y?.toLocaleString()}`
            ].filter(Boolean);
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: data?.timeframe?.includes('W') ? 'day' : 
                data?.timeframe?.includes('M') ? 'week' : 'month',
          displayFormats: {
            day: 'dd/MM',
            week: 'MM/yyyy',
            month: 'MM/yyyy'
          }
        },
        display: true,
        grid: {
          display: false
        }
      },
      y: {
        display: true,
        position: 'right',
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      volume: {
        display: true,
        position: 'left',
        grid: {
          display: false
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <Chart type='candlestick' data={chartData} options={options} />
    </div>
  );
};

export default StockChart;
