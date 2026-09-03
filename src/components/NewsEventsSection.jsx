import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { openDemoModal } from '../store/terminalSlice';
import { Newspaper, Calendar, ArrowRight, Tag, ExternalLink, Sparkles } from 'lucide-react';

const newsItems = [
  {
    id: 'iidfc',
    title: 'IIDFC Securities Selects Quant Fintech for Next-Gen OMS',
    bengaliTitle: 'নিজস্ব ওএমএস আনছে আইআইডিএফসি সিকিউরিটিজ',
    date: 'May 07, 2025',
    category: 'OMS Partnership',
    image: '/assets/images/banner-screen-oms.png',
    excerpt: 'To provide enhanced electronic trading services to its institutional and retail clients, IIDFC Securities signed an agreement with Quant Fintech Limited to deploy its flagship OMS platform.'
  },
  {
    id: 'nrbc',
    title: 'NRBC Bank Securities Launches Proprietary Trading OMS',
    bengaliTitle: 'নিজস্ব ওএমএস চালু করছে এনআরবিসি ব্যাংক সিকিউরিটিজ',
    date: 'May 04, 2025',
    category: 'Banking Securities',
    image: '/assets/images/banner-screen-oms.png',
    excerpt: 'NRBC Bank Securities Limited, one of the premier bank-backed brokerages in Bangladesh, partners with Quant Fintech to roll out its cutting-edge Order Management System.'
  },
  {
    id: 'sbac',
    title: 'SBAC Bank Investment Deploys Quant Fintech OMS on DSE',
    bengaliTitle: 'ওএমএস চালু করতে যাচ্ছে এসবিএসি ব্যাংক ইনভেস্টমেন্ট',
    date: 'March 24, 2025',
    category: 'Institutional OMS',
    image: '/assets/images/banner-screen-oms.png',
    excerpt: 'SBAC Bank Investment Limited, a corporate TREC holder of Dhaka Stock Exchange (DSE), adopts Quant Fintech’s ultra-low latency OMS to transform customer trade execution.'
  },
  {
    id: 'pbsl',
    title: 'PBSL Partners with Quant FinTech for Institutional OMS',
    bengaliTitle: 'PBSL partners with Quant FinTech for OMS',
    date: 'March 19, 2024',
    category: 'Prime Bank Group',
    image: '/assets/images/blog/pbsl-partners-with-quant-fintech-for-oms.php.jpg',
    excerpt: 'Prime Bank Securities (PBSL), an associate company of Prime Bank Limited and TREC holder of DSE, is all set to launch its high-frequency OMS powered by Quant FinTech.'
  },
  {
    id: 'royal-capital',
    title: 'Royal Capital & Quant Fintech Team Up to Launch ‘Tradefast’ OMS',
    bengaliTitle: 'Royal Capital, Quant Fintech team up to launch ‘Tradefast’ OMS',
    date: 'August 21, 2023',
    category: 'OMS Launch',
    image: '/assets/images/blog/royal-capital-quant-fintech-team-up-to-launch-tradefast-oms.jpg',
    excerpt: 'Royal Capital Ltd introduces its proprietary OMS named ‘Tradefast’, offering multi-asset smart order routing and advanced algorithmic capabilities developed by Quant Fintech.'
  },
  {
    id: 'smart-share',
    title: 'Smart Share & Securities Launches Next-Gen OMS',
    bengaliTitle: 'Smart Share & Securities launches OMS',
    date: 'March 09, 2022',
    category: 'Active Trading',
    image: '/assets/images/blog/smart-share-securities-launches-oms.jpg',
    excerpt: 'Smart Share & Securities goes live with Quant Fintech’s high-throughput order execution framework, enabling seamless web and mobile access to stock exchange order books.'
  },
  {
    id: 'island-sec',
    title: 'Island Securities Introduces Fintech Technology for Frictionless Trading',
    bengaliTitle: 'Island Securities to introduce fintech technology',
    date: 'March 08, 2022',
    category: 'Innovation',
    image: '/assets/images/blog/island-securities-to-introduce-fintech-technology.jpg',
    excerpt: 'Island Securities Limited partners with Quant FinTech Ltd to deliver direct market access and remove hassle in capital market transactions for all investors.'
  },
  {
    id: 'uftcl-fix',
    title: 'First FIX Certification from Dhaka Stock Exchange for UFTCL',
    bengaliTitle: 'First FIX Certification for UFTCL',
    date: 'February 24, 2022',
    category: 'DSE Certification',
    image: '/assets/images/blog/first-fix-certification-for-uftcl.jpg',
    excerpt: 'UFTCL receives the historic first FIX Certificate from Dhaka Stock Exchange authority for the institutional OMS engine developed entirely in Bangladesh by Quant FinTech Ltd.'
  }
];

