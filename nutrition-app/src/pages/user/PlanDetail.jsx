import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';

export default function PlanDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Ideally, if state is null (direct link), we would fetch the plan using the ID.
  const plan = state?.plan;
  const nutritionist = state?.nutritionist;

  if (!plan || !nutritionist) {
    return (
      <div className="min-h-screen bg-surface-bright flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="font-headline text-3xl font-black mb-4">Plan Not Found</h1>
          <button onClick={() => navigate('/nutritionists')} className="text-secondary font-bold hover:underline">
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  const fullName = `${nutritionist.first_name} ${nutritionist.last_name}`;

  return (
    <div className="min-h-screen bg-surface-bright font-body text-on-surface pb-32">
      <Navbar />

      <div className="pt-32 px-6 max-w-5xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface-variant/60 hover:text-secondary mb-12 transition-all group w-fit"
        >
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
          <span className="font-bold text-sm tracking-widest uppercase">Back to Profile</span>
        </button>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-[3rem] shadow-2xl border border-surface-container overflow-hidden">
          {/* Left: Image & Quick Info */}
          <div className="bg-surface-container relative">
            {plan.image_data ? (
              <img src={plan.image_data} alt={plan.title} className="w-full h-full object-cover min-h-[400px]" />
            ) : (
              <div className="w-full h-full min-h-[400px] flex items-center justify-center">
                <span className="material-symbols-outlined text-9xl text-on-surface-variant/20">workspace_premium</span>
              </div>
            )}
            <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur rounded-full shadow-sm text-sm font-black uppercase tracking-widest text-primary">
              {plan.duration_weeks} Weeks Program
            </div>
          </div>

          {/* Right: Content & Checkout */}
          <div className="p-10 md:p-12 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <img src={nutritionist.profile?.profile_image || ''} alt={fullName} className="w-8 h-8 rounded-full object-cover bg-surface-container" />
              <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">By {fullName}</span>
            </div>

            <h1 className="font-headline text-4xl font-black mb-6">{plan.title}</h1>
            
            <p className="text-lg text-on-surface-variant mb-8 leading-relaxed whitespace-pre-wrap">
              {plan.description}
            </p>

            <div className="mb-10">
              <h3 className="font-bold text-sm uppercase tracking-widest text-on-surface-variant mb-4 border-b border-surface-container pb-2">Program Includes</h3>
              <ul className="space-y-4">
                {plan.features?.map((f, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-8 border-t border-surface-container">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Investment</p>
                  <span className="text-5xl font-headline font-black">${plan.price}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/dashboard/checkout', { state: {
                  nutritionist_id: nutritionist.id,
                  nutritionist_name: fullName,
                  nutritionist_image: nutritionist.profile?.profile_image,
                  package_type: 'custom',
                  plan_id: plan.id,
                  package_label: plan.title,
                  price: plan.price,
                  features: plan.features,
                }})}
                className="w-full py-5 bg-secondary text-white rounded-2xl font-bold shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-all text-lg flex items-center justify-center gap-3"
              >
                <span>Enroll Now</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <p className="text-center text-xs text-on-surface-variant mt-4 opacity-70">
                Secure payment powered by Stripe. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
