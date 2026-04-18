import React from 'react';
import { useNavigate } from 'react-router-dom';

const NutritionistCard = ({ nutritionist }) => {
  const navigate = useNavigate();
  const profile = nutritionist.profile || {};
  const planCount = nutritionist.plan_count || 0;
  const startingPrice = nutritionist.starting_price || profile.price_initial || 0;
  
  const packages = [
    { name: 'Initial', price: profile.price_initial || 0 },
    { name: 'Monthly', price: profile.price_monthly || 0 },
    { name: 'Plans', count: planCount }
  ];

  return (
    <div 
      className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full cursor-pointer"
      onClick={() => navigate(`/nutritionists/${nutritionist.id}`)}
    >
      {/* Header: Photo & Rating */}
      <div className="flex items-start justify-between mb-6">
        <div className="w-20 h-20 rounded-3xl bg-surface-container overflow-hidden border border-surface-container flex items-center justify-center">
          {profile.profile_image ? (
            <img src={profile.profile_image} alt={nutritionist.first_name} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">person</span>
          )}
        </div>
        <div className="text-right">
          <div className="flex gap-0.5 mb-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`material-symbols-outlined text-sm ${i < (profile.rating || 5) ? 'text-amber-400' : 'text-slate-200'}`}>
                star
              </span>
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile.reviewCount || 12}+ REVIEWS</span>
        </div>
      </div>

      {/* Info */}
      <div className="mb-6 flex-grow">
        <h3 className="font-headline text-xl font-black text-slate-900 group-hover:text-secondary transition-colors truncate">
          {profile.title || 'Nutritionist'} {nutritionist.first_name} {nutritionist.last_name}
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="bg-secondary-fixed/20 text-on-secondary-container text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
            {profile.specialization || 'Clinical Nutrition'}
          </span>
          <span className="bg-slate-50 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
            {profile.years_of_experience || '5'}+ EXP
          </span>
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-2 mb-8 bg-slate-50 p-4 rounded-3xl items-center">
        <div className="text-center group-hover:scale-105 transition-transform">
          <span className="text-[10px] font-bold text-slate-400 block truncate">Initial Session</span>
          <span className="font-headline font-black text-slate-900">${profile.price_initial || '--'}</span>
        </div>
        <div className="text-center border-l border-slate-200 group-hover:scale-105 transition-transform">
          <span className="text-[10px] font-bold text-slate-400 block truncate">Follow-up</span>
          <span className="font-headline font-black text-secondary">${profile.price_followup || '--'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => navigate(`/nutritionists/${nutritionist.id}`)}
          className="py-3 px-4 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
        >
          View Profile
        </button>
        <button 
          onClick={() => navigate(`/nutritionists/${nutritionist.id}`, { state: { scrollTo: 'packages' } })}
          className="py-3 px-4 bg-secondary text-white rounded-2xl text-xs font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/10"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default NutritionistCard;