export default function NewsEventsSection() {
  const dispatch = useDispatch();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const categories = ['All', 'OMS Partnership', 'Banking Securities', 'OMS Launch', 'DSE Certification'];

  const filteredNews = selectedFilter === 'All' 
    ? newsItems 
    : newsItems.filter(n => n.category.includes(selectedFilter) || selectedFilter === 'All');

  return (
    <section id="news" className="py-5 position-relative">
      <div className="container-fluid px-lg-5">
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="section-badge mb-3 d-inline-flex align-items-center gap-2">
            <Newspaper size={14} className="text-cyan pulse-glow" />
            <span>Media & Announcements</span>
          </div>

          <h2 className="display-5 font-heading fw-extrabold mb-3">
            Latest News & <span className="text-gradient">Events</span>
          </h2>

          <p className="lead text-muted col-lg-7 mx-auto" style={{ fontSize: '1.15rem' }}>
            Follow our latest exchange certifications, broker partnerships, platform launches, and milestones driving capital market technology forward.
          </p>

          {/* Filter Pills */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFilter(cat)}
                className={`btn btn-sm rounded-pill px-3 py-1 font-mono transition-all ${
                  selectedFilter === cat
                    ? 'btn-quant-primary shadow-sm'
                    : 'btn-quant-outline glass-panel text-dim'
                }`}
                style={{ fontSize: '0.82rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="row g-4">
          {filteredNews.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-3">
              <div className="glass-card h-100 d-flex flex-column overflow-hidden border-highlight position-relative group-hover">
                {/* News Image Preview */}
                <div className="position-relative overflow-hidden" style={{ height: '170px', background: 'var(--bg-glass)' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-100 h-100 object-fit-cover transition-transform"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/images/banner-screen-oms.png';
                    }}
                  />
                  <div className="position-absolute top-0 start-0 m-2">
                    <span className="badge bg-primary bg-opacity-90 font-mono small px-2 py-1 shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* News Content */}
                <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
                  <div>
                    <div className="d-flex align-items-center gap-2 text-dim font-mono small mb-2">
                      <Calendar size={13} className="text-cyan" />
                      <span>{item.date}</span>
                    </div>

                    <h4 className="h6 font-heading fw-bold text-main mb-2" style={{ lineHeight: 1.45 }}>
                      {item.title}
                    </h4>

                    <p className="text-muted small mb-3" style={{ lineHeight: 1.6 }}>
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                    <button
                      onClick={() => dispatch(openDemoModal())}
                      className="btn btn-link text-cyan p-0 font-mono small d-inline-flex align-items-center gap-1 text-decoration-none"
                    >
                      <span>Read Story</span>
                      <ArrowRight size={14} />
                    </button>
                    <span className="font-mono text-dim small">DSE / CSE</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-5 p-4 rounded-4 glass-panel border-highlight d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-lg">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-quant-glow text-cyan">
              <Sparkles size={24} />
            </div>
            <div>
              <h5 className="font-heading fw-bold text-main mb-1">Partner with Quant Fintech Limited</h5>
              <p className="text-muted small mb-0">Join over 35+ certified capital market brokerages and institutions across DSE & CSE.</p>
            </div>
          </div>

          <button
            onClick={() => dispatch(openDemoModal())}
            className="btn btn-quant-primary d-flex align-items-center gap-2 shadow-sm"
          >
            <span>Get Started</span>
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
