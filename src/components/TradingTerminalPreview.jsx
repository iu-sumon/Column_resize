import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOrderSide, setOrderType, setOrderPrice, setOrderQty, showToast } from '../store/terminalSlice';
import { addExecutedTrade } from '../store/marketSlice';
import { Terminal, TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, CheckCircle2, Layers, DollarSign } from 'lucide-react';

export default function TradingTerminalPreview() {
  const dispatch = useDispatch();
  const activeSymbol = useSelector((state) => state.market.activeSymbol);
  const tickers = useSelector((state) => state.market.tickers);
  const orderBook = useSelector((state) => state.market.orderBook);
  const recentTrades = useSelector((state) => state.market.recentTrades);
  
  const { orderSide, orderType, orderPrice, orderQty } = useSelector((state) => state.terminal);
  const activeTicker = tickers.find((t) => t.symbol === activeSymbol) || tickers[0];

  const [timeframe, setTimeframe] = useState('5M');
  const [chartType, setChartType] = useState('candles'); // candles or line

  // Simulated live chart data generation based on active ticker price
  const generateChartData = () => {
    const base = activeTicker.price;
    const points = [];
    let current = base * 0.96;
    for (let i = 0; i < 24; i++) {
      const open = current;
      const change = (Math.random() - 0.48) * (base * 0.015);
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * (base * 0.008);
      const low = Math.min(open, close) - Math.random() * (base * 0.008);
      points.push({ open, high, low, close });
      current = close;
    }
    return points;
  };

  const [chartPoints, setChartPoints] = useState(generateChartData());

  useEffect(() => {
    setChartPoints(generateChartData());
  }, [activeSymbol, timeframe]);

  // Handle Order Placement Execution
  const handleExecuteOrder = (e) => {
    e.preventDefault();
    const tradeId = Math.floor(Math.random() * 100000);
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    dispatch(
      addExecutedTrade({
        id: tradeId,
        time: timeStr,
        price: Number(orderPrice),
        amount: Number(orderQty),
        side: orderSide.toLowerCase()
      })
    );

    dispatch(
      showToast({
        title: `${orderSide} Order Executed!`,
        message: `${orderSide} ${orderQty} ${activeSymbol} @ $${orderPrice} (Latency: 380 μs)`,
        type: orderSide === 'BUY' ? 'success' : 'danger'
      })
    );
  };

  return (
    <section id="terminal" className="py-5">
      <div className="container-fluid px-lg-5">
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="section-badge mb-2">
            <Terminal size={14} />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="display-5 font-heading fw-bold">
            High-Speed <span className="text-gradient">OMS Trading Terminal</span>
          </h2>
          <p className="text-muted col-lg-6 mx-auto">
            Experience sub-millisecond order placement with direct exchange connectivity, smart order routing, and real-time market depth ladder.
          </p>
        </div>

        {/* Main Terminal Window Grid */}
        <div className="glass-panel p-3 border-highlight shadow-lg">
          {/* Terminal Header Bar */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 p-2 mb-3 bg-tertiary rounded-3">
            {/* Symbol Info */}
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-quant-primary fs-6 font-mono">{activeTicker.symbol}</span>
              <div>
                <h5 className="mb-0 font-heading fw-bold">{activeTicker.name}</h5>
                <span className="font-mono text-dim small">FIX ID: QTRD-FIX-009</span>
              </div>
              <div className="vr d-none d-sm-block"></div>
              <div className="d-none d-sm-block font-mono">
                <span className="text-dim small d-block">LAST PRICE</span>
                <span className="fw-bold fs-5 text-main">${activeTicker.price.toFixed(2)}</span>
              </div>
              <div className="d-none d-md-block font-mono">
                <span className="text-dim small d-block">24H CHANGE</span>
                <span className={`fw-bold ${activeTicker.pct >= 0 ? 'text-up' : 'text-down'}`}>
                  {activeTicker.pct >= 0 ? '+' : ''}{activeTicker.pct}%
                </span>
              </div>
            </div>

            {/* Timeframe & Controls */}
            <div className="d-flex align-items-center gap-2">
              <div className="btn-group btn-group-sm glass-card p-1">
                {['1M', '5M', '1H', '1D'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`btn btn-sm ${timeframe === tf ? 'btn-quant-primary' : 'btn-link text-main text-decoration-none'}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setChartPoints(generateChartData())}
                className="btn btn-sm glass-card p-2 text-main"
                title="Refresh Market Data"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          <div className="row g-3">
            {/* Left Column: Interactive Candlestick Chart */}
            <div className="col-lg-7 col-xl-8">
              <div className="glass-card p-3 h-100 d-flex flex-column justify-content-between">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="font-mono text-dim small">PRICE CHART ({timeframe}) — REALTIME FEED</span>
                  <div className="d-flex gap-2">
                    <span className="badge bg-up font-mono">HIGH: ${activeTicker.high.toFixed(2)}</span>
                    <span className="badge bg-down font-mono">LOW: ${activeTicker.low.toFixed(2)}</span>
                  </div>
                </div>

                {/* SVG Candlestick Rendering */}
                <div className="w-100 flex-grow-1 min-vh-40 position-relative d-flex align-items-center justify-content-center bg-dark bg-opacity-25 rounded-3 p-2">
                  <svg width="100%" height="320" viewBox="0 0 800 320" className="w-100">
                    {/* Grid lines */}
                    {[50, 110, 170, 230, 290].map((y, idx) => (
                      <line key={idx} x1="0" y1={y} x2="800" y2={y} stroke="var(--border-color)" strokeDasharray="3 3" />
                    ))}

                    {/* Render Candlesticks */}
                    {chartPoints.map((pt, i) => {
                      const x = 20 + i * 32;
                      const minPrice = Math.min(...chartPoints.map((p) => p.low));
                      const maxPrice = Math.max(...chartPoints.map((p) => p.high));
                      const range = maxPrice - minPrice || 1;

                      const mapY = (val) => 280 - ((val - minPrice) / range) * 230;

                      const yOpen = mapY(pt.open);
                      const yClose = mapY(pt.close);
                      const yHigh = mapY(pt.high);
                      const yLow = mapY(pt.low);

                      const isGreen = pt.close >= pt.open;
                      const candleColor = isGreen ? 'var(--buy-green)' : 'var(--sell-red)';
                      const top = Math.min(yOpen, yClose);
                      const height = Math.max(Math.abs(yClose - yOpen), 3);

                      return (
                        <g key={i}>
                          {/* High-Low Wick */}
                          <line x1={x + 8} y1={yHigh} x2={x + 8} y2={yLow} stroke={candleColor} strokeWidth="1.5" />
                          {/* Candle Body */}
                          <rect
                            x={x + 1}
                            y={top}
                            width="14"
                            height={height}
                            fill={candleColor}
                            rx="2"
                            opacity="0.9"
                          />
                        </g>
                      );
                    })}

                    {/* Animated Price Line Overlay */}
                    <path
                      d={chartPoints
                        .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${20 + i * 32 + 8} ${280 - ((pt.close - Math.min(...chartPoints.map(p => p.low))) / (Math.max(...chartPoints.map(p => p.high)) - Math.min(...chartPoints.map(p => p.low)) || 1)) * 230}`)
                        .join(' ')}
                      fill="none"
                      stroke="var(--accent-cyan)"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Column: Order Book & Order Form */}
            <div className="col-lg-5 col-xl-4 d-flex flex-column gap-3">
              {/* Order Book Ladder */}
              <div className="glass-card p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="font-mono text-dim small fw-semibold">ORDER BOOK (L2 DEPTH)</span>
                  <span className="badge bg-tertiary font-mono text-dim">5 ASKS / 5 BIDS</span>
                </div>

                <div className="font-mono small">
                  {/* Asks (Sells) */}
                  <div className="mb-2">
                    {orderBook.asks.map((ask, idx) => (
                      <div key={idx} className="position-relative d-flex justify-content-between py-1 px-2 my-1 rounded">
                        <div className="depth-bar-ask" style={{ width: `${ask.depthPct}%` }}></div>
                        <span className="text-down fw-bold z-1">${ask.price.toFixed(2)}</span>
                        <span className="text-main z-1">{ask.amount}</span>
                        <span className="text-dim z-1">${(ask.price * ask.amount).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Spread Divider */}
                  <div className="py-1 px-2 my-1 bg-tertiary rounded text-center fw-bold text-cyan border border-secondary border-opacity-25">
                    SPREAD: $0.20 (0.04%)
                  </div>

                  {/* Bids (Buys) */}
                  <div>
                    {orderBook.bids.map((bid, idx) => (
                      <div key={idx} className="position-relative d-flex justify-content-between py-1 px-2 my-1 rounded">
                        <div className="depth-bar-bid" style={{ width: `${bid.depthPct}%` }}></div>
                        <span className="text-up fw-bold z-1">${bid.price.toFixed(2)}</span>
                        <span className="text-main z-1">{bid.amount}</span>
                        <span className="text-dim z-1">${(bid.price * bid.amount).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Order Execution Form */}
              <div className="glass-card p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="font-mono text-dim small fw-semibold">DIRECT OMS ORDER PLACEMENT</span>
                  <span className="badge bg-up font-mono" style={{ fontSize: '0.7rem' }}>FIX CONNECTED</span>
                </div>

                <form onSubmit={handleExecuteOrder}>
                  {/* Buy / Sell Selector */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <button
                        type="button"
                        onClick={() => dispatch(setOrderSide('BUY'))}
                        className={`btn w-100 font-mono fw-bold ${orderSide === 'BUY' ? 'btn-success bg-up border-0' : 'btn-quant-outline'}`}
                      >
                        BUY (BID)
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        type="button"
                        onClick={() => dispatch(setOrderSide('SELL'))}
                        className={`btn w-100 font-mono fw-bold ${orderSide === 'SELL' ? 'btn-danger bg-down border-0' : 'btn-quant-outline'}`}
                      >
                        SELL (ASK)
                      </button>
                    </div>
                  </div>

                  {/* Price & Quantity */}
                  <div className="mb-2">
                    <label className="form-label font-mono small text-dim mb-1">LIMIT PRICE ($)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control font-mono bg-tertiary text-main border-secondary border-opacity-25"
                      value={orderPrice}
                      onChange={(e) => dispatch(setOrderPrice(Number(e.target.value)))}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label font-mono small text-dim mb-1">QUANTITY (SHARES)</label>
                    <input
                      type="number"
                      className="form-control font-mono bg-tertiary text-main border-secondary border-opacity-25"
                      value={orderQty}
                      onChange={(e) => dispatch(setOrderQty(Number(e.target.value)))}
                      required
                    />
                  </div>

                  {/* Estimated Value */}
                  <div className="d-flex justify-content-between font-mono text-dim small mb-3">
                    <span>ESTIMATED VALUE:</span>
                    <span className="fw-bold text-main">${(orderPrice * orderQty).toLocaleString()}</span>
                  </div>

                  {/* Submit Order */}
                  <button
                    type="submit"
                    className={`btn w-100 font-mono fw-bold py-2 ${
                      orderSide === 'BUY' ? 'btn-quant-primary' : 'btn-danger'
                    }`}
                  >
                    EXECUTE {orderSide} ORDER
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
