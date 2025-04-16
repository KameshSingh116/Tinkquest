import React, { createContext, useContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  toggleTheme: () => void;
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Purple gradient light theme
                primary: {
                  main: '#6a1b9a',
                  light: '#9c4dcc',
                  dark: '#38006b',
                },
                secondary: {
                  main: '#7b1fa2',
                  light: '#ae52d4',
                  dark: '#4a0072',
                },
                background: {
                  default: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#2c003e',
                  secondary: '#4a0072',
                },
              }
            : {
                // Dark theme colors
                primary: {
                  main: '#90caf9',
                },
                secondary: {
                  main: '#f48fb1',
                },
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
              }),
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                background: mode === 'light' 
                  ? 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)'
                  : '#121212',
                backgroundAttachment: 'fixed',
                minHeight: '100vh',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: mode === 'light' ? 'none' : undefined,
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
}; 