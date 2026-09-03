import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import HeroVideoSection from './components/HeroVideoSection';
import MarketTicker from './components/MarketTicker';
import ClientsSection from './components/ClientsSection';
import AdvancedOmsFeatures from './components/AdvancedOmsFeatures';
import TradingTerminalPreview from './components/TradingTerminalPreview';
import ProductsSection from './components/ProductsSection';
import ConsultancyCustomizationSection from './components/ConsultancyCustomizationSection';
import ServicesSection from './components/ServicesSection';
import FixProtocolMonitor from './components/FixProtocolMonitor';
import RoiCalculator from './components/RoiCalculator';
import NewsEventsSection from './components/NewsEventsSection';
import CertificationsAccreditation from './components/CertificationsAccreditation';
import ContactDemoModal from './components/ContactDemoModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Footer from './components/Footer';

export default function App() {
  const themeMode = useSelector((state) => state.theme.mode);

  // Synchronize document theme attribute with Redux state
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    document.body.className = themeMode;
  }, [themeMode]);

  return (
    <div className="quant-app min-vh-100 d-flex flex-column">
      <Navbar />
      <main className="flex-grow-1">
        <HeroVideoSection />
        <MarketTicker />
        <ClientsSection />
        <AdvancedOmsFeatures />
        <TradingTerminalPreview />
        <ProductsSection />
        <ConsultancyCustomizationSection />
        <ServicesSection />
        <FixProtocolMonitor />
        <RoiCalculator />
        <NewsEventsSection />
        <CertificationsAccreditation />
      </main>
      <ContactDemoModal />
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}
