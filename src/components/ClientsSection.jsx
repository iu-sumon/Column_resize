import React from 'react';
import { Building2, Award, CheckCircle } from 'lucide-react';

const clientLogos = [
  { name: 'Chittagong Stock Exchange (CSE)', logo: 'assets/images/clients/cse_logo.png', tag: 'Exchange Partner' },
  { name: 'ICB Securities Trading Rights', logo: 'assets/images/clients/icb-securities.png', tag: 'Institutional Brokerage' },
  { name: 'Royal Capital Limited', logo: 'assets/images/clients/royal-capital-logo.png', tag: 'Premier Brokerage' },
  { name: 'United Financial Trading Co. (UFTCL)', logo: 'assets/images/clients/uftcl-logo.png', tag: 'OMS Client' },
  { name: 'Prime Securities Limited', logo: 'assets/images/clients/prime-securities-ltd-logo.png', tag: 'Capital Markets' },
  { name: 'Sheltech Brokerage Limited', logo: 'assets/images/clients/sheltech-brokerage-logo.png', tag: 'OMS & BO Client' },
  { name: 'CAL Bangladesh', logo: 'assets/images/clients/cal-bangladesh-logo.png', tag: 'Investment Banking' },
  { name: 'NBL Securities Limited', logo: 'assets/images/clients/NBSL-logo.png', tag: 'Bank Securities' },
  { name: 'NRBC Bank Securities', logo: 'assets/images/clients/NRBC-securities.png', tag: 'Bank Securities' },
  { name: 'MTB Securities PLC', logo: 'assets/images/clients/MTB-securities-plc.png', tag: 'Bank Securities' },
  { name: 'Pubali Bank Securities', logo: 'assets/images/clients/pubali-bank-securities.png', tag: 'Bank Securities' },
  { name: 'Midway Securities Limited', logo: 'assets/images/clients/miday-securities-logo.png', tag: 'High-Frequency Trader' }
];

export default function ClientsSection() {
  return (
    <section id="clients" className="py-5 bg-secondary bg-opacity-25">
      <div className="container-fluid px-lg-5">
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="section-badge mb-2">
            <Building2 size={14} />
            <span>Trusted Industry Leaders</span>
          </div>
          <h2 className="display-5 font-heading fw-bold">
            Empowering Leading <span className="text-gradient">Financial Institutions</span>
          </h2>
          <p className="text-muted col-lg-6 mx-auto">
            Quant Fintech powers the order management, FIX routing, and back-office operations of top stock exchanges, bank brokerages, and institutional trading houses.
          </p>
        </div>

        {/* Client Grid Cards */}
        <div className="row g-3">
          {clientLogos.map((client, idx) => (
            <div key={idx} className="col-6 col-sm-4 col-md-3 col-lg-2">
              <div className="glass-card p-3 h-100 text-center d-flex flex-column align-items-center justify-content-center hover-cyan">
                <div className="mb-2 p-2 rounded-3 bg-tertiary w-100 d-flex align-items-center justify-content-center" style={{ height: '70px' }}>
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-100 max-w-100 object-fit-contain opacity-85"
                    style={{ maxHeight: '50px', maxWidth: '80%' }}
                    onError={(e) => {
                      // Fallback text badge if image asset missing
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = `<span class="fw-bold font-mono text-cyan" style="font-size:0.8rem">${client.name}</span>`;
                    }}
                  />
                </div>
                <span className="fw-semibold small text-main d-block lh-sm mb-1">{client.name}</span>
                <span className="badge bg-tertiary font-mono text-dim" style={{ fontSize: '0.65rem' }}>{client.tag}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial / SLA Banner */}
        <div className="mt-5 glass-panel p-4 text-center col-lg-10 mx-auto border-highlight">
          <div className="d-flex flex-wrap align-items-center justify-content-around gap-4">
            <div className="d-flex align-items-center gap-3 text-start">
              <Award className="text-cyan" size={36} />
              <div>
                <span className="fw-bold fs-5 text-main font-heading d-block">Sub-Millisecond OMS Guarantee</span>
                <span className="text-muted small">99.999% SLA Uptime with redundant failover gateways</span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 text-start">
              <CheckCircle className="text-emerald" size={36} />
              <div>
                <span className="fw-bold fs-5 text-main font-heading d-block">Regulatory Compliance</span>
                <span className="text-muted small">Fully compliant with BSEC, DSE, CSE, and CDBL protocols</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
