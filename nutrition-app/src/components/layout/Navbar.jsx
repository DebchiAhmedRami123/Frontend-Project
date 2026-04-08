import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboardClick = () => {
    if (role === 'admin') navigate('/admin/stats');
    else if (role === 'nutritionist') navigate('/nutritionist/clients');
    else navigate('/dashboard');
  };

  const getLinkClass = (path, isHash = false) => {
    const isActive = isHash 
      ? location.pathname === '/' 
      : location.pathname === path;
    
    return `font-headline tracking-tight font-semibold transition-all duration-300 ${
      isActive 
        ? 'text-teal-950 border-b-2 border-teal-500 pb-1' 
        : 'text-teal-800/60 hover:text-teal-950'
    }`;
  };
  
  return (
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 flex justify-between items-center px-8 py-4 bg-white/70 backdrop-blur-2xl rounded-full mt-6 shadow-2xl shadow-teal-900/10">
      <div 
        onClick={() => navigate('/')} 
        className="text-2xl font-black tracking-tighter text-teal-950 cursor-pointer hover:opacity-80 transition-opacity"
      >
        CaloAI
      </div>

      <div className="hidden md:flex gap-8 items-center">
        {/* Features Link - Active on Homepage */}
        <a className={getLinkClass('/', true)} href="/#features">
          Features
        </a>

        {/* For Professionals Link - Active on /apply-nutritionist */}
        <a 
          className={getLinkClass('/apply-nutritionist')} 
          href="/apply-nutritionist"
          onClick={(e) => { e.preventDefault(); navigate('/apply-nutritionist'); }}
        >
          For Professionals
        </a>
        <a className={getLinkClass('/pricing')} href="/#pricing">
          Pricing
        </a>
        <a className={getLinkClass('/testimonials')} href="/#testimonials">
          Testimonials
        </a>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <button 
              onClick={handleLogout} 
              className="text-teal-900/60 hover:text-red-500 font-headline font-bold transition-all duration-300 px-2"
              title="Logout"
            >
              Logout
            </button>
            <button 
              onClick={handleDashboardClick} 
              className="bg-gradient-to-r from-secondary to-secondary-fixed-dim text-white px-6 py-2.5 rounded-full font-headline font-bold transition-all duration-300 hover:scale-105"
            >
              Dashboard
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} className="flex items-center justify-center group" title="Login">
              <span className="material-symbols-outlined text-teal-950 cursor-pointer group-hover:scale-110 transition-transform">person</span>
            </button>
            <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-secondary to-secondary-fixed-dim text-white px-6 py-2.5 rounded-full font-headline font-bold transition-all duration-300 hover:scale-105">
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
