import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Zap, ShieldCheck } from 'lucide-react';

export default function RoiCalculator() {
  const [dailyTrades, setDailyTrades] = useState(5000);
  const [avgTradeSize, setAvgTradeSize] = useState(1500); // USD
  const [currentLatency, setCurrentLatency] = useState(12); // ms

  // Calculation Logic
  const dailyVolume = dailyTrades * avgTradeSize;
  const estimatedSlippageRate = (currentLatency - 0.42) * 0.00008; // Slippage saved per ms decrease
  const dailySavings = dailyVolume * Math.max(0, estimatedSlippageRate);
  const annualSavings = dailySavings * 250; // 250 trading days
  const latencyReduction = Math.round(((currentLatency - 0.42) / currentLatency) * 100);

  return (
    <section id="roi" className="py-5">
      <div className="container-fluid px-lg-5">
        <div className="text-center mb-5">
          <div className="section-badge mb-2">
            <Calculator size={14} />
            <span>Interactive Profit Estimator</span>
          </div>
          <h2 className="display-5 font-heading fw-bold">
            Calculate Your <span className="text-gradient">Slippage Savings</span>
          </h2>
          <p className="text-muted col-lg-6 mx-auto">
            See how much your brokerage or trading firm saves each year by upgrading to Quant Fintech's sub-millisecond OMS engine.
          </p>
        </div>

        <div className="row g-4 align-items-center">
          {/* Controls Sliders */}
          <div className="col-lg-6">
            <div className="glass-panel p-4">
              <h4 className="font-heading fw-bold mb-4">Trading Infrastructure Parameters</h4>

              {/* Slider 1: Daily Orders */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label text-dim font-mono small mb-0">DAILY ORDER VOLUME</label>
                  <span className="font-mono text-cyan fw-bold fs-5">{dailyTrades.toLocaleString()} Orders/day</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="500"
                  max="50000"
                  step="500"
                  value={dailyTrades}
                  onChange={(e) => setDailyTrades(Number(e.target.value))}
                />
              </div>

              {/* Slider 2: Average Order Value */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label text-dim font-mono small mb-0">AVG ORDER SIZE ($)</label>
                  <span className="font-mono text-emerald fw-bold fs-5">${avgTradeSize.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="100"
                  max="20000"
                  step="100"
                  value={avgTradeSize}
                  onChange={(e) => setAvgTradeSize(Number(e.target.value))}
                />
              </div>

              {/* Slider 3: Legacy Latency */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label text-dim font-mono small mb-0">CURRENT LEGACY LATENCY (MS)</label>
                  <span className="font-mono text-down fw-bold fs-5">{currentLatency} ms</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="2"
                  max="50"
                  step="1"
                  value={currentLatency}
                  onChange={(e) => setCurrentLatency(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="col-lg-6">
            <div className="glass-panel p-4 border-highlight">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Zap className="text-up pulse-glow" size={24} />
                <h4 className="font-heading fw-bold mb-0">Estimated Annual Efficiency Gain</h4>
              </div>

              <div className="p-4 bg-tertiary rounded-3 mb-4 text-center">
                <span className="font-mono text-dim small d-block mb-1">ESTIMATED ANNUAL SLIPPAGE COST SAVINGS</span>
                <span className="font-mono text-gradient fs-1 fw-extrabold d-block">
                  ${Math.round(annualSavings).toLocaleString()}
                </span>
                <span className="badge bg-up font-mono mt-2 px-3 py-2">
                  +{latencyReduction}% Faster Execution vs Legacy System
                </span>
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <div className="glass-card p-3">
                    <span className="font-mono text-dim small d-block mb-1">QUANT LATENCY</span>
                    <span className="font-mono text-up fw-bold fs-5">0.42 ms (420 μs)</span>
                  </div>
                </div>

                <div className="col-6">
                  <div className="glass-card p-3">
                    <span className="font-mono text-dim small d-block mb-1">DAILY SAVINGS</span>
                    <span className="font-mono text-emerald fw-bold fs-5">${Math.round(dailySavings).toLocaleString()} / day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
