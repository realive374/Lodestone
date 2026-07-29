import React, { useState } from 'react';
import { X, Lock, Check } from 'lucide-react';
import { COUNTRIES, CARD_TYPES } from '@/lib/lodestone-data';

export default function PaymentModal({ model, onClose, onPay }) {
  const [formData, setFormData] = useState({
    cardType: 'visa',
    cardNumber: '',
    cvc: '',
    expirationMonth: '',
    expirationYear: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    country: 'United States',
    state: '',
    city: '',
    zip: '',
    phone: '',
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      onPay(model.id);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {success ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Payment Successful!</h2>
            <p className="text-sm text-slate-500">
              {model.displayName} is now unlocked. Enjoy your enhanced Lodestone experience.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Upgrade to {model.displayName}</h2>
                <p className="text-sm text-slate-500">
                  {model.priceLabel} {model.period} • {model.description}
                </p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Card type with logos */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Card Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {CARD_TYPES.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => handleChange('cardType', card.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${
                        formData.cardType === card.id
                          ? 'border-slate-800 bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <CardLogo type={card.id} />
                      <span className="text-[10px] mt-1 text-slate-500">{card.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.cardNumber}
                    onChange={(e) => handleChange('cardNumber', formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-sm pr-12"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CardLogo type={formData.cardType} small />
                  </div>
                </div>
              </div>

              {/* CVC & Expiration */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">CVC</label>
                  <input
                    type="text"
                    required
                    value={formData.cvc}
                    onChange={(e) => handleChange('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Exp. Month</label>
                  <select
                    required
                    value={formData.expirationMonth}
                    onChange={(e) => handleChange('expirationMonth', e.target.value)}
                    className="w-full px-2 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-sm bg-white"
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={String(i + 1).padStart(2, '0')}>
                        {String(i + 1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Exp. Year</label>
                  <select
                    required
                    value={formData.expirationYear}
                    onChange={(e) => handleChange('expirationYear', e.target.value)}
                    className="w-full px-2 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-sm bg-white"
                  >
                    <option value="">YYYY</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i} value={String(2026 + i)}>{2026 + i}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-sm"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Billing Address 1</label>
                <input
                  type="text"
                  required
                  value={formData.address1}
                  onChange={(e) => handleChange('address1', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Billing Address 2</label>
                <input
                  type="text"
                  value={formData.address2}
                  onChange={(e) => handleChange('address2', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-sm"
                />
              </div>

              {/* Country, State, City */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Country</label>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className="w-full px-2 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-sm bg-white"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">State / Province</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-sm"
                  />
                </div>
              </div>

              {/* City, Zip, Phone */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Zip / Postal</label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => handleChange('zip', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 text-sm"
                  />
                </div>
              </div>

              {/* Pay button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-3 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                style={{
                  background: `linear-gradient(135deg, ${model.accent}, ${model.accent}dd)`,
                }}
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay {model.priceLabel} {model.period}
                  </>
                )}
              </button>

              <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Secure payment • Your information is encrypted
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function CardLogo({ type, small }) {
  const size = small ? 'w-7 h-5' : 'w-10 h-7';
  if (type === 'visa') {
    return (
      <div className={`${size} rounded bg-[#1A1F71] flex items-center justify-center`}>
        <span className="text-white font-bold text-[10px] italic">VISA</span>
      </div>
    );
  }
  if (type === 'mastercard') {
    return (
      <div className={`${size} rounded bg-white border border-slate-200 flex items-center justify-center`}>
        <div className="relative w-6 h-4">
          <div className="absolute left-0 top-0 w-3 h-3 rounded-full bg-[#EB001B]" />
          <div className="absolute right-0 top-0 w-3 h-3 rounded-full bg-[#FF5F00] opacity-90" />
        </div>
      </div>
    );
  }
  if (type === 'amex') {
    return (
      <div className={`${size} rounded bg-[#006FCF] flex items-center justify-center`}>
        <span className="text-white font-bold text-[8px]">AMEX</span>
      </div>
    );
  }
  if (type === 'discover') {
    return (
      <div className={`${size} rounded bg-[#FF6000] flex items-center justify-center`}>
        <span className="text-white font-bold text-[8px]">DISC</span>
      </div>
    );
  }
  return null;
}