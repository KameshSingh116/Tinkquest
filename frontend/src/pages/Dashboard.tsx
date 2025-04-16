import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, LinearProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { MarketData } from '../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PortfolioSummary {
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  positions: {
    symbol: string;
    quantity: number;
    currentPrice: number;
    totalValue: number;
    dailyChange: number;
  }[];
}

interface RecentTrade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stockData, setStockData] = useState<any>(null);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary>({
    totalValue: 100000,
    dailyChange: 1500,
    dailyChangePercent: 1.5,
    positions: [
      {
        symbol: 'AAPL',
        quantity: 100,
        currentPrice: 150.25,
        totalValue: 15025,
        dailyChange: 125
      },
      {
        symbol: 'MSFT',
        quantity: 50,
        currentPrice: 250.75,
        totalValue: 12537.5,
        dailyChange: 87.5
      }
    ]
  });
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([
    {
      id: '1',
      symbol: 'AAPL',
      type: 'buy',
      quantity: 10,
      price: 149.50,
      timestamp: '2024-03-20T10:30:00Z'
    },
    {
      id: '2',
      symbol: 'MSFT',
      type: 'sell',
      quantity: 5,
      price: 251.25,
      timestamp: '2024-03-20T11:15:00Z'
    }
  ]);

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

  useEffect(() => {
    // Fetch stock data
    fetch('http://localhost:5000/api/stock/AAPL')
      .then(response => response.json())
      .then(data => {
        const chartData = {
          labels: data.dates,
          datasets: [
            {
              label: 'AAPL Price',
              data: data.prices,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        };
        setStockData(chartData);
      })
      .catch(error => console.error('Error fetching stock data:', error));
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
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Portfolio Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Portfolio Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Value
                    </Typography>
                    <Typography variant="h5">
                      ${portfolioSummary.totalValue.toLocaleString()}
                    </Typography>
                    <Typography 
                      color={portfolioSummary.dailyChange >= 0 ? 'success.main' : 'error.main'}
                      variant="body2"
                    >
                      {portfolioSummary.dailyChange >= 0 ? '+' : ''}
                      ${portfolioSummary.dailyChange.toLocaleString()} 
                      ({portfolioSummary.dailyChangePercent.toFixed(2)}%)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {portfolioSummary.positions.map((position) => (
                <Grid item xs={4} key={position.symbol}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{position.symbol}</Typography>
                      <Typography color="textSecondary">
                        {position.quantity} shares
                      </Typography>
                      <Typography variant="h6">
                        ${position.totalValue.toLocaleString()}
                      </Typography>
                      <Typography 
                        color={position.dailyChange >= 0 ? 'success.main' : 'error.main'}
                        variant="body2"
                      >
                        {position.dailyChange >= 0 ? '+' : ''}
                        ${position.dailyChange.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Stock Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            {stockData && (
              <Line options={chartOptions} data={stockData} />
            )}
          </Paper>
        </Grid>

        {/* Recent Trades */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Trades
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>{trade.symbol}</TableCell>
                      <TableCell>
                        <Typography 
                          color={trade.type === 'buy' ? 'success.main' : 'error.main'}
                        >
                          {trade.type.toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{trade.quantity}</TableCell>
                      <TableCell align="right">${trade.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 