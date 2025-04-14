# AlgoBlocks - Empowering the Future of Algorithmic Trading

AlgoBlocks is a user-friendly, low-code platform designed to democratize access to algorithmic trading. It provides an intuitive environment where users can design, test, and deploy algorithmic trading strategies without the need for advanced programming skills.

## Features

- **Modular Block-Based Interface**: Drag-and-drop interface for building trading strategies
- **Paper Trading/Simulated Trading**: Test strategies with real-time market data without financial risk
- **Performance Analytics & Optimization**: Detailed metrics and optimization tools
- **Backtesting Engine**: Test strategies using historical market data
- **Educational Resources**: Comprehensive guides and tutorials

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Python Flask
- **Database**: SQLite (initial), PostgreSQL (production)
- **Trading Engine**: Python with pandas, numpy, and yfinance
- **UI Components**: Material-UI
- **Block Editor**: React-Flow

## Project Structure

```
algoblocks/
├── frontend/           # React frontend application
├── backend/            # Python Flask backend
├── trading-engine/     # Core trading logic and backtesting
└── docs/              # Documentation and educational resources
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- pip

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   python app.py
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

## Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
