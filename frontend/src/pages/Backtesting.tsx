import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Backtesting: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Backtesting
        </Typography>
        <Typography>
          Test your trading strategy with historical data.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Backtesting; 