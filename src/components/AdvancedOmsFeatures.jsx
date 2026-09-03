import React from 'react';
import { useDispatch } from 'react-redux';
import { openDemoModal } from '../store/terminalSlice';
import { Download, Headphones, BookOpen, Video, ArrowRight, CheckCircle2, Zap, Activity } from 'lucide-react';

const pillars = [
  {
    icon: Download,
    title: 'Easy To Install',
    highlight: 'Plug & Play Architecture',
    description: 'Rapid cloud deployment with zero complex local dependencies. Seamless one-click desktop and web client onboarding.',
    color: 'text-cyan',
    badge: 'Fast Setup'
  },
  {
    icon: Headphones,
    title: 'Professional Support',
    highlight: '24/7 FIX Engineering Desk',
    description: 'Dedicated capital market engineers offering 24/7 live monitoring, FIX diagnostics, and mission-critical desk support.',
    color: 'text-emerald',
    badge: '24/7 SLA'
  },
  {
    icon: BookOpen,
    title: 'Multilingual Documentation',
    highlight: 'Exhaustive API & Message Specs',
    description: 'Complete FIX 4.4/5.0 protocol dictionaries, REST & WebSocket documentation, and interactive trader handbooks.',
    color: 'text-primary',
    badge: 'Dev Docs'
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    highlight: 'Hands-on Trader Workflows',
    description: 'In-depth step-by-step video courses covering algorithmic order slicing, real-time risk controls, and terminal mastery.',
    color: 'text-warning',
    badge: 'Video Academy'
  }
];

export default function AdvancedOmsFeatures() {
  const dispatch = useDispatch();

  return (
    <section id="features" className="py-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--bg-primary) 0%, rgba(13, 20, 36, 0.6) 100%)' }}>
      <div className="container-fluid px-lg-5">
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="section-badge mb-3 d-inline-flex align-items-center gap-2">
            <Activity size={14} className="text-cyan pulse-glow" />
            <span>Active Trader Architecture</span>
          </div>

          <h2 className="display-5 font-heading fw-extrabold mb-3">
            Advanced Trading OMS <br />
            <span className="text-gradient">With Cutting-Edge Features Needed By Active Traders</span>
          </h2>

          <p className="lead text-muted col-lg-7 mx-auto" style={{ fontSize: '1.1rem' }}>
            Built ground-up for high-frequency algorithmic routing, real-time Level 2 market depth, automated pre-trade risk validation, and sub-millisecond execution.
          </p>
        </div>

        {/* 4 Feature Pillars */}
        <div className="row g-4 mb-5">
          {pillars.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="col-12 col-sm-6 col-lg-3">
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between position-relative border-highlight">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="p-3 rounded-3 bg-quant-glow d-inline-flex align-items-center justify-content-center">
                        <IconComp size={28} className={item.color} />
                      </div>
                      <span className="badge bg-secondary bg-opacity-50 font-mono small text-dim">{item.badge}</span>
                    </div>

                    <h3 className="h5 font-heading fw-bold text-main mb-1">{item.title}</h3>
                    <div className="small font-mono text-cyan mb-2 fw-semibold">{item.highlight}</div>
                    <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>{item.description}</p>
                  </div>

                  <div className="pt-3 mt-3 border-top border-secondary border-opacity-25 d-flex align-items-center gap-2 text-dim small font-mono">
                    <CheckCircle2 size={14} className="text-emerald" />
                    <span>Verified Production Ready</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Central Showcase Display: OMS Dashboard Screen */}
        <div className="position-relative rounded-4 p-2 p-md-4 glass-panel border-highlight shadow-lg overflow-hidden my-4">
          <div className="position-absolute top-0 end-0 p-4 pe-none opacity-25">
            <Zap size={220} className="text-cyan" />
          </div>

          <div className="row align-items-center g-4">
            <div className="col-lg-5">
              <div className="p-3">
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-up bg-opacity-10 text-up border border-up border-opacity-25 font-mono small mb-3">
                  <span className="spinner-grow spinner-grow-sm" role="status" style={{ width: '8px', height: '8px' }}></span>
                  <span>LIVE INSTITUTIONAL PLATFORM</span>
                </div>

                <h3 className="h2 font-heading fw-bold text-main mb-3">
                  Next-Gen qTrader <br />
                  <span className="text-gradient">Execution Dashboard</span>
                </h3>

                <p className="text-muted mb-4" style={{ lineHeight: 1.7 }}>
                  Experience institutional grade market depth, real-time VWAP execution algorithms, direct DSE & CSE order routing, and zero-latency market data streams in one consolidated interface.
                </p>

                <div className="d-flex flex-column gap-2 mb-4 font-mono small">
                  <div className="d-flex align-items-center gap-2 text-main">
                    <CheckCircle2 size={16} className="text-emerald" />
                    <span>Ultra-low 420 μs internal processing latency</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-main">
                    <CheckCircle2 size={16} className="text-emerald" />
                    <span>Certified DSE FIX 5.0 SP2 & CSE FAST Protocol</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-main">
                    <CheckCircle2 size={16} className="text-emerald" />
                    <span>Automated Pre-Trade RMS and Auto-Liquidation</span>
                  </div>
                </div>

                <button
                  onClick={() => dispatch(openDemoModal())}
                  className="btn btn-quant-primary btn-lg d-inline-flex align-items-center gap-2 shadow-lg"
                >
                  <span>Request Full OMS Demo</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="col-lg-7 text-center">
              <div className="position-relative rounded-3 overflow-hidden shadow-2xl border border-secondary border-opacity-30">
                <img
                  src="/assets/images/banner-screen-oms.png"
                  alt="Quant Fintech Limited's OMS interface on the dashboard screen"
                  className="img-fluid rounded-3"
                  style={{ maxHeight: '460px', width: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/qtrader-oms-dashboard.jpg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
