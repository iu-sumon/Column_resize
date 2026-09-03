import React, { useState } from 'react';
import { Award, CheckCircle2, ShieldCheck, BadgeCheck, Building2, Landmark } from 'lucide-react';

const certs = [
  {
    title: 'ISO Certified',
    subtitle: 'Quality Management Standards',
    image: '/assets/images/iso-certificated.png',
    fallbackIcon: ShieldCheck,
    iconColor: 'text-emerald',
    imgWidth: '84px',
    glow: '#10b981'
  },
  {
    title: 'Associate Member',
    subtitle: 'BASIS Bangladesh',
    image: '/assets/images/basis-logo.svg',
    fallbackIcon: BadgeCheck,
    iconColor: 'text-cyan',
    imgWidth: '92px',
    glow: '#00e5ff'
  },
  {
    title: 'FIX & FAST Certified',
    subtitle: 'Chittagong Stock Exchange (CSE)',
    image: '/assets/images/cse-logo.svg',
    fallbackIcon: Building2,
    iconColor: 'text-primary',
    imgWidth: '76px',
    glow: '#6366f1'
  },
  {
    title: 'FIX & ITCH Certified',
    subtitle: 'Dhaka Stock Exchange (DSE)',
    image: '/assets/images/dse-logo.svg',
    fallbackIcon: Landmark,
    iconColor: 'text-warning',
    imgWidth: '84px',
    glow: '#f59e0b'
  }
];

function CertCard({ cert }) {
  const [imgError, setImgError] = useState(false);
  const FallbackIcon = cert.fallbackIcon;

  return (
    <div className="col-6 col-md-3">
      <div
        className="glass-card p-4 rounded-3 h-100 d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden"
        style={{
          border: '1px solid var(--border-highlight)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Subtle glow behind icon */}
        <div
          className="position-absolute top-50 start-50 translate-middle pe-none rounded-circle"
          style={{
            width: '120px',
            height: '120px',
            background: `radial-gradient(circle, ${cert.glow}15 0%, transparent 70%)`,
            zIndex: 0
          }}
        />

        {/* Image / Fallback Icon */}
        <div
          className="d-flex align-items-center justify-content-center mb-3 position-relative"
          style={{ height: '75px', zIndex: 1 }}
        >
          {!imgError ? (
            <img
              src={cert.image}
              alt={cert.title}
              style={{
                width: cert.imgWidth,
                maxHeight: '70px',
                objectFit: 'contain',
                filter: 'brightness(1.1) drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={`d-flex align-items-center justify-content-center rounded-circle ${cert.iconColor}`}
              style={{
                width: '70px',
                height: '70px',
                background: `${cert.glow}18`,
                border: `2px solid ${cert.glow}40`
              }}
            >
              <FallbackIcon size={36} />
            </div>
          )}
        </div>

        <h4 className="h6 font-heading fw-bold text-main mb-1 text-center position-relative" style={{ zIndex: 1 }}>
          {cert.title}
        </h4>
        <span className="font-mono text-dim small text-center" style={{ fontSize: '0.75rem', zIndex: 1 }}>
          {cert.subtitle}
        </span>
        <div className="mt-2 d-flex align-items-center gap-1 text-emerald font-mono position-relative" style={{ fontSize: '0.72rem', zIndex: 1 }}>
          <CheckCircle2 size={13} />
          <span>VERIFIED</span>
        </div>
      </div>
    </div>
  );
}

export default function CertificationsAccreditation() {
  return (
    <section className="py-5 position-relative" style={{ background: 'linear-gradient(180deg, rgba(13, 20, 36, 0.4) 0%, var(--bg-primary) 100%)' }}>
      <div className="container-fluid px-lg-5">
        <div className="glass-panel p-4 p-lg-5 rounded-4 border-highlight shadow-lg position-relative overflow-hidden">
          {/* Background radial glow */}
          <div
            className="position-absolute top-50 start-50 translate-middle pe-none"
            style={{
              width: '80%',
              height: '80%',
              background: 'radial-gradient(circle, rgba(0, 229, 255, 0.06) 0%, transparent 70%)',
              zIndex: 0
            }}
          />

          {/* Section Header */}
          <div className="text-center mb-5 position-relative" style={{ zIndex: 1 }}>
            <div className="section-badge mb-3 d-inline-flex align-items-center gap-2">
              <Award size={14} className="text-emerald pulse-glow" />
              <span>Official Accreditations</span>
            </div>
            <h3 className="h3 font-heading fw-bold text-main">
              Certified & Compliant with <span className="text-gradient">Capital Market Authorities</span>
            </h3>
            <p className="text-muted small col-lg-8 mx-auto mt-2">
              Quant Fintech holds regulatory certifications from both national stock exchanges and international quality standards bodies.
            </p>
          </div>

          {/* Certification Cards */}
          <div className="row g-4 align-items-stretch justify-content-center position-relative" style={{ zIndex: 1 }}>
            {certs.map((c, idx) => (
              <CertCard key={idx} cert={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
