export interface MarketData {
  dates: string[];
  prices: number[];
  volume: number[];
}

export interface PortfolioPosition {
  symbol: string;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  dailyChange: number;
}

export interface PortfolioSummary {
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  positions: PortfolioPosition[];
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: string;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  created: string;
  lastModified: string;
  isActive: boolean;
}

export interface BacktestResult {
  id: string;
  strategyId: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  trades: Trade[];
}

export interface Indicator {
  name: string;
  type: string;
}

export interface PerformanceMetrics {
  total_return: number;
  sharpe_ratio: number;
  max_drawdown: number;
  win_rate: number;
  trades: Trade[];
}

export interface StrategyBlock {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    params: Record<string, any>;
  };
}

export interface StrategyNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    params: Record<string, any>;
  };
  sourcePosition?: 'right';
  targetPosition?: 'left';
} 