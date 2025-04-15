import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import 'chart.js/auto';
import axios from 'axios';
import { MarketData } from '../types';

const Dashboard: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/market-data/AAPL');
        setMarketData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch market data');
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  const chartData = {
    labels: marketData?.dates || [],
    datasets: [
      {
        label: 'Stock Price',
        data: marketData?.prices || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'AAPL Stock Price',
      },
    },
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Market Overview
            </Typography>
            <Box sx={{ height: 400 }}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Performance
            </Typography>
            {/* Add performance metrics here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Strategies
            </Typography>
            {/* Add active strategies list here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 