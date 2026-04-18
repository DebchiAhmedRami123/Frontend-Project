import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';
import { createSubscription } from '../../api/subscriptionApi';

// ── Component ──────────────────────────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Package data passed from NutritionistDetail
  const pkg = location.state || {};
  const {
    nutritionist_id,
    nutritionist_name = 'Nutritionist',
    nutritionist_image = null,
    package_type = 'single',
    package_label = 'Single Session',
    plan_id = null,
    price = 0,
    features = [],
  } = pkg;

  // State
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/25');
  const [cvv, setCvv] = useState('123');
  const [cardName, setCardName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [error, setError] = useState('');

  // If no package data, redirect to marketplace
  useEffect(() => {
    if (!nutritionist_id) {
      navigate('/nutritionists');
    }
  }, [nutritionist_id, navigate]);

  const sessionsMap = { single: 1, monthly: 4, quarterly: 12, custom: 'Custom' };
  const durationMap = { single: 'One-time', monthly: '/ month', quarterly: '/ 3 months', custom: 'Plan Duration' };

  const handlePurchase = async () => {
    setProcessing(true);
    setError('');

    try {
      const result = await createSubscription({
        nutritionist_id,
        package_type,
        price,
        plan_id,
      });

      setSubscription(result.subscription);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // ── SUCCESS VIEW ────────────────────────────────────────────────────────────
  if (success && subscription) {
    return (
      <Sidebar>
        <div className="animate-fade-in font-body pb-12">
          <div className="max-w-2xl mx-auto text-center py-16">
            {/* Success Icon */}
            <div className="relative mb-10">
              <div className="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-200/40">
                <span className="material-symbols-outlined text-6xl text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <div className="absolute -top-2 -right-2 left-0 right-0 flex justify-center">
                <div className="w-32 h-32 rounded-full border-2 border-emerald-300/30 animate-ping" style={{ animationDuration: '2s' }} />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-teal-950 tracking-tight mb-4">
              Purchase Successful!
            </h1>
            <p className="text-lg text-slate-500 font-medium mb-12 max-w-md mx-auto">
              Your coaching journey begins now. Here's what happens next:
            </p>

            {/* Order Summary Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-teal-900/5 border border-slate-100 p-8 text-left mb-8">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-lg overflow-hidden">
                  {nutritionist_image ? (
                    <img src={nutritionist_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    nutritionist_name.charAt(0)
                  )}
                </div>
                <div>
                  <p className="font-extrabold text-slate-800 text-lg">{nutritionist_name}</p>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{package_label}</p>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-2xl font-black text-slate-800">${price}</span>
                  <span className="text-xs text-slate-400 block">{durationMap[package_type]}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-b border-slate-100">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sessions</span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {package_type === 'custom' ? 'Custom Program' : `${subscription.sessions_total} sessions included`}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</span>
                  <span className="text-sm font-extrabold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-slate-50 rounded-3xl p-8 text-left mb-10 border border-slate-100">
              <h3 className="font-extrabold text-slate-800 text-lg mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">rocket_launch</span>
                What happens now
              </h3>
              <div className="space-y-5">
                {[
                  { icon: 'calendar_month', label: 'Schedule your first session', desc: 'Head to the booking page to pick a date & time' },
                  { icon: 'chat', label: `${nutritionist_name.split(' ')[0]} will reach out within 24 hours`, desc: 'Check your messages for an introduction' },
                  { icon: 'assignment', label: 'Fill out your intake form', desc: 'Share your goals, restrictions, and health info' },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-emerald-600 text-[20px]">{step.icon}</span>
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 text-sm">{step.label}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard/book')}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-full font-bold text-base hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                Schedule First Session
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-full font-bold text-base hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </Sidebar>
    );
  }

  // ── CHECKOUT VIEW ───────────────────────────────────────────────────────────
  return (
    <Sidebar>
      <div className="animate-fade-in font-body pb-12">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-bold transition-colors w-fit group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back
          </button>

          {/* Header */}
          <header>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-teal-950">Checkout</h1>
            <p className="text-slate-500 font-medium mt-3 text-lg">Complete your purchase to start your coaching journey.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* ── LEFT: Payment Form (3 cols) ── */}
            <div className="lg:col-span-3 space-y-6">

              {/* Demo Notice */}
              <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-5 flex items-start gap-4">
                <span className="material-symbols-outlined text-amber-600 text-[22px] mt-0.5">info</span>
                <div>
                  <p className="font-extrabold text-amber-800 text-sm">Demo Mode — No Real Payment</p>
                  <p className="text-xs text-amber-600 font-medium mt-1">
                    This is a simulated checkout. Card details are pre-filled and no real charge will be made.
                  </p>
                </div>
              </div>

              {/* Payment Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600">credit_card</span>
                  Payment Method
                </h2>

                <div className="space-y-5">
                  {/* Card Number */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:outline-none focus:border-teal-400 transition-all font-mono tracking-wider"
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Expiry Date</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:outline-none focus:border-teal-400 transition-all font-mono"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">CVV</label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:outline-none focus:border-teal-400 transition-all font-mono"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  {/* Name on Card */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Name on Card</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:outline-none focus:border-teal-400 transition-all"
                      placeholder="Full name"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200/60 rounded-2xl p-5 flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-500">error</span>
                  <p className="text-sm font-bold text-red-700">{error}</p>
                </div>
              )}

              {/* Purchase Button */}
              <button
                onClick={handlePurchase}
                disabled={processing}
                className={`w-full py-4 rounded-2xl text-base font-bold transition-all duration-300 flex items-center justify-center gap-3
                  ${processing
                    ? 'bg-slate-200 text-slate-400 cursor-wait'
                    : 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-500/30'
                  }`}
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[22px]">lock</span>
                    Complete Purchase — ${price}
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-400 font-medium">
                <span className="material-symbols-outlined text-[14px] align-text-bottom mr-1">verified_user</span>
                Secure simulated checkout. No real charges.
              </p>
            </div>

            {/* ── RIGHT: Order Summary (2 cols) ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Package Summary */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sticky top-28">
                <h2 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600">receipt_long</span>
                  Order Summary
                </h2>

                {/* Nutritionist */}
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-md overflow-hidden">
                    {nutritionist_image ? (
                      <img src={nutritionist_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      nutritionist_name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-800">{nutritionist_name}</p>
                    <p className="text-xs font-bold text-slate-400">Certified Nutritionist</p>
                  </div>
                </div>

                {/* Package Details */}
                <div className="py-6 border-b border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-600">{package_label}</span>
                    <span className="text-sm font-extrabold text-slate-800">${price}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                    <span className="material-symbols-outlined text-[16px] text-teal-600">event_repeat</span>
                    {package_type === 'custom' ? 'Custom sessions' : `${sessionsMap[package_type]} session${sessionsMap[package_type] > 1 ? 's' : ''} included`}
                  </div>

                  {/* Features */}
                  {features.length > 0 && (
                    <div className="space-y-2 pt-2">
                      {features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <span className="material-symbols-outlined text-teal-500 text-[14px]">check_circle</span>
                          {f}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-6 flex items-center justify-between">
                  <span className="text-base font-extrabold text-slate-800">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-teal-700">${price}</span>
                    <span className="text-xs text-slate-400 block font-bold">{durationMap[package_type]}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
                {[
                  { icon: 'shield', text: '100% Secure Payment' },
                  { icon: 'autorenew', text: 'Cancel anytime' },
                  { icon: 'support_agent', text: '24/7 Support available' },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-500">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">{badge.icon}</span>
                    {badge.text}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </Sidebar>
  );
}
