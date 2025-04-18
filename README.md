# AlgoDex - Algorithmic Trading Platform

AlgoDex is a modern, user-friendly algorithmic trading platform that allows users to build, test, and deploy trading strategies with ease. The platform features a drag-and-drop interface for strategy creation, real-time market data visualization, and comprehensive backtesting capabilities.

## Features

- **Dashboard**: Real-time portfolio tracking and market data visualization
- **Strategy Builder**: Intuitive drag-and-drop interface for creating trading strategies
- **Backtesting**: Comprehensive backtesting engine with detailed performance metrics
- **Theme Support**: Beautiful purple gradient light theme and dark mode support
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components and theming
- Chart.js for data visualization
- React Router for navigation

### Backend
- Python Flask
- yfinance for market data
- pandas for data analysis
- SQLAlchemy for database operations

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/algodex.git
cd algodex
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
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

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
algodex/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Application pages
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main application component
│   └── package.json
├── backend/
│   ├── app.py             # Flask application
│   ├── requirements.txt   # Python dependencies
│   └── data/             # Data storage
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the beautiful component library
- yfinance for providing market data
- Chart.js for data visualization capabilities
