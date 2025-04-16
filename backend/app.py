from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import json
import os

app = Flask(__name__)
CORS(app)

# Basic configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this in production

# In-memory storage for portfolio and trades
portfolio = {
    'total_value': 100000,
    'daily_change': 1500,
    'daily_change_percent': 1.5,
    'positions': [
        {
            'symbol': 'AAPL',
            'quantity': 100,
            'current_price': 150.25,
            'total_value': 15025,
            'daily_change': 125
        },
        {
            'symbol': 'MSFT',
            'quantity': 50,
            'current_price': 250.75,
            'total_value': 12537.5,
            'daily_change': 87.5
        }
    ]
}

trades = [
    {
        'id': '1',
        'symbol': 'AAPL',
        'type': 'buy',
        'quantity': 10,
        'price': 149.50,
        'timestamp': '2024-03-20T10:30:00Z'
    },
    {
        'id': '2',
        'symbol': 'MSFT',
        'type': 'sell',
        'quantity': 5,
        'price': 251.25,
        'timestamp': '2024-03-20T11:15:00Z'
    }
]

@app.route('/api/market-data/<symbol>', methods=['GET'])
def get_market_data(symbol):
    try:
        # Get data for the last 30 days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        stock = yf.Ticker(symbol)
        hist = stock.history(start=start_date, end=end_date)
        
        # Convert to JSON-friendly format
        data = {
            'dates': hist.index.strftime('%Y-%m-%d').tolist(),
            'prices': hist['Close'].tolist(),
            'volumes': hist['Volume'].tolist()
        }
        
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/backtest', methods=['POST'])
def backtest_strategy():
    try:
        data = request.json
        strategy = data.get('strategy')
        symbol = data.get('symbol')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        # TODO: Implement backtesting logic
        # This is a placeholder response
        return jsonify({
            'status': 'success',
            'message': 'Backtesting will be implemented here',
            'strategy': strategy,
            'symbol': symbol,
            'start_date': start_date,
            'end_date': end_date
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/indicators', methods=['GET'])
def get_available_indicators():
    # List of available technical indicators
    indicators = [
        {'name': 'Moving Average', 'type': 'trend'},
        {'name': 'RSI', 'type': 'momentum'},
        {'name': 'MACD', 'type': 'trend'},
        {'name': 'Bollinger Bands', 'type': 'volatility'},
        {'name': 'Stochastic Oscillator', 'type': 'momentum'},
        {'name': 'Volume', 'type': 'volume'}
    ]
    return jsonify(indicators)

@app.route('/api/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    try:
        # Get stock data for the last 30 days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        stock = yf.Ticker(symbol)
        hist = stock.history(start=start_date, end=end_date)
        
        return jsonify({
            'dates': hist.index.strftime('%Y-%m-%d').tolist(),
            'prices': hist['Close'].tolist(),
            'volume': hist['Volume'].tolist()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/portfolio', methods=['GET'])
def get_portfolio():
    return jsonify(portfolio)

@app.route('/api/trades', methods=['GET'])
def get_trades():
    return jsonify(trades)

@app.route('/api/trades', methods=['POST'])
def add_trade():
    try:
        trade = request.json
        trade['id'] = str(len(trades) + 1)
        trade['timestamp'] = datetime.now().isoformat()
        trades.append(trade)
        
        # Update portfolio
        update_portfolio(trade)
        
        return jsonify(trade), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def update_portfolio(trade):
    # Find the position in the portfolio
    position = next((p for p in portfolio['positions'] if p['symbol'] == trade['symbol']), None)
    
    if position:
        if trade['type'] == 'buy':
            position['quantity'] += trade['quantity']
            position['total_value'] = position['quantity'] * position['current_price']
        else:  # sell
            position['quantity'] -= trade['quantity']
            position['total_value'] = position['quantity'] * position['current_price']
            
        # Remove position if quantity is 0
        if position['quantity'] == 0:
            portfolio['positions'].remove(position)
    else:
        if trade['type'] == 'buy':
            new_position = {
                'symbol': trade['symbol'],
                'quantity': trade['quantity'],
                'current_price': trade['price'],
                'total_value': trade['quantity'] * trade['price'],
                'daily_change': 0
            }
            portfolio['positions'].append(new_position)
    
    # Update total portfolio value
    portfolio['total_value'] = sum(p['total_value'] for p in portfolio['positions'])

if __name__ == '__main__':
    app.run(debug=True) 