import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeDemoModal, showToast, clearToast } from '../store/terminalSlice';
import { X, Send, CheckCircle2, ShieldCheck, Mail, Phone, User, Building, MessageSquare } from 'lucide-react';

export default function ContactDemoModal() {
  const dispatch = useDispatch();
  const isDemoModalOpen = useSelector((state) => state.terminal.isDemoModalOpen);
  const selectedProduct = useSelector((state) => state.terminal.selectedProduct);
  const toastNotification = useSelector((state) => state.terminal.toastNotification);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    product: selectedProduct ? selectedProduct.name : 'qTrader OMS',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(closeDemoModal());
    dispatch(
      showToast({
        title: 'Demo Request Received!',
        message: `Thank you ${formData.name}. Our Fintech Solutions team will contact ${formData.email} within 2 hours.`,
        type: 'success'
      })
    );
    setFormData({ name: '', email: '', company: '', phone: '', product: 'qTrader OMS', message: '' });
  };

  return (
    <>
      {/* Toast Notification Container */}
      {toastNotification && (
        <div className="position-fixed bottom-0 end-0 p-4 z-3" style={{ maxWidth: '420px' }}>
          <div className="glass-panel p-3 border-highlight shadow-lg d-flex align-items-start gap-3">
            <CheckCircle2 size={24} className="text-emerald flex-shrink-0 mt-1" />
            <div className="flex-grow-1">
              <h6 className="fw-bold mb-1 text-main font-heading">{toastNotification.title}</h6>
              <p className="small text-muted mb-0 font-mono" style={{ fontSize: '0.85rem' }}>
                {toastNotification.message}
              </p>
            </div>
            <button
              onClick={() => dispatch(clearToast())}
              className="btn btn-sm p-0 text-muted"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Schedule Demo Modal */}
      {isDemoModalOpen && (
        <div
          className="modal d-block position-fixed top-0 start-0 w-100 h-100 z-3"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content glass-panel border-highlight p-4 text-main shadow-lg">
              {/* Modal Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                <div>
                  <h4 className="font-heading fw-bold mb-1">
                    Schedule <span className="text-gradient">Platform Demo</span>
                  </h4>
                  <span className="text-muted small">
                    Explore sub-millisecond OMS routing & FIX protocol integration with Quant Fintech engineers.
                  </span>
                </div>
                <button
                  onClick={() => dispatch(closeDemoModal())}
                  className="btn glass-card p-2 rounded-circle text-main"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label font-mono small text-dim">FULL NAME *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-tertiary border-secondary border-opacity-25 text-dim">
                        <User size={18} />
                      </span>
                      <input
                        type="text"
                        className="form-control bg-tertiary text-main border-secondary border-opacity-25"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label font-mono small text-dim">WORK EMAIL *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-tertiary border-secondary border-opacity-25 text-dim">
                        <Mail size={18} />
                      </span>
                      <input
                        type="email"
                        className="form-control bg-tertiary text-main border-secondary border-opacity-25"
                        placeholder="john@brokerage.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label font-mono small text-dim">COMPANY / BROKERAGE NAME *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-tertiary border-secondary border-opacity-25 text-dim">
                        <Building size={18} />
                      </span>
                      <input
                        type="text"
                        className="form-control bg-tertiary text-main border-secondary border-opacity-25"
                        placeholder="Capital Securities Ltd."
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label font-mono small text-dim">PHONE NUMBER</label>
                    <div className="input-group">
                      <span className="input-group-text bg-tertiary border-secondary border-opacity-25 text-dim">
                        <Phone size={18} />
                      </span>
                      <input
                        type="tel"
                        className="form-control bg-tertiary text-main border-secondary border-opacity-25"
                        placeholder="+880 1700-000000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label font-mono small text-dim">PRODUCT OF INTEREST</label>
                    <select
                      className="form-select bg-tertiary text-main border-secondary border-opacity-25"
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    >
                      <option value="qTrader OMS">qTrader — High Speed OMS</option>
                      <option value="OCS OEMF">OCS — Order Execution Framework</option>
                      <option value="qWeb CRM">qWeb — Brokerage CRM</option>
                      <option value="qOffice Back Office">qOffice — Back Office & CDBL Clearing</option>
                      <option value="qRMS Risk Management">qRMS — Real-Time Risk Engine</option>
                      <option value="Online BO Account">Online BO — Onboarding Portal</option>
                      <option value="FIX Protocol Integration">FIX Protocol Gateway Services</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label font-mono small text-dim">REQUIREMENTS / MESSAGE</label>
                    <textarea
                      className="form-control bg-tertiary text-main border-secondary border-opacity-25"
                      rows="3"
                      placeholder="Describe your current trading infrastructure, exchange requirements, or daily order volume..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-3 pt-3 border-top border-secondary border-opacity-25">
                  <button
                    type="button"
                    onClick={() => dispatch(closeDemoModal())}
                    className="btn btn-quant-outline"
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-quant-primary d-flex align-items-center gap-2">
                    <Send size={18} />
                    <span>Submit Demo Request</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
