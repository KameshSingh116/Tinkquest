import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const StrategyBuilder: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Strategy Builder
        </Typography>
        <Typography>
          Drag and drop blocks to build your trading strategy.
        </Typography>
      </Paper>
    </Box>
  );
};

export default StrategyBuilder; 