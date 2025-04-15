import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BuildIcon from '@mui/icons-material/Build';
import TimelineIcon from '@mui/icons-material/Timeline';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AlgoBlocks
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<ShowChartIcon />}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/strategy-builder"
            startIcon={<BuildIcon />}
          >
            Strategy Builder
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/backtesting"
            startIcon={<TimelineIcon />}
          >
            Backtesting
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 