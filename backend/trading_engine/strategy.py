import pandas as pd
import numpy as np
import yfinance as yf
from datetime import datetime, timedelta

class TradingStrategy:
    def __init__(self, symbol, start_date, end_date):
        self.symbol = symbol
        self.start_date = start_date
        self.end_date = end_date
        self.data = None
        self.positions = []
        self.trades = []
        
    def fetch_data(self):
        """Fetch historical data for the symbol"""
        stock = yf.Ticker(self.symbol)
        self.data = stock.history(start=self.start_date, end=self.end_date)
        return self.data
    
    def calculate_moving_average(self, window=20):
        """Calculate simple moving average"""
        if self.data is None:
            self.fetch_data()
        self.data['MA'] = self.data['Close'].rolling(window=window).mean()
        return self.data['MA']
    
    def calculate_rsi(self, window=14):
        """Calculate Relative Strength Index"""
        if self.data is None:
            self.fetch_data()
            
        delta = self.data['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
        
        rs = gain / loss
        self.data['RSI'] = 100 - (100 / (1 + rs))
        return self.data['RSI']
    
    def backtest(self, strategy_params):
        """Backtest a trading strategy"""
        if self.data is None:
            self.fetch_data()
            
        # Initialize strategy parameters
        ma_window = strategy_params.get('ma_window', 20)
        rsi_window = strategy_params.get('rsi_window', 14)
        rsi_overbought = strategy_params.get('rsi_overbought', 70)
        rsi_oversold = strategy_params.get('rsi_oversold', 30)
        
        # Calculate indicators
        self.calculate_moving_average(ma_window)
        self.calculate_rsi(rsi_window)
        
        # Initialize position tracking
        position = 0
        trades = []
        
        # Strategy logic
        for i in range(1, len(self.data)):
            # Buy signal: RSI oversold and price above MA
            if (self.data['RSI'].iloc[i] < rsi_oversold and 
                self.data['Close'].iloc[i] > self.data['MA'].iloc[i] and 
                position <= 0):
                position = 1
                trades.append({
                    'date': self.data.index[i],
                    'type': 'buy',
                    'price': self.data['Close'].iloc[i],
                    'position': position
                })
            
            # Sell signal: RSI overbought and price below MA
            elif (self.data['RSI'].iloc[i] > rsi_overbought and 
                  self.data['Close'].iloc[i] < self.data['MA'].iloc[i] and 
                  position >= 0):
                position = -1
                trades.append({
                    'date': self.data.index[i],
                    'type': 'sell',
                    'price': self.data['Close'].iloc[i],
                    'position': position
                })
        
        self.trades = trades
        return self.calculate_performance()
    
    def calculate_performance(self):
        """Calculate strategy performance metrics"""
        if not self.trades:
            return {
                'total_return': 0,
                'sharpe_ratio': 0,
                'max_drawdown': 0,
                'win_rate': 0
            }
        
        # Calculate returns
        returns = []
        for i in range(1, len(self.trades)):
            if self.trades[i]['type'] == 'sell':
                returns.append(
                    (self.trades[i]['price'] - self.trades[i-1]['price']) / 
                    self.trades[i-1]['price']
                )
        
        returns = pd.Series(returns)
        
        # Calculate metrics
        total_return = (1 + returns).prod() - 1
        sharpe_ratio = returns.mean() / returns.std() if len(returns) > 1 else 0
        max_drawdown = (returns.cumsum().expanding().max() - returns.cumsum()).max()
        win_rate = (returns > 0).mean()
        
        return {
            'total_return': total_return,
            'sharpe_ratio': sharpe_ratio,
            'max_drawdown': max_drawdown,
            'win_rate': win_rate,
            'trades': self.trades
        } 