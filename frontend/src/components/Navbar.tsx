import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BuildIcon from '@mui/icons-material/Build';
import TimelineIcon from '@mui/icons-material/Timeline';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const { toggleTheme, mode } = useTheme();

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: mode === 'light' 
          ? 'linear-gradient(135deg, #6a1b9a 0%, #9c4dcc 100%)'
          : undefined,
        boxShadow: 'none',
        borderBottom: mode === 'light' ? '1px solid rgba(255, 255, 255, 0.1)' : undefined
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            background: mode === 'light' ? 'linear-gradient(45deg, #ffffff 30%, #e1bee7 90%)' : undefined,
            WebkitBackgroundClip: mode === 'light' ? 'text' : undefined,
            WebkitTextFillColor: mode === 'light' ? 'transparent' : undefined,
          }}
        >
          AlgoDex
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<ShowChartIcon />}
            sx={{
              '&:hover': {
                background: mode === 'light' ? 'rgba(255, 255, 255, 0.1)' : undefined,
              }
            }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/strategy-builder"
            startIcon={<BuildIcon />}
            sx={{
              '&:hover': {
                background: mode === 'light' ? 'rgba(255, 255, 255, 0.1)' : undefined,
              }
            }}
          >
            Strategy Builder
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/backtesting"
            startIcon={<TimelineIcon />}
            sx={{
              '&:hover': {
                background: mode === 'light' ? 'rgba(255, 255, 255, 0.1)' : undefined,
              }
            }}
          >
            Backtesting
          </Button>
          <IconButton 
            onClick={toggleTheme} 
            color="inherit"
            sx={{
              '&:hover': {
                background: mode === 'light' ? 'rgba(255, 255, 255, 0.1)' : undefined,
              }
            }}
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 