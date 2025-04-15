export interface MarketData {
  dates: string[];
  prices: number[];
  volumes: number[];
}

export interface Indicator {
  name: string;
  type: string;
}

export interface Trade {
  date: string;
  type: 'buy' | 'sell';
  price: number;
  position: number;
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