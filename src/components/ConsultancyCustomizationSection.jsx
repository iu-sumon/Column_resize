import React from 'react';
import { useDispatch } from 'react-redux';
import { openDemoModal } from '../store/terminalSlice';
import { Compass, Settings2, ArrowRight, CheckCircle2, ShieldCheck, Cpu, Code2, Sparkles, Lightbulb, BarChart3, Globe, TrendingUp } from 'lucide-react';

export default function ConsultancyCustomizationSection() {
  const dispatch = useDispatch();

  return (
    <section id="consultancy" className="py-5 position-relative">
      <div className="container-fluid px-lg-5">
        
        {/* ─── BLOCK 1: Consultancy ─── */}
        <div className="row align-items-center gy-5 mb-5 py-4">
          <div className="col-lg-6 order-2 order-lg-1">
            <div className="pe-lg-4">
              <div className="section-badge mb-3 d-inline-flex align-items-center gap-2">
                <Compass size={14} className="text-cyan pulse-glow" />
                <span>Capital Market Advisory</span>
              </div>

              <h2 className="display-5 font-heading fw-extrabold mb-3">
                Technology-Driven <br />
                <span className="text-gradient">Consultancy</span>
              </h2>

              <p className="lead text-muted mb-4" style={{ fontSize: '1.15rem', lineHeight: 1.7 }}>
                We provide technology-driven consultancy to optimise and accelerate your financial business. With decades of domain mastery across exchange matching engines, clearing operations, and high-frequency infrastructure, our experts guide your digital roadmap.
              </p>

              {/* Advisory Feature Cards */}
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="glass-card p-3 rounded-3 h-100">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div className="p-2 rounded-2 bg-quant-glow">
                        <ShieldCheck size={18} className="text-emerald" />
                      </div>
                      <span className="fw-bold font-heading small text-main">DSE & CSE Advisory</span>
                    </div>
                    <p className="text-muted small mb-0">API sharing, FIX certification, and regulatory compliance clearance.</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="glass-card p-3 rounded-3 h-100">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div className="p-2 rounded-2 bg-quant-glow">
                        <Cpu size={18} className="text-cyan" />
                      </div>
                      <span className="fw-bold font-heading small text-main">Infra Optimization</span>
                    </div>
                    <p className="text-muted small mb-0">Sub-millisecond network topology, DevSecOps pipelines, and cloud failover.</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="glass-card p-3 rounded-3 h-100">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div className="p-2 rounded-2 bg-quant-glow">
                        <BarChart3 size={18} className="text-primary" />
                      </div>
                      <span className="fw-bold font-heading small text-main">Market Architecture</span>
                    </div>
                    <p className="text-muted small mb-0">Scalable exchange connectivity, multi-venue order routing, and liquidity analysis.</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="glass-card p-3 rounded-3 h-100">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div className="p-2 rounded-2 bg-quant-glow">
                        <Globe size={18} className="text-warning" />
                      </div>
                      <span className="fw-bold font-heading small text-main">Digital Roadmap</span>
                    </div>
                    <p className="text-muted small mb-0">End-to-end fintech transformation strategy for modern capital markets.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => dispatch(openDemoModal())}
                className="btn btn-quant-primary btn-lg d-inline-flex align-items-center gap-2 shadow-lg"
              >
                <span>Schedule Technology Consultation</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="col-lg-6 order-1 order-lg-2 text-center">
            <div className="glass-panel p-4 rounded-4 position-relative border-highlight shadow-lg overflow-hidden" style={{ minHeight: '380px' }}>
              <img
                src="/assets/images/Consultancy.svg"
                alt="Quant Fintech Consultancy"
                className="img-fluid position-relative"
                style={{ maxHeight: '360px', objectFit: 'contain', zIndex: 1 }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              {/* Fallback decorative background */}
              <div className="position-absolute top-50 start-50 translate-middle pe-none opacity-10" style={{ zIndex: 0 }}>
                <Compass size={280} className="text-cyan" />
              </div>
            </div>
          </div>
        </div>

        {/* ─── CAPITAL MARKET EXCELLENCE Divider ─── */}
        <div className="my-5 position-relative d-flex align-items-center justify-content-center">
          <div className="flex-grow-1 border-top border-secondary border-opacity-25"></div>
          <div className="mx-4 px-4 py-2 glass-panel rounded-pill border-highlight shadow-sm d-flex align-items-center gap-2">
            <TrendingUp size={16} className="text-emerald" />
            <span className="text-cyan small font-mono fw-semibold letter-spacing-1">CAPITAL MARKET EXCELLENCE</span>
          </div>
          <div className="flex-grow-1 border-top border-secondary border-opacity-25"></div>
        </div>

        {/* ─── BLOCK 2: Customization ─── */}
        <div className="row align-items-center gy-5 mt-4 py-4">
          <div className="col-lg-6 text-center">
            <div className="glass-panel p-4 rounded-4 position-relative border-highlight shadow-lg overflow-hidden" style={{ minHeight: '380px' }}>
              <img
                src="/assets/images/Customization.svg"
                alt="Quant Fintech Customization"
                className="img-fluid position-relative"
                style={{ maxHeight: '360px', objectFit: 'contain', zIndex: 1 }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="position-absolute top-50 start-50 translate-middle pe-none opacity-10" style={{ zIndex: 0 }}>
                <Settings2 size={280} className="text-emerald" />
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="ps-lg-4">
              <div className="section-badge mb-3 d-inline-flex align-items-center gap-2">
                <Settings2 size={14} className="text-emerald pulse-glow" />
                <span>Bespoke Engineering</span>
              </div>

              <h2 className="display-5 font-heading fw-extrabold mb-3">
                Tailored Solutions & <br />
                <span className="text-gradient-alt">Customization</span>
              </h2>

              <p className="lead text-muted mb-4" style={{ fontSize: '1.15rem', lineHeight: 1.7 }}>
                We provide custom-made solutions to our clients with a profound knowledge of stock exchange operations, functioning, and proprietary product development. Tailor every algorithm, UI layout, and risk threshold to your desk requirements.
              </p>

              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 rounded-2 bg-quant-glow text-emerald mt-1 flex-shrink-0">
                    <Code2 size={18} />
                  </div>
                  <div>
                    <h5 className="font-heading fw-bold text-main mb-1" style={{ fontSize: '1rem' }}>Proprietary Trading Desks & Smart Order Routing</h5>
                    <p className="text-muted small mb-0">Custom execution algorithms (TWAP, VWAP, Iceberg) integrated into broker FIX engines.</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 rounded-2 bg-quant-glow text-cyan mt-1 flex-shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h5 className="font-heading fw-bold text-main mb-1" style={{ fontSize: '1rem' }}>Custom Back-Office & Margin Management</h5>
                    <p className="text-muted small mb-0">Adaptable accounting, multi-currency balance ledgers, and institutional reporting formats.</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 rounded-2 bg-quant-glow text-warning mt-1 flex-shrink-0">
                    <Lightbulb size={18} />
                  </div>
                  <div>
                    <h5 className="font-heading fw-bold text-main mb-1" style={{ fontSize: '1rem' }}>White-Label & Branded OMS Solutions</h5>
                    <p className="text-muted small mb-0">Deploy fully branded trading platforms with your firm's identity, colors, and domain.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => dispatch(openDemoModal())}
                className="btn btn-quant-outline btn-lg d-inline-flex align-items-center gap-2 glass-panel shadow-lg"
              >
                <span>Request Custom Solution</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
