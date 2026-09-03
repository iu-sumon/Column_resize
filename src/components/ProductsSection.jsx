import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedProduct, openDemoModal } from '../store/terminalSlice';
import { Layers, ShieldCheck, Cpu, ArrowUpRight, CheckCircle, Database, Lock, Globe, Smartphone, UserCheck } from 'lucide-react';

const products = [
  {
    id: 'qtrader',
    name: 'qTrader',
    subtitle: 'Institutional Order Management System (OMS)',
    category: 'Core Trading',
    icon: Cpu,
    logo: '/assets/images/qtrader-logo.svg',
    description: 'Ultra-low latency Order Management System supporting FIX Protocol 4.4/5.0, high-frequency execution routing, risk compliance controls, and real-time exchange feeds.',
    features: [
      'FIX 4.4 & 5.0 SP2 Gateway Integration',
      'Sub-Millisecond Order Routing & Matching',
      'Algorithmic Trading & Multi-Asset Support',
      'Integrated Pre-Trade & Post-Trade RMS'
    ]
  },
  {
    id: 'ocs',
    name: 'OCS',
    subtitle: 'Order Execution & Management Framework (OEMF)',
    category: 'Core Trading',
    icon: Layers,
    logo: '/assets/images/ocs-logo.svg',
    description: 'Advanced Order Execution and Management Framework designed for institutional desk traders, market makers, and liquidity providers.',
    features: [
      'Smart Order Routing (SOR) Algorithms',
      'Multi-Broker Connectivity & FIX Engine',
      'Customizable Desk Trader Interface',
      'Real-Time Execution Analytics'
    ]
  },
  {
    id: 'qweb',
    name: 'qWeb',
    subtitle: 'Brokerage CRM & Client Portal',
    category: 'Client & Portal',
    icon: Globe,
    logo: '/assets/images/qWeb-logo.svg',
    description: 'Comprehensive CRM and digital client engagement platform tailored for stock brokerages, asset management firms, and investment banks.',
    features: [
      'Digital BO Account Onboarding',
      'Automated KYC & Document Verification',
      'Client Portfolio Insights & Reports',
      'Multi-channel Support & Communications'
    ]
  },
  {
    id: 'qhr',
    name: 'qHR',
    subtitle: 'Fintech Human Resource & Payroll',
    category: 'Enterprise',
    icon: UserCheck,
    logo: '/assets/images/qhr-logo.svg',
    description: 'Specialized HR and payroll management software built for capital market institutions, compliant with regulatory compensation frameworks.',
    features: [
      'Automated Attendance & Leave Management',
      'Brokerage Incentive & Commission Calculator',
      'Employee Self-Service Mobile Portal',
      'Taxation & Audit Log Generation'
    ]
  },
  {
    id: 'qoffice',
    name: 'qOffice',
    subtitle: 'Brokerage Back-Office & Clearing',
    category: 'Enterprise',
    icon: Database,
    logo: '/assets/images/qoffice-logo.svg',
    description: 'Complete back-office suite handling trade clearing, ledger accounting, CDBL depository participant reconciliation, and regulatory compliance reporting.',
    features: [
      'Automated CDBL Pay-in / Pay-out',
      'Real-Time Ledger & Margin Accounting',
      'DSE/CSE Trade File Ingestion',
      'Comprehensive Tax & Dividend Processing'
    ]
  },
  {
    id: 'onlinebo',
    name: 'Online BO',
    subtitle: 'Digital BO Account Onboarding',
    category: 'Client & Portal',
    icon: Smartphone,
    logo: '/assets/images/online-bo-logo.svg',
    description: 'Seamless digital BO account creation with e-KYC integration, banking gateway verification, and instant trading platform activation.',
    features: [
      'e-KYC & NID Verification',
      'Integrated Payment Gateway (Bkash, Nagad, Cards)',
      'Digital Signature Capture',
      'Instant CDBL Account Generation'
    ]
  },
  {
    id: 'qrms',
    name: 'qRMS',
    subtitle: 'Real-Time Risk Management System',
    category: 'Risk & Audit',
    icon: Lock,
    logo: '/assets/images/qrms.svg',
    description: 'Advanced enterprise risk engine offering real-time margin checking, auto-liquidation triggers, exposure limit monitoring, and stress testing.',
    features: [
      'Pre-Trade Margin Validation',
      'Automated Margin Call Notifications',
      'Multi-Tiered Risk Limit Hierarchy',
      'Real-Time Portfolio Loss Alerts'
    ]
  }
];

export default function ProductsSection() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'Core Trading', 'Client & Portal', 'Enterprise', 'Risk & Audit'];

  const filteredProducts = activeTab === 'All' ? products : products.filter((p) => p.category === activeTab);

  return (
    <section id="products" className="py-5 bg-secondary bg-opacity-25 position-relative">
      <div className="container-fluid px-lg-5">
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="section-badge mb-2">
            <Layers size={14} />
            <span>Product Suite</span>
          </div>
          <h2 className="display-5 font-heading fw-bold">
            Institutional <span className="text-gradient">Fintech Solutions</span>
          </h2>
          <p className="text-muted col-lg-6 mx-auto">
            From low-latency FIX OMS matching engines to back-office clearing and digital onboarding, explore Quant Fintech's flagship platforms.
          </p>

          {/* Category Tabs */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`btn px-3 py-2 rounded-pill font-mono ${
                  activeTab === cat ? 'btn-quant-primary' : 'btn-quant-outline'
                }`}
                style={{ fontSize: '0.85rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="row g-4">
          {filteredProducts.map((prod) => {
            const IconComp = prod.icon;
            return (
              <div key={prod.id} className="col-md-6 col-lg-4">
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="p-3 rounded-3 bg-quant-glow text-cyan d-flex align-items-center justify-content-center">
                        <IconComp size={28} />
                      </div>
                      <span className="badge bg-tertiary font-mono text-dim px-3 py-1 rounded-pill">{prod.category}</span>
                    </div>

                    <h3 className="font-heading fw-bold mb-1">{prod.name}</h3>
                    <span className="text-gradient fw-semibold font-mono small d-block mb-3">{prod.subtitle}</span>

                    <p className="text-muted small mb-4">{prod.description}</p>

                    {/* Features List */}
                    <ul className="list-unstyled mb-4">
                      {prod.features.map((feat, idx) => (
                        <li key={idx} className="d-flex align-items-start gap-2 mb-2 small">
                          <CheckCircle size={16} className="text-emerald flex-shrink-0 mt-1" />
                          <span className="text-main">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                    <button
                      onClick={() => {
                        dispatch(setSelectedProduct(prod));
                        dispatch(openDemoModal());
                      }}
                      className="btn btn-sm btn-quant-outline d-flex align-items-center gap-2"
                    >
                      <span>Request Demo</span>
                      <ArrowUpRight size={16} />
                    </button>
                    <span className="font-mono text-dim small fw-semibold">Quant Standard v4.5</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
