import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, Activity, Server, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export default function FixProtocolMonitor() {
  const [msgCount, setMsgCount] = useState(148520);
  const [latencyVal, setLatencyVal] = useState(420);

  // Live simulation of message throughput and microsecond latency fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgCount((prev) => prev + Math.floor(Math.random() * 40 + 10));
      setLatencyVal(410 + Math.floor(Math.random() * 25));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const gateways = [
    { name: 'DSE FIX Gateway (Dhaka Stock Exchange)', status: 'ACTIVE', latency: `${latencyVal} μs`, uptime: '99.999%' },
    { name: 'CSE FIX Gateway (Chittagong Stock Exchange)', status: 'ACTIVE', latency: `${latencyVal - 15} μs`, uptime: '99.998%' },
    { name: 'FIX 5.0 SP2 Order Router', status: 'ACTIVE', latency: '120 μs', uptime: '100.00%' },
    { name: 'Pre-Trade RMS Risk Engine', status: 'ACTIVE', latency: '85 μs', uptime: '99.999%' }
  ];

  return (
    <section id="fix-engine" className="py-5">
      <div className="container-fluid px-lg-5">
        <div className="glass-panel p-4 p-lg-5 border-highlight position-relative overflow-hidden">
          {/* Background Glow Effect */}
          <div
            className="position-absolute rounded-circle opacity-25 pointer-events-none"
            style={{
              width: '400px',
              height: '400px',
              background: 'var(--accent-cyan)',
              filter: 'blur(120px)',
              top: '-100px',
              right: '-100px'
            }}
          />

          <div className="row align-items-center gy-4">
            {/* Left Content */}
            <div className="col-lg-6">
              <div className="section-badge mb-3">
                <Cpu size={14} />
                <span>FIX 4.4 / 5.0 SP2 Engine Performance</span>
              </div>

              <h2 className="display-5 font-heading fw-bold mb-3">
                Sub-Millisecond <span className="text-gradient">FIX Integration</span>
              </h2>

              <p className="lead text-muted mb-4">
                Quant Fintech provides battle-tested FIX protocol server libraries, exchange gateways, feed handlers, and high-performance order matching engines certified by major stock exchanges.
              </p>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="glass-card p-3">
                    <span className="font-mono text-dim small d-block mb-1">AVG ENGINE LATENCY</span>
                    <span className="font-mono text-up fs-3 fw-bold">{latencyVal} μs</span>
                    <span className="small text-muted d-block mt-1">Sub-Millisecond Speed</span>
                  </div>
                </div>

                <div className="col-6">
                  <div className="glass-card p-3">
                    <span className="font-mono text-dim small d-block mb-1">REALTIME MSG THROUGHPUT</span>
                    <span className="font-mono text-cyan fs-3 fw-bold">{msgCount.toLocaleString()}</span>
                    <span className="small text-muted d-block mt-1">Messages Processed</span>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-3">
                <a href="#contact" className="btn btn-quant-primary d-flex align-items-center gap-2">
                  <span>Integrate FIX Engine</span>
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>

            {/* Right Monitor Panel */}
            <div className="col-lg-6">
              <div className="glass-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                  <div className="d-flex align-items-center gap-2">
                    <Activity size={20} className="text-up pulse-glow" />
                    <span className="font-heading fw-bold">Live Gateway Status Monitor</span>
                  </div>
                  <span className="badge bg-up font-mono">ALL GATEWAYS OPERATIONAL</span>
                </div>

                <div className="d-flex flex-column gap-3">
                  {gateways.map((gw, idx) => (
                    <div key={idx} className="p-3 bg-tertiary rounded-3 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <CheckCircle2 size={16} className="text-up" />
                          <span className="fw-semibold text-main">{gw.name}</span>
                        </div>
                        <span className="font-mono text-dim small">UPTIME: {gw.uptime}</span>
                      </div>

                      <div className="text-end font-mono">
                        <span className="badge bg-quant-glow text-cyan d-block mb-1">{gw.latency}</span>
                        <span className="small text-up fw-semibold">{gw.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
