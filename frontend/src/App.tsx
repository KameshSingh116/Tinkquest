import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import StrategyBuilder from './pages/StrategyBuilder';
import Backtesting from './pages/Backtesting';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/strategy-builder" element={<StrategyBuilder />} />
          <Route path="/backtesting" element={<Backtesting />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; 