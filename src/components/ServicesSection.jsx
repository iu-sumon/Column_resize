import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { openDemoModal } from '../store/terminalSlice';
import { 
  Cpu, 
  Network, 
  Sparkles, 
  Cloud, 
  ShieldCheck, 
  Box, 
  Layers, 
  Palette, 
  Smartphone, 
  ArrowRight 
} from 'lucide-react';

const services = [
  {
    svgIcon: '/assets/images/icons/Fix-Integration-Services.svg',
    fallbackIcon: Cpu,
    title: 'Fix Integration Services',
    description: 'FIX engine libraries, FIX server, Exchange gateways, Trade Capture, Feed handlers, and testing tools for FIX protocol.',
    category: 'Protocol'
  },
  {
    svgIcon: '/assets/images/icons/connection.svg',
    fallbackIcon: Network,
    title: 'Connections',
    description: 'Supported connections are certified and have a proven performance track record: ECN/Exchanges, Broker Dealers, Technology Companies/ASP, TRF/Clearing Houses, IOI.',
    category: 'Connectivity'
  },
  {
    svgIcon: '/assets/images/icons/Digital-Transformation.svg',
    fallbackIcon: Sparkles,
    title: 'Digital Transformation',
    description: 'As industry after industry gets dramatically reshaped, empowering companies to take on this journey & capture the full benefits of the change.',
    category: 'Strategy'
  },
  {
    svgIcon: '/assets/images/icons/Cloud-Services.svg',
    fallbackIcon: Cloud,
    title: 'Cloud Services',
    description: 'Capitalize on the opportunities presented by the cloud & attain service quality, agility & cost savings while creating new business scenarios.',
    category: 'Infrastructure'
  },
  {
    svgIcon: '/assets/images/icons/DevSecOps.svg',
    fallbackIcon: ShieldCheck,
    title: 'DevSecOps',
    description: 'Providing integrated Agile coding, building, testing and deploying of software.',
    category: 'Security'
  },
  {
    svgIcon: '/assets/images/icons/Cloud-Native-Development-Services.svg',
    fallbackIcon: Box,
    title: 'Cloud Native Development Services',
    description: 'Migrating legacy applications to cloud-native architectures while contributing high degrees of automation & best-in-class DevOps practices.',
    category: 'Architecture'
  },
  {
    svgIcon: '/assets/images/icons/Design-Led-Platform-Engineering.svg',
    fallbackIcon: Layers,
    title: 'Design Led Platform Engineering',
    description: 'Architecting & creating scalable & extensible strategic digital platform solutions that will power your next breakthrough.',
    category: 'Engineering'
  },
  {
    svgIcon: '/assets/images/icons/ui-ux-design.svg',
    fallbackIcon: Palette,
    title: 'UI/UX Design',
    description: 'Delivering intuitive, user-friendly, engaging and personalized digital experiences.',
    category: 'Design'
  },
  {
    svgIcon: '/assets/images/icons/Mobile-App-Development.svg',
    fallbackIcon: Smartphone,
    title: 'Mobile App Development',
    description: 'Transforming businesses with Mobile-first app development solutions.',
    category: 'Mobile'
  }
];

function ServiceCard({ srv, onLearnMore }) {
  const [imgError, setImgError] = useState(false);
  const FallbackIcon = srv.fallbackIcon;

  return (
    <div className="col-md-6 col-lg-4">
      <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between border-highlight transition-all">
        <div>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div 
              className="p-3 rounded-3 bg-quant-glow d-inline-flex align-items-center justify-content-center shadow-sm"
              style={{ width: '60px', height: '60px' }}
            >
              {!imgError ? (
                <img
                  src={srv.svgIcon}
                  alt={srv.title}
                  style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <FallbackIcon size={28} className="text-cyan" />
              )}
            </div>
            <span className="badge bg-secondary bg-opacity-40 font-mono small text-dim">{srv.category}</span>
          </div>

          <h4 className="font-heading fw-bold text-main mb-2" style={{ fontSize: '1.2rem' }}>
            {srv.title}
          </h4>
          <p className="text-muted small mb-0" style={{ lineHeight: 1.65 }}>
            {srv.description}
          </p>
        </div>

        <button
          onClick={onLearnMore}
          className="btn btn-quant-outline btn-sm d-flex align-items-center gap-2 mt-4 w-fit"
        >
          <span>Learn More</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const dispatch = useDispatch();

  return (
    <section id="services" className="py-5 bg-secondary bg-opacity-25 position-relative">
      <div className="container-fluid px-lg-5">
        <div className="text-center mb-5">
          <div className="section-badge mb-2 d-inline-flex align-items-center gap-2">
            <Network size={14} className="text-cyan pulse-glow" />
            <span>Services</span>
          </div>
          <h2 className="display-5 font-heading fw-extrabold mb-3">
            Our <span className="text-gradient">services</span>
          </h2>
          <p className="lead text-muted col-lg-7 mx-auto" style={{ fontSize: '1.15rem' }}>
            From FIX engine libraries to certified exchange connections, cloud-native DevSecOps, and mobile trading apps — we power modern financial markets.
          </p>
        </div>

        <div className="row g-4">
          {services.map((srv, idx) => (
            <ServiceCard 
              key={idx} 
              srv={srv} 
              onLearnMore={() => dispatch(openDemoModal())} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
