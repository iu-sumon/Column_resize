import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openDemoModal } from '../store/terminalSlice';
import { ShieldCheck, Cpu, ArrowRight, Play, Pause, Volume2, VolumeX, Server, BarChart3, Radio, Tv, Maximize2, X, TrendingUp } from 'lucide-react';

export default function HeroVideoSection() {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Toggle Video Play/Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle Video Mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Animated Candlestick Chart & Particle Matrix Canvas Overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#00e5ff' : '#10b981'
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Connecting Particle Matrix
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.22 * (1 - dist / 120)})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.width) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="home" className="position-relative overflow-hidden min-vh-100 d-flex align-items-center py-5">
      {/* High-Definition Market Economy Trading Graph Background Video (Pixabay ID: 122881) */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
        style={{
          opacity: 0.9,
          zIndex: 0
        }}
      >
        <source src="/market-economy-trading-graph.mp4" type="video/mp4" />
        <source src="https://cdn.pixabay.com/video/2022/07/02/122881-726547787_large.mp4" type="video/mp4" />
        <source src="https://cdn.pixabay.com/video/2022/07/02/122881-726547787_medium.mp4" type="video/mp4" />
      </video>

      {/* Ambient Particle Matrix Overlay */}
      <canvas ref={canvasRef} className="video-overlay-canvas" style={{ zIndex: 1 }} />

      {/* Subtle Dark Vignette Overlay for Crisp Text Legibility */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(7,9,14,0.6) 0%, rgba(7,9,14,0.3) 50%, var(--bg-primary) 98%)',
          zIndex: 1
        }}
      />

      <div className="container position-relative py-5" style={{ zIndex: 2 }}>
        <div className="row align-items-center gy-5">
          {/* Left Column: Transforming Financial Markets Copy */}
          <div className="col-lg-7 text-center text-lg-start">
            <div className="section-badge mb-3 shadow-sm">
              <Radio size={14} className="text-up pulse-glow" />
              <span>Next-Gen OMS & FIX Gateway Technology</span>
            </div>

            <h1
              className="display-3 font-heading fw-extrabold tracking-tight mb-3 hero-title"
              style={{ lineHeight: 1.15, color: 'var(--text-main)', textShadow: '0 4px 15px rgba(0,0,0,0.85)' }}
            >
              Transforming <br />
              <span className="text-gradient">Financial Markets</span>
            </h1>

            <p
              className="lead text-muted mb-4 pe-lg-4 hero-subtitle"
              style={{ fontSize: '1.2rem', fontWeight: 400, textShadow: '0 2px 10px rgba(0,0,0,0.85)' }}
            >
              Bridging the gap between high-frequency finance & modern technology. Quant Fintech delivers sub-millisecond Order Management Systems (OMS), certified FIX protocols, and DevSecOps for capital market institutions worldwide.
            </p>

            {/* CTAs with Video Trigger */}
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-3 mb-5">
              <a href="#terminal" className="btn btn-quant-primary btn-lg d-flex align-items-center gap-2 shadow-lg">
                <span>Explore Live OMS Terminal</span>
                <ArrowRight size={20} />
              </a>

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="btn btn-quant-outline btn-lg d-flex align-items-center gap-2 glass-panel shadow-lg"
              >
                <Play size={18} fill="currentColor" className="text-cyan pulse-glow" />
                <span>Watch Trading Graph Video</span>
              </button>
            </div>

            {/* Background Video Control Strip */}
            <div className="d-inline-flex align-items-center gap-3 px-3 py-2 rounded-pill glass-panel mb-4 shadow-sm">
              <span className="font-mono text-dim small">TRADING GRAPH VIDEO:</span>
              <button
                onClick={togglePlay}
                className="btn btn-sm glass-card px-3 py-1 text-main font-mono d-flex align-items-center gap-1"
                style={{ fontSize: '0.8rem' }}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? 'Pause Video' : 'Play Video'}</span>
              </button>

              <button
                onClick={toggleMute}
                className="btn btn-sm glass-card px-3 py-1 text-main font-mono d-flex align-items-center gap-1"
                style={{ fontSize: '0.8rem' }}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{isMuted ? 'Muted' : 'Sound On'}</span>
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-4 pt-3 border-top border-secondary border-opacity-25">
              <div className="d-flex align-items-center gap-2">
                <ShieldCheck className="text-emerald" size={20} />
                <span className="small fw-semibold text-muted">Secured by DevSecOps</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Cpu className="text-cyan" size={20} />
                <span className="small fw-semibold text-muted">Sub-Millisecond Engine</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Server className="text-primary" size={20} />
                <span className="small fw-semibold text-muted">DSE & CSE Certified</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Trading Feed & Metrics Panel */}
          <div className="col-lg-5">
            <div className="glass-panel p-4 position-relative border-highlight shadow-lg">
              <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-secondary border-opacity-25">
                <div className="d-flex align-items-center gap-2">
                  <BarChart3 className="text-cyan" size={22} />
                  <span className="fw-bold font-heading">qTrader OMS v4.8</span>
                </div>
                <span className="badge bg-up font-mono px-3 py-2 rounded-pill">ONLINE 99.999%</span>
              </div>

              {/* qTrader OMS Dashboard Screenshot */}
              <div className="position-relative overflow-hidden rounded-3 border border-secondary border-opacity-25 mb-4 shadow-sm" style={{ height: '260px' }}>
                <img
                  src="/qtrader-oms-dashboard.jpg"
                  alt="qTrader OMS Institutional Trading Dashboard — Real-time Charts, Order Book, Watchlist & Trade Execution"
                  className="w-100 h-100 object-fit-cover"
                  style={{ objectPosition: 'top center' }}
                />

                {/* Top Overlay Badge */}
                <div className="position-absolute top-0 start-0 w-100 p-2 d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <span className="spinner-grow spinner-grow-sm text-success" role="status" style={{ width: '8px', height: '8px' }}></span>
                    <span className="badge bg-success font-mono" style={{ fontSize: '0.65rem' }}>LIVE OMS INTERFACE</span>
                  </div>
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="btn btn-sm glass-card p-1 text-white border-0"
                    title="View Fullscreen"
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>

                {/* Bottom Info Bar */}
                <div className="position-absolute bottom-0 start-0 w-100 p-2 d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 100%)' }}>
                  <span className="font-mono text-cyan" style={{ fontSize: '0.75rem' }}>qTrader OMS — DSE/CSE CONNECTED</span>
                  <span className="font-mono text-up" style={{ fontSize: '0.75rem' }}>420 μs LATENCY</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="row g-2">
                <div className="col-6">
                  <div className="glass-card p-2 text-center rounded-3">
                    <span className="text-dim font-mono small d-block" style={{ fontSize: '0.75rem' }}>AVG FIX LATENCY</span>
                    <span className="font-mono text-up fw-bold fs-5">420 μs</span>
                  </div>
                </div>

                <div className="col-6">
                  <div className="glass-card p-2 text-center rounded-3">
                    <span className="text-dim font-mono small d-block" style={{ fontSize: '0.75rem' }}>THROUGHPUT</span>
                    <span className="font-mono text-cyan fw-bold fs-5">150K msg/s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Video Modal Showcase */}
      {isVideoModalOpen && (
        <div
          className="modal d-block position-fixed top-0 start-0 w-100 h-100 z-3"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content glass-panel border-highlight p-3 shadow-lg">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <Tv className="text-cyan pulse-glow" size={22} />
                  <h5 className="font-heading fw-bold text-main mb-0">Market Economy Trading Graph Showcase</h5>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="btn glass-card p-2 rounded-circle text-main"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Video Showcase Frame */}
              <div className="ratio ratio-16x9 rounded-3 overflow-hidden border border-secondary border-opacity-25">
                <video controls autoPlay className="w-100 h-100 object-fit-cover">
                  <source src="/market-economy-trading-graph.mp4" type="video/mp4" />
                  <source src="https://cdn.pixabay.com/video/2022/07/02/122881-726547787_large.mp4" type="video/mp4" />
                  <source src="https://cdn.pixabay.com/video/2022/07/02/122881-726547787_medium.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary border-opacity-25">
                <span className="font-mono text-dim small">Market Economy Stock Chart & Candlestick Graph Video</span>
                <button
                  onClick={() => {
                    setIsVideoModalOpen(false);
                    dispatch(openDemoModal());
                  }}
                  className="btn btn-quant-primary btn-sm d-flex align-items-center gap-2"
                >
                  <span>Schedule Platform Demo</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
