import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveSymbol } from '../store/marketSlice';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MarketTicker() {
  const dispatch = useDispatch();
  const tickers = useSelector((state) => state.market.tickers);
  const activeSymbol = useSelector((state) => state.market.activeSymbol);

  return (
    <div className="py-2 border-y border-secondary border-opacity-25 overflow-hidden" style={{ background: 'var(--ticker-bg)' }}>
      <div className="animate-marquee d-flex align-items-center gap-4">
        {/* Duplicate array for seamless infinite marquee effect */}
        {[...tickers, ...tickers].map((ticker, index) => {
          const isUp = ticker.pct >= 0;
          const isSelected = activeSymbol === ticker.symbol;

          return (
            <div
              key={`${ticker.symbol}-${index}`}
              onClick={() => dispatch(setActiveSymbol(ticker.symbol))}
              className={`d-inline-flex align-items-center gap-2 px-3 py-1 rounded-3 cursor-pointer transition-all ${
                isSelected ? 'glass-card border-highlight shadow-sm' : ''
              }`}
              style={{ cursor: 'pointer' }}
            >
              <span className="fw-bold font-mono text-main" style={{ fontSize: '0.9rem' }}>
                {ticker.symbol}
              </span>
              <span className="font-mono text-dim" style={{ fontSize: '0.85rem' }}>
                ${ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className={`badge font-mono d-flex align-items-center gap-1 ${isUp ? 'bg-up' : 'bg-down'}`} style={{ fontSize: '0.75rem' }}>
                {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {isUp ? '+' : ''}{ticker.pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
