import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';
import { Mail, Phone, MapPin, Sun, Moon, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);

  return (
    <footer className="position-relative overflow-hidden pt-5 pb-3 border-top border-secondary border-opacity-25" style={{ background: 'var(--bg-secondary)' }}>
      {/* Modern High-Tech Accent Line at the Top Border */}
      <div
        className="position-absolute top-0 start-0 w-100 pe-none"
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.6) 20%, rgba(16, 185, 129, 0.6) 80%, transparent 100%)',
          boxShadow: '0 0 16px rgba(0, 229, 255, 0.4)',
          zIndex: 2
        }}
      />

      {/* Modern Cybernetic Micro-Dot Grid with Radial Vignette */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 pe-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(0, 229, 255, 0.14) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          zIndex: 0
        }}
      />

      {/* Dual Modern Aurora Ambient Glow Orbs */}
      <div
        className="position-absolute pe-none rounded-circle"
        style={{
          width: '550px',
          height: '550px',
          top: '-180px',
          right: '5%',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          zIndex: 0
        }}
      />
      <div
        className="position-absolute pe-none rounded-circle"
        style={{
          width: '500px',
          height: '500px',
          bottom: '-120px',
          left: '8%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0
        }}
      />

      <div className="container-fluid px-lg-5 position-relative" style={{ zIndex: 1 }}>
        <div className="row g-4 mb-4">
          
          {/* Column 1: Logo & Company Description (col-lg-3 col-md-6) */}
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="d-flex flex-column h-100">
              <a className="d-inline-flex align-items-center gap-2 mb-3 text-decoration-none" href="#home">
                <img
                  src="/assets/images/logo-white.svg"
                  alt="Quant Fintech Limited"
                  style={{ height: '32px', width: 'auto' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="font-heading fw-bold fs-5 tracking-tight text-main">
                  QUANT<span className="text-gradient">FINTECH</span>
                </span>
              </a>

              <p className="text-muted small mb-3 pe-lg-2" style={{ lineHeight: 1.7 }}>
                Quant Fintech Ltd. provides technology solutions to the financial market in Bangladesh. We have the know-how and experience to deliver the best of OMS as per the industry’s requirements.
              </p>

              <div className="mt-auto">
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill glass-card font-mono small text-up border border-up border-opacity-25">
                  <span className="spinner-grow spinner-grow-sm" role="status" style={{ width: '7px', height: '7px' }}></span>
                  <span>OMS Uptime: 99.999% SLA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Link (col-lg-3 col-md-6) */}
          <div className="col-lg-3 col-md-6 col-sm-12 ps-lg-4">
            <h5 className="font-heading fw-bold text-main mb-3 fs-6 text-uppercase letter-spacing-1">Quick Link</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
              <li>
                <a href="#home" className="text-muted text-decoration-none hover-cyan transition-colors d-inline-block py-1">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="text-muted text-decoration-none hover-cyan transition-colors d-inline-block py-1">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="text-muted text-decoration-none hover-cyan transition-colors d-inline-block py-1">
                  Services
                </a>
              </li>
              <li>
                <a href="#products" className="text-muted text-decoration-none hover-cyan transition-colors d-inline-block py-1">
                  Products
                </a>
              </li>
              <li>
                <a href="#news" className="text-muted text-decoration-none hover-cyan transition-colors d-inline-block py-1">
                  Media & News
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company (col-lg-3 col-md-6) */}
          <div className="col-lg-3 col-md-6 col-sm-12 ps-lg-3">
            <h5 className="font-heading fw-bold text-main mb-3 fs-6 text-uppercase letter-spacing-1">Company</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small mb-3">
              <li>
                <a href="#home" className="text-muted text-decoration-none hover-cyan transition-colors d-inline-block py-1">
                  Terms & Condition
                </a>
              </li>
              <li>
                <a href="#home" className="text-muted text-decoration-none hover-cyan transition-colors d-inline-block py-1">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#features" className="text-muted text-decoration-none hover-cyan transition-colors d-inline-block py-1">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#consultancy" className="text-muted text-decoration-none hover-cyan transition-colors d-inline-block py-1">
                  Contact Us
                </a>
              </li>
            </ul>

            <button
              onClick={() => dispatch(toggleTheme())}
              className="btn btn-sm glass-card px-3 py-1 text-main d-inline-flex align-items-center gap-2 font-mono small"
            >
              {themeMode === 'dark' ? <Sun size={14} className="text-warning" /> : <Moon size={14} className="text-primary" />}
              <span>{themeMode === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
            </button>
          </div>

          {/* Column 4: Contact (col-lg-3 col-md-6) */}
          <div className="col-lg-3 col-md-6 col-sm-12">
            <h5 className="font-heading fw-bold text-main mb-3 fs-6 text-uppercase letter-spacing-1">Contact</h5>
            <ul className="list-unstyled d-flex flex-column gap-3 small text-muted font-mono mb-3">
              <li className="d-flex align-items-start gap-2">
                <MapPin size={18} className="text-cyan flex-shrink-0 mt-1" />
                <span style={{ lineHeight: 1.55 }}>
                  PFI Tower (Level-3), 56-57 Dilkusha C/A, Motijheel, Dhaka-1000
                </span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-emerald flex-shrink-0" />
                <a href="mailto:support@quantfintech.ai" className="text-muted text-decoration-none hover-cyan">
                  support@quantfintech.ai
                </a>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <a href="tel:01711229800" className="text-muted text-decoration-none hover-cyan">
                  (+88) 01711229800
                </a>
              </li>
            </ul>

            {/* Official Social Links */}
            <div className="d-flex align-items-center gap-2 pt-1">
              <a
                href="https://www.facebook.com/quantfintech/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn glass-card p-2 rounded-circle text-main d-flex align-items-center justify-content-center"
                style={{ width: '38px', height: '38px' }}
                title="Facebook"
              >
                <i className="bi bi-facebook fs-6 text-primary"></i>
              </a>
              <a
                href="https://bd.linkedin.com/company/quantfintech"
                target="_blank"
                rel="noopener noreferrer"
                className="btn glass-card p-2 rounded-circle text-main d-flex align-items-center justify-content-center"
                style={{ width: '38px', height: '38px' }}
                title="LinkedIn"
              >
                <i className="bi bi-linkedin fs-6 text-cyan"></i>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Matching quantfintech.ai */}
        <div className="pt-3 border-top border-secondary border-opacity-25 d-flex flex-wrap justify-content-between align-items-center gap-3 small text-muted font-mono">
          <div>
            Copyright © {new Date().getFullYear()} <a href="https://quantbd.com/" className="text-cyan text-decoration-none fw-semibold">Quantfintech</a> All Rights Reserved
          </div>

          <div className="d-flex gap-4">
            <a href="#home" className="text-muted text-decoration-none hover-cyan">Terms & Condition</a>
            <a href="#home" className="text-muted text-decoration-none hover-cyan">Privacy Policy</a>
            <a href="#consultancy" className="text-muted text-decoration-none hover-cyan">DSE & CSE API Sharing</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
