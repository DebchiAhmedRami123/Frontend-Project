import React from 'react';

const CardSkeleton = () => (
  <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 animate-pulse">
    <div className="flex items-start justify-between mb-6">
      <div className="w-20 h-20 rounded-3xl bg-slate-100" />
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-4 h-4 bg-slate-100 rounded-full" />
        ))}
      </div>
    </div>
    <div className="h-6 bg-slate-100 rounded-lg w-3/4 mb-4" />
    <div className="h-4 bg-slate-50 rounded-lg w-1/2 mb-6" />
    <div className="h-4 bg-slate-50 rounded-lg w-full mb-2" />
    <div className="h-4 bg-slate-50 rounded-lg w-full mb-8" />
    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
      <div className="w-20 h-8 bg-slate-50 rounded-lg" />
      <div className="w-32 h-12 bg-slate-100 rounded-2xl" />
    </div>
  </div>
);

const DetailSkeleton = () => (
  <div className="min-h-screen bg-surface-bright animate-pulse">
    <div className="pt-32 px-6 max-w-7xl mx-auto">
      <div className="w-24 h-6 bg-slate-100 rounded mb-8" />
      
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <div className="aspect-[4/5] bg-slate-100 rounded-[3rem]" />
        <div className="py-6">
          <div className="h-10 bg-slate-100 rounded-xl w-3/4 mb-6" />
          <div className="h-6 bg-slate-50 rounded-lg w-1/2 mb-8" />
          <div className="flex gap-4 mb-10">
            {[1, 2, 3].map(i => <div key={i} className="w-24 h-8 bg-slate-50 rounded-full" />)}
          </div>
          <div className="h-32 bg-slate-50 rounded-2xl w-full" />
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-[2.5rem] border border-slate-100" />)}
      </div>
    </div>
  </div>
);

export { CardSkeleton, DetailSkeleton };
