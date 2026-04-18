import React from 'react';

const CheckAvailabilityModal = ({ isOpen, onClose, nutritionistName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-surface-container/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-3xl border border-surface-container animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-on-surface-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h3 className="font-headline text-2xl font-black mb-2">Check Availability</h3>
        <p className="text-on-surface-variant mb-8 font-body">
          Select a preferred date to book with <span className="text-secondary font-bold">{nutritionistName}</span>.
        </p>

        {/* Static Calendar Placeholder */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 border border-surface-container mb-8">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold font-headline">October 2026</span>
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-sm cursor-pointer">chevron_left</span>
              <span className="material-symbols-outlined text-sm cursor-pointer">chevron_right</span>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-on-surface-variant/40 mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {[...Array(31)].map((_, i) => (
              <div 
                key={i} 
                className={`aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all cursor-pointer
                  ${i === 14 ? 'bg-secondary text-white shadow-lg' : 'hover:bg-surface-container-high'}`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-secondary text-white rounded-2xl font-bold transition-all hover:scale-[1.02]"
        >
          Confirm Availability
        </button>
      </div>
    </div>
  );
};

export default CheckAvailabilityModal;
