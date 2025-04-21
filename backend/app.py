from flask import Flask, jsonify, request, session, redirect, url_for, render_template
from flask_cors import CORS
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import json
import os
import random
import string

app = Flask(__name__)
CORS(app)

# Basic configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this in production
app.secret_key = 'your-secret-key-here'  # Change this in production

# In-memory storage for portfolio, trades, and strategies
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

strategies = []

# In-memory user storage (replace with a database in production)
users = {}

# Function to generate a random special phrase
def generate_special_phrase():
    words = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa']
    return ' '.join(random.sample(words, 4))  # Generate a 4-word phrase

@app.route('/')
def home():
    if 'username' in session:
        # User is logged in, show the main page
        return '''
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Main Page</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    color: #333;
                    text-align: center;
                    padding: 50px;
                }}
                .button {{
                    display: inline-block;
                    margin: 10px;
                    padding: 15px 30px;
                    font-size: 16px;
                    color: #fff;
                    background-color: #6c63ff;
                    border: none;
                    border-radius: 5px;
                    text-decoration: none;
                    cursor: pointer;
                }}
                .button:hover {{
                    background-color: #5753c9;
                }}
            </style>
        </head>
        <body>
            <h1>Welcome, {username}</h1>
            <p>This is the main page of the app.</p>
            <a href="/logout" class="button">Logout</a>
        </body>
        </html>
        '''.format(username=session.get('username', 'User'))  # Use session.get() to avoid KeyError
    else:
        # User is not logged in, show login and register options side by side
        return '''
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Welcome to TinkerQuest</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    color: #333;
                    text-align: center;
                    padding: 50px;
                }}
                .container {{
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 50px;
                }}
                .button {{
                    display: inline-block;
                    padding: 15px 30px;
                    font-size: 16px;
                    color: #fff;
                    background-color: #6c63ff;
                    border: none;
                    border-radius: 5px;
                    text-decoration: none;
                    cursor: pointer;
                }}
                .button:hover {{
                    background-color: #5753c9;
                }}
            </style>
        </head>
        <body>
            <h1>Welcome to TinkerQuest</h1>
            <p>Access exclusive features by registering or logging in.</p>
            <div class="container">
                <a href="/register" class="button">Register</a>
                <a href="/login" class="button">Login</a>
            </div>
        </body>
        </html>
        '''

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users:
            return jsonify({'error': 'User already exists!'}), 400
        
        # Generate a special phrase for the user
        special_phrase = generate_special_phrase()
        users[username] = {'password': password, 'special_phrase': special_phrase}
        
        # Inform the user to save their special phrase
        return '''
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Registration Successful</title>
        </head>
        <body>
            <h1>Registration Successful!</h1>
            <p>Your special phrase is: <strong>{}</strong></p>
            <p>Please save this phrase securely as it will not be shown again.</p>
            <a href="/login">Go to Login</a>
        </body>
        </html>
        '''.format(special_phrase)
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        special_phrase = request.form['special_phrase']
        
        # Validate username, password, and special phrase
        if username in users and users[username]['password'] == password:
            if users[username]['special_phrase'] == special_phrase:
                session['username'] = username
                # Redirect to the frontend dashboard after successful login
                return redirect('http://127.0.0.1:3000/')  # Replace with your frontend URL
            return render_template('login.html', error='Invalid special phrase!')
        return render_template('login.html', error='Invalid credentials!')
    return render_template('login.html')

@app.route('/special-feature', methods=['GET', 'POST'])
def special_feature():
    if 'username' not in session:
        return redirect(url_for('login'))
    if request.method == 'POST':
        phrase = request.form['phrase']
        if phrase == users[session['username']]['special_phrase']:
            return jsonify({'message': 'Access granted to the special feature!'}), 200
        return jsonify({'error': 'Incorrect phrase!'}), 403
    return render_template('special_feature.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

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

@app.route('/api/strategies', methods=['GET'])
def get_strategies():
    return jsonify(strategies)

@app.route('/api/strategies', methods=['POST'])
def save_strategy():
    try:
        strategy = request.json
        strategy['id'] = str(len(strategies) + 1)
        strategy['created'] = datetime.now().isoformat()
        strategy['lastModified'] = datetime.now().isoformat()
        strategies.append(strategy)
        return jsonify(strategy), 201
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