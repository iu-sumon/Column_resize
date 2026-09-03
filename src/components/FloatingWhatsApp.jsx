import React, { useState } from 'react';

export default function FloatingWhatsApp() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="position-fixed"
      style={{
        bottom: '28px',
        right: '28px',
        zIndex: 9999
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Interactive Floating Tooltip Pill */}
      <div
        className={`position-absolute bottom-100 end-0 mb-2 px-3 py-1 rounded-pill glass-panel font-mono text-nowrap shadow-lg transition-all ${
          isHovered ? 'opacity-100 translate-y-0 pe-auto' : 'opacity-0 translate-y-1 pe-none'
        }`}
        style={{
          fontSize: '0.78rem',
          color: '#ffffff',
          background: 'rgba(10, 15, 26, 0.92)',
          border: '1px solid rgba(37, 211, 102, 0.4)',
          transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <span className="text-emerald fw-bold me-1">● Live:</span> Chat with Quant Fintech
      </div>

      {/* Pulsing Green Wave Ring */}
      <span
        className="position-absolute top-50 start-50 translate-middle rounded-circle pe-none"
        style={{
          width: '68px',
          height: '68px',
          background: 'rgba(37, 211, 102, 0.3)',
          animation: 'pulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          zIndex: 1
        }}
      />

      {/* Main WhatsApp Floating Action Button */}
      <a
        href="https://wa.me/8801711229800?text=Hello%2C%20I%20want%20to%20know%20more%20about%20Quant%20Fintech%20solutions"
        target="_blank"
        rel="noopener noreferrer"
        className="position-relative d-flex align-items-center justify-content-center text-white shadow-lg text-decoration-none transition-all"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2fe675 0%, #25d366 50%, #1da851 100%)',
          boxShadow: isHovered
            ? '0 10px 28px rgba(37, 211, 102, 0.65), 0 0 15px rgba(37, 211, 102, 0.4)'
            : '0 6px 20px rgba(37, 211, 102, 0.45)',
          transform: isHovered ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 2,
          cursor: 'pointer'
        }}
        title="Chat on WhatsApp (+88 01711229800)"
        aria-label="Chat on WhatsApp with Quant Fintech Limited"
      >
        {/* Official WhatsApp Vector SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="#ffffff"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))' }}
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.877-2.056-.977-.276-.1-.477-.15-.678.15-.2.301-.778.977-.954 1.178-.175.201-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.3-.501.1-.2.05-.376-.025-.526-.075-.15-.678-1.635-.93-2.241-.244-.589-.493-.509-.678-.519l-.578-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.229 3.11.15.201 2.122 3.24 5.141 4.544.718.31 1.279.495 1.716.634.721.229 1.377.197 1.895.12.577-.087 1.78-.727 2.031-1.43.251-.702.251-1.304.176-1.43-.076-.125-.276-.201-.577-.351zM12.04 21.785h-.002c-1.737 0-3.441-.466-4.933-1.353l-.354-.21-3.668.962.979-3.576-.23-.367A9.78 9.78 0 0 1 2.25 12.04c0-5.4 4.393-9.793 9.795-9.793 2.615 0 5.074 1.018 6.924 2.87 1.85 1.85 2.868 4.31 2.868 6.928 0 5.4-4.393 9.794-9.797 9.794zM12.04 0C5.397 0 0 5.397 0 12.04c0 2.12.553 4.19 1.604 6.012L0 24l6.11-1.603A12.008 12.008 0 0 0 12.04 24c6.643 0 12.04-5.397 12.04-12.04C24.08 5.397 18.683 0 12.04 0z" />
        </svg>

        {/* Small Active Online Indicator Dot */}
        <span
          className="position-absolute bg-white rounded-circle shadow-sm"
          style={{
            width: '10px',
            height: '10px',
            top: '3px',
            right: '3px',
            border: '2px solid #25d366'
          }}
        />
      </a>
    </div>
  );
}
