import { createSlice } from '@reduxjs/toolkit';

const initialTickers = [
  { symbol: 'QTRD', name: 'Quant Trading Tech', price: 428.50, change: 12.40, pct: +2.98, volume: '14.2M', high: 432.10, low: 415.00 },
  { symbol: 'DSEX', name: 'Dhaka Exchange Index', price: 5824.12, change: 48.30, pct: +0.84, volume: '850M', high: 5850.00, low: 5790.00 },
  { symbol: 'BTC/USD', name: 'Bitcoin / USD', price: 68450.00, change: -120.00, pct: -0.18, volume: '32.1B', high: 69200.00, low: 67800.00 },
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 128.90, change: 4.80, pct: +3.87, volume: '45.8M', high: 130.00, low: 124.50 },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 224.30, change: 1.15, pct: +0.52, volume: '28.4M', high: 226.00, low: 223.10 },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0875, change: 0.0021, pct: +0.19, volume: '120B', high: 1.0900, low: 1.0840 },
  { symbol: 'UFTCL', name: 'United Fin Trading', price: 94.20, change: 3.50, pct: +3.86, volume: '5.6M', high: 96.00, low: 91.00 },
  { symbol: 'CSE50', name: 'Chittagong 50 Index', price: 13420.50, change: 110.20, pct: +0.83, volume: '340M', high: 13490.00, low: 13350.00 }
];

const initialOrderBook = {
  asks: [
    { price: 429.50, amount: 1500, total: 1500, depthPct: 85 },
    { price: 429.20, amount: 850, total: 2350, depthPct: 65 },
    { price: 429.00, amount: 1200, total: 3550, depthPct: 75 },
    { price: 428.80, amount: 450, total: 4000, depthPct: 35 },
    { price: 428.60, amount: 980, total: 4980, depthPct: 55 }
  ],
  bids: [
    { price: 428.40, amount: 1100, total: 1100, depthPct: 60 },
    { price: 428.20, amount: 750, total: 1850, depthPct: 45 },
    { price: 428.00, amount: 2100, total: 3950, depthPct: 90 },
    { price: 427.70, amount: 1300, total: 5250, depthPct: 70 },
    { price: 427.50, amount: 900, total: 6150, depthPct: 50 }
  ]
};

const initialTrades = [
  { id: 1, time: '12:54:02', price: 428.50, amount: 120, side: 'buy' },
  { id: 2, time: '12:53:58', price: 428.40, amount: 350, side: 'sell' },
  { id: 3, time: '12:53:50', price: 428.50, amount: 500, side: 'buy' },
  { id: 4, time: '12:53:42', price: 428.60, amount: 200, side: 'buy' },
  { id: 5, time: '12:53:35', price: 428.30, amount: 1000, side: 'sell' }
];

const initialState = {
  tickers: initialTickers,
  activeSymbol: 'QTRD',
  orderBook: initialOrderBook,
  recentTrades: initialTrades,
  fixLatency: '420 μs',
  fixStatus: 'Connected (FIX 5.0 SP2)',
  uptimePct: '99.999%'
};

export const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setActiveSymbol: (state, action) => {
      state.activeSymbol = action.payload;
    },
    updateTickerPrice: (state, action) => {
      const { symbol, newPrice } = action.payload;
      const ticker = state.tickers.find((t) => t.symbol === symbol);
      if (ticker) {
        const diff = newPrice - ticker.price;
        ticker.price = newPrice;
        ticker.change += diff;
        ticker.pct = Number(((ticker.change / (ticker.price - ticker.change)) * 100).toFixed(2));
      }
    },
    addExecutedTrade: (state, action) => {
      state.recentTrades.unshift(action.payload);
      if (state.recentTrades.length > 10) {
        state.recentTrades.pop();
      }
    }
  }
});

export const { setActiveSymbol, updateTickerPrice, addExecutedTrade } = marketSlice.actions;
export default marketSlice.reducer;
