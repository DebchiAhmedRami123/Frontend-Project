import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';

const CheckoutPlaceholder = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface pb-20">
      <Navbar />
      
      <div className="pt-40 px-6 text-center">
        <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-12 shadow-2xl shadow-primary-container/10 border border-surface-container">
          <div className="w-24 h-24 bg-secondary-fixed/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
            <span className="material-symbols-outlined text-5xl text-on-secondary-container">payments</span>
          </div>
          
          <h1 className="font-headline text-4xl font-black mb-6">Payment System Coming Soon</h1>
          <p className="text-lg text-on-surface-variant mb-10 leading-relaxed">
            We're currently perfecting our secure checkout experience to bring you the best nutritionist packages. 
            Check back soon for precision nutrition coaching and subscription options!
          </p>
          
          <button 
            onClick={() => navigate('/nutritionists')}
            className="px-8 py-4 bg-secondary text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-secondary/20"
          >
            Back to Experts
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPlaceholder;
