import React from 'react';

const ApplicationDetailDrawer = ({ application, onClose, onApprove, onReject, processing }) => {
  if (!application) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white z-50 shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900">Application Review</h2>
            <p className="text-xs text-slate-400 mt-1">Full clinical credentials</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors">
            <span className="material-symbols-outlined text-slate-500">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-8 space-y-8">
          {/* Applicant header */}
          <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700 font-black text-xl shadow-sm">
              {application.user?.first_name?.[0]}{application.user?.last_name?.[0]}
            </div>
            <div>
              <p className="font-black text-slate-900 text-lg">{application.title} {application.user?.first_name} {application.user?.last_name}</p>
              <p className="text-sm text-slate-500">{application.user?.email}</p>
              <span className={`inline-flex mt-1 items-center rounded-full px-2 py-0.5 text-[10px] font-black ring-1 ring-inset ${
                application.status === 'pending' ? 'bg-amber-50 text-amber-700 ring-amber-500/10' :
                application.status === 'active' ? 'bg-emerald-50 text-emerald-700 ring-emerald-500/10' :
                'bg-rose-50 text-rose-700 ring-rose-500/10'
              }`}>
                {application.status?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Professional Details */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Professional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Detail label="Specialization" value={application.specialization} />
              <Detail label="Experience" value={`${application.years_of_experience || '—'} years`} />
              <Detail label="Education" value={application.education} span={2} />
              <Detail label="License Number" value={application.license_number || 'Not provided'} monospace />
              <Detail label="Certifications" value={application.certifications || 'None listed'} />
            </div>
          </section>

          {/* Bio */}
          {application.bio && (
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Bio / Philosophy</h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl">
                {application.bio}
              </p>
            </section>
          )}

          {/* Pricing */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Service Pricing</h3>
            <div className="grid grid-cols-3 gap-3">
              <PriceBox label="Initial (60m)" amount={application.price_initial} />
              <PriceBox label="Follow-up (30m)" amount={application.price_followup} />
              <PriceBox label="Monthly Plan" amount={application.price_monthly} />
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 flex gap-3">
          <button
            disabled={processing}
            onClick={() => onApprove(application.id)}
            className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all disabled:opacity-50"
          >
            {processing ? '...' : '✓ Approve'}
          </button>
          <button
            disabled={processing}
            onClick={() => onReject(application.id)}
            className="flex-1 py-4 bg-white border-2 border-rose-100 text-rose-600 rounded-2xl font-black text-sm hover:bg-rose-50 transition-all disabled:opacity-50"
          >
            {processing ? '...' : '✕ Reject'}
          </button>
        </div>
      </div>
    </>
  );
};

const Detail = ({ label, value, span = 1, monospace = false }) => (
  <div className={span === 2 ? 'col-span-2' : ''}>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-sm font-bold text-slate-700 ${monospace ? 'font-mono' : ''}`}>{value || '—'}</p>
  </div>
);

const PriceBox = ({ label, amount }) => (
  <div className="bg-slate-50 rounded-2xl p-4 text-center">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xl font-black text-slate-900">${amount || 0}</p>
  </div>
);

export default ApplicationDetailDrawer;
