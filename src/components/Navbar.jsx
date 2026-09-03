import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';
import { openDemoModal } from '../store/terminalSlice';
import { Sun, Moon, Zap, ChevronDown, Activity, PhoneCall } from 'lucide-react';

export default function Navbar() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const fixLatency = useSelector((state) => state.market.fixLatency);

  return (
    <header className="sticky-top glass-panel shadow-sm border-0 rounded-0 z-3" style={{ background: 'var(--nav-bg)' }}>
      <nav className="navbar navbar-expand-lg py-2 container-fluid px-lg-5">
        {/* Brand Logo */}
        <a className="navbar-brand d-flex align-items-center gap-2 fw-bold" href="#home">
          <img
            src="/assets/images/logo-white.svg"
            alt="Quant Fintech"
            style={{ height: '32px', width: 'auto' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="d-flex flex-column">
            <span className="font-heading fs-4 lh-1 fw-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
              QUANT<span className="text-gradient">FINTECH</span>
            </span>
            <span className="text-uppercase font-mono text-dim" style={{ fontSize: '0.62rem', letterSpacing: '2px' }}>
              Institutional AI Trading
            </span>
          </div>
        </a>

        {/* Live System Status Badge */}
        <div className="d-none d-xl-flex align-items-center gap-2 ms-4 px-3 py-1 rounded-pill glass-card" style={{ fontSize: '0.8rem' }}>
          <span className="spinner-grow spinner-grow-sm text-success" role="status" style={{ width: '8px', height: '8px' }}></span>
          <span className="text-muted">FIX 5.0 Gateway:</span>
          <span className="font-mono text-up fw-semibold">{fixLatency}</span>
        </div>

        {/* Mobile Navbar Toggler */}
        <button
          className="navbar-toggler border-0 text-main shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#quantNavbar"
          aria-controls="quantNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-2" style={{ color: 'var(--text-main)' }}></i>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="quantNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fw-medium gap-lg-3">
            <li className="nav-item">
              <a className="nav-link active px-2 text-main hover-cyan" href="#home">Home</a>
            </li>
            
            {/* Products Dropdown */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle px-2 text-main d-flex align-items-center gap-1" href="#products" role="button" data-bs-toggle="dropdown">
                Products <ChevronDown size={14} />
              </a>
              <ul className="dropdown-menu glass-panel border-0 shadow-lg p-2" style={{ minWidth: '250px' }}>
                <li><a className="dropdown-item py-2 rounded-2 text-main fw-semibold" href="#products">qTrader — High Speed OMS</a></li>
                <li><a className="dropdown-item py-2 rounded-2 text-main fw-semibold" href="#products">OCS — Execution Platform</a></li>
                <li><a className="dropdown-item py-2 rounded-2 text-main fw-semibold" href="#products">qWeb — Brokerage CRM</a></li>
                <li><a className="dropdown-item py-2 rounded-2 text-main fw-semibold" href="#products">qHR — Fintech HR & Payroll</a></li>
                <li><a className="dropdown-item py-2 rounded-2 text-main fw-semibold" href="#products">qOffice — Back Office & Clearing</a></li>
                <li><a className="dropdown-item py-2 rounded-2 text-main fw-semibold" href="#products">Online BO — Onboarding Portal</a></li>
                <li><a className="dropdown-item py-2 rounded-2 text-main fw-semibold" href="#products">qRMS — Risk Management System</a></li>
              </ul>
            </li>

            <li className="nav-item">
              <a className="nav-link px-2 text-main hover-cyan" href="#features">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-2 text-main hover-cyan" href="#terminal">Terminal</a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-2 text-main hover-cyan" href="#services">Services</a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-2 text-main hover-cyan" href="#consultancy">Consultancy</a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-2 text-main hover-cyan" href="#clients">Clients</a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-2 text-main hover-cyan" href="#news">Media & News</a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-2 text-main hover-cyan" href="#roi">Calculator</a>
            </li>
          </ul>

          {/* Action Buttons & Theme Switcher */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="btn glass-card p-2 rounded-circle d-flex align-items-center justify-content-center text-main"
              title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
              style={{ width: '42px', height: '42px' }}
            >
              {themeMode === 'dark' ? (
                <Sun size={20} className="text-warning pulse-glow" />
              ) : (
                <Moon size={20} className="text-primary" />
              )}
            </button>

            {/* Request Demo Modal Button */}
            <button
              onClick={() => dispatch(openDemoModal())}
              className="btn btn-quant-primary d-flex align-items-center gap-2"
            >
              <Activity size={18} />
              <span>Schedule Demo</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
