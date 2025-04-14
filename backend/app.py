from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import json

app = Flask(__name__)
CORS(app)

# Basic configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this in production

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

if __name__ == '__main__':
    app.run(debug=True) 