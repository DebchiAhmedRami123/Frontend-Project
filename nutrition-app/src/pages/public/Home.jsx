import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';


const Navbar = () => {
  const navigate = useNavigate();
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
  
  return (
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 flex justify-between items-center px-8 py-4 bg-white/70 backdrop-blur-2xl rounded-full mt-6 shadow-2xl shadow-teal-900/10">
      <div className="text-2xl font-black tracking-tighter text-teal-950">NutriTrack</div>

      <div className="hidden md:flex gap-8 items-center">
        {/* Active Link (Features) */}
        <a className="font-headline tracking-tight font-semibold text-teal-950 border-b-2 border-teal-500 pb-1 hover:text-teal-950 transition-all duration-300" href="#">
          Features
        </a>

        {/* Inactive Links */}
        <a className="font-headline tracking-tight font-semibold text-teal-800/60 hover:text-teal-950 transition-all duration-300" href="#">
          For Professionals
        </a>
        <a className="font-headline tracking-tight font-semibold text-teal-800/60 hover:text-teal-950 transition-all duration-300" href="#">
          Pricing
        </a>
        <a className="font-headline tracking-tight font-semibold text-teal-800/60 hover:text-teal-950 transition-all duration-300" href="#">
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
const Hero = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const handleDashboardClick = () => {
    if (role === 'admin') navigate('/admin/stats');
    else if (role === 'nutritionist') navigate('/nutritionist/clients');
    else navigate('/dashboard');
  };

  return (
    <section className="relative pt-44 pb-32 overflow-hidden px-6">
      <div className="hero-gradient absolute inset-0 -z-10"></div>
      <div className="max-w-7xl mx-auto text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary-fixed/30 text-on-secondary-container rounded-full text-xs font-bold tracking-widest uppercase mb-8">
          <span className="material-symbols-outlined text-sm">auto_awesome</span> Precision Nutrition
        </div>

        {/* H1 — no colored span, matches stitch */}
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-primary-container max-w-4xl mx-auto leading-[1.1] mb-6">
          Welcome to Your Nutrition Journey!
        </h1>

        <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-12">
          Unlock the science of your own body with precision tracking, AI-powered insights, and curated meal intelligence.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
          {user ? (
            <button
              onClick={handleDashboardClick}
              className="bg-primary-container text-white px-8 py-4 rounded-full font-headline font-bold text-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="bg-primary-container text-white px-8 py-4 rounded-full font-headline font-bold text-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
              </button>
              <button className="bg-surface-container-lowest text-on-surface border border-outline-variant/30 px-8 py-4 rounded-full font-headline font-bold text-lg hover:bg-surface-container transition-all duration-300">
                View Demo
              </button>
            </>
          )}
        </div>

        {/* Dashboard mockup — card matches stitch exactly */}

      </div>
    </section>
  );
};

const Plans = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-surface-container-low px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-primary-container mb-4">Our Plans</h2>
          <p className="font-body text-on-surface-variant max-w-xl mx-auto">Choose the level of precision that matches your performance goals.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic */}
          <div className="bg-surface-container-lowest p-10 rounded-3xl flex flex-col hover:-translate-y-2 transition-all duration-300 group">
            <span className="material-symbols-outlined text-4xl text-teal-800/40 mb-6 group-hover:text-teal-800 transition-colors">eco</span>
            <h3 className="font-headline text-2xl font-bold mb-2">Basic</h3>
            <p className="text-on-surface-variant mb-8 font-body">Essential tracking for beginners.</p>
            <div className="text-4xl font-black text-teal-950 mb-8">$0<span className="text-sm font-medium opacity-50">/mo</span></div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-2 text-sm font-medium"><span className="material-symbols-outlined text-secondary text-lg">check_circle</span> Calorie Tracking</li>
              <li className="flex items-center gap-2 text-sm font-medium"><span className="material-symbols-outlined text-secondary text-lg">check_circle</span> Macro Counter</li>
              <li className="flex items-center gap-2 text-sm font-medium opacity-40"><span className="material-symbols-outlined text-lg">block</span> AI Recognition</li>
            </ul>
            <button onClick={() => navigate('/login')} className="w-full py-4 rounded-2xl bg-surface-container font-headline font-bold hover:bg-surface-container-high transition-colors">Start Free</button>
          </div>
          {/* Standard (Featured) */}
          <div className="bg-primary-container p-10 rounded-3xl flex flex-col relative scale-105 shadow-2xl shadow-teal-900/20 border-2 border-secondary-fixed/50 hover:-translate-y-2 transition-all duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary-fixed text-on-secondary-fixed px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Most Popular</div>
            <span className="material-symbols-outlined text-4xl text-secondary-fixed mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <h3 className="font-headline text-2xl font-bold mb-2 text-white">Standard</h3>
            <p className="text-teal-200/60 mb-8 font-body">Our full science-based suite.</p>
            <div className="text-4xl font-black text-white mb-8">$19<span className="text-sm font-medium opacity-50">/mo</span></div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-2 text-sm font-medium text-white"><span className="material-symbols-outlined text-secondary-fixed text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Everything in Basic</li>
              <li className="flex items-center gap-2 text-sm font-medium text-white"><span className="material-symbols-outlined text-secondary-fixed text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> AI Food Recognition</li>
              <li className="flex items-center gap-2 text-sm font-medium text-white"><span className="material-symbols-outlined text-secondary-fixed text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> DNA Insights Integration</li>
            </ul>
            <button onClick={() => navigate('/login')} className="w-full py-4 rounded-2xl bg-gradient-to-r from-secondary to-secondary-fixed-dim text-white font-headline font-bold hover:shadow-lg hover:shadow-secondary/20 transition-all">Get Started</button>
          </div>
          {/* Premium */}
          <div className="bg-surface-container-lowest p-10 rounded-3xl flex flex-col hover:-translate-y-2 transition-all duration-300 group">
            <span className="material-symbols-outlined text-4xl text-teal-800/40 mb-6 group-hover:text-teal-800 transition-colors">workspace_premium</span>
            <h3 className="font-headline text-2xl font-bold mb-2">Premium</h3>
            <p className="text-on-surface-variant mb-8 font-body">Concierge-level nutrition expert support.</p>
            <div className="text-4xl font-black text-teal-950 mb-8">$49<span className="text-sm font-medium opacity-50">/mo</span></div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-2 text-sm font-medium"><span className="material-symbols-outlined text-secondary text-lg">check_circle</span> Everything in Standard</li>
              <li className="flex items-center gap-2 text-sm font-medium"><span className="material-symbols-outlined text-secondary text-lg">check_circle</span> 1-on-1 Dietitian Access</li>
              <li className="flex items-center gap-2 text-sm font-medium"><span className="material-symbols-outlined text-secondary text-lg">check_circle</span> Personalized Meal Prep</li>
            </ul>
            <button onClick={() => navigate('/login')} className="w-full py-4 rounded-2xl bg-surface-container font-headline font-bold hover:bg-surface-container-high transition-colors">Go Pro</button>
          </div>
        </div>
      </div>
    </section>
  );
};

const AISection = () => (
  <section className="py-24 px-6 overflow-hidden">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-container text-secondary-fixed rounded-full text-xs font-bold tracking-widest uppercase mb-6">
          <span className="material-symbols-outlined text-sm">neurology</span> Intelligence
        </div>
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-primary-container mb-6 leading-tight">
          AI-Powered Food Recognition
        </h2>
        <p className="font-body text-lg text-on-surface-variant mb-10 leading-relaxed">
          Stop guessing. Our computer vision engine identifies thousands of ingredients instantly from a single photo. We calculate volume, density, and micro-nutrients with 99% accuracy.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 bg-surface-container-low rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300">
            <span className="material-symbols-outlined text-secondary text-3xl mb-4">camera</span>
            <h4 className="font-headline font-bold mb-2">Snap & Scan</h4>
            <p className="text-sm opacity-70">Point your camera, identify everything on the plate in milliseconds.</p>
          </div>
          <div className="p-6 bg-surface-container-low rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300">
            <span className="material-symbols-outlined text-secondary text-3xl mb-4">insights</span>
            <h4 className="font-headline font-bold mb-2">Calorie Estimation</h4>
            <p className="text-sm opacity-70">Precise volume estimation for accurate caloric density analysis.</p>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="bg-primary-container rounded-[4rem] aspect-square flex items-center justify-center p-12 relative overflow-hidden">
          <div className="grid-pattern absolute inset-0 opacity-10"></div>
          <div className="scanline"></div>
          <div className="relative z-10 w-full">
            <img alt="AI Scan Demo" className="rounded-[3rem] shadow-2xl w-full h-[400px] object-cover ring-4 ring-secondary-fixed/20" src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2000&auto=format&fit=crop" />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl max-w-[180px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span className="font-label text-[10px] font-bold uppercase tracking-widest">Target Found</span>
              </div>
              <div className="font-headline font-bold text-teal-950">Avocado Salad</div>
              <div className="text-secondary font-black">342 kcal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const WhyUs = () => (
  <section className="py-24 bg-white px-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="max-w-2xl">
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-primary-container mb-4">Why NutriTrack?</h2>
          <p className="font-body text-on-surface-variant">We combine clinical research with silicon valley technology to give you an unfair advantage in health.</p>
        </div>
        <a className="font-headline font-bold text-secondary flex items-center gap-2 group" href="#">
          Learn about our science
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-10 bg-surface-container-low rounded-3xl group hover:bg-primary-container hover:text-white transition-all duration-500">
          <span className="material-symbols-outlined text-5xl text-secondary mb-8 block group-hover:scale-110 transition-transform">medical_services</span>
          <h3 className="font-headline text-2xl font-bold mb-4">🥗 Expert Nutritionists</h3>
          <p className="font-body opacity-70 leading-relaxed">Access to board-certified specialists who translate your data into actionable life changes.</p>
        </div>
        <div className="p-10 bg-surface-container-low rounded-3xl group hover:bg-primary-container hover:text-white transition-all duration-500">
          <span className="material-symbols-outlined text-5xl text-secondary mb-8 block group-hover:scale-110 transition-transform">devices</span>
          <h3 className="font-headline text-2xl font-bold mb-4">📱 Mobile App</h3>
          <p className="font-body opacity-70 leading-relaxed">Your entire health history and predictive engine, available wherever life takes you.</p>
        </div>
        <div className="p-10 bg-surface-container-low rounded-3xl group hover:bg-primary-container hover:text-white transition-all duration-500">
          <span className="material-symbols-outlined text-5xl text-secondary mb-8 block group-hover:scale-110 transition-transform">encrypted</span>
          <h3 className="font-headline text-2xl font-bold mb-4">🔒 Secure Data</h3>
          <p className="font-body opacity-70 leading-relaxed">Medical-grade encryption ensures your biometric data stays yours and yours alone.</p>
        </div>
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="py-24 bg-surface px-6">
    <div className="max-w-7xl mx-auto">
      <h2 className="font-headline text-4xl font-extrabold tracking-tight text-center mb-16 text-primary-container">Trusted by 100k+ Vitality Seekers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex gap-1 text-secondary-fixed-dim mb-6">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
          <p className="font-body text-on-surface-variant italic mb-8 leading-relaxed">"NutriTrack changed how I see food. The AI scanning is like magic, and the data insights are scary accurate."</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-primary-container font-bold text-xl">S</div>
            <div>
              <p className="font-headline font-bold text-sm">Sarah Jenkins</p>
              <p className="font-label text-[10px] uppercase opacity-50">Fitness Coach</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex gap-1 text-secondary-fixed-dim mb-6">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
          <p className="font-body text-on-surface-variant italic mb-8 leading-relaxed">"The transition from generic tracking to NutriTrack was night and day. It's the luxury watch of nutrition apps."</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-primary-container font-bold text-xl">D</div>
            <div>
              <p className="font-headline font-bold text-sm">David Larson</p>
              <p className="font-label text-[10px] uppercase opacity-50">Tech Lead</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex gap-1 text-secondary-fixed-dim mb-6">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
          <p className="font-body text-on-surface-variant italic mb-8 leading-relaxed">"Finally, a nutrition app that respects my intelligence and my aesthetic preferences. It's beautiful and powerful."</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-primary-container font-bold text-xl">E</div>
            <div>
              <p className="font-headline font-bold text-sm">Emma Wright</p>
              <p className="font-label text-[10px] uppercase opacity-50">Content Creator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="w-full py-16 px-12 flex flex-col md:flex-row justify-between items-center gap-8 bg-teal-950 text-white">
    <div className="flex flex-col items-center md:items-start gap-4">
      <div className="text-xl font-bold text-teal-300">NutriTrack</div>
      <p className="font-body text-sm tracking-wide text-teal-200/50">© 2024 NutriTrack. Precision in Digital Vitality.</p>
    </div>
    <div className="flex gap-8">
      <a className="font-body text-sm tracking-wide text-teal-200/50 hover:text-teal-300 transition-colors duration-300" href="#">Privacy Policy</a>
      <a className="font-body text-sm tracking-wide text-teal-200/50 hover:text-teal-300 transition-colors duration-300" href="#">Terms of Service</a>
      <a className="font-body text-sm tracking-wide text-teal-200/50 hover:text-teal-300 transition-colors duration-300" href="#">Support</a>
      <a className="font-body text-sm tracking-wide text-teal-200/50 hover:text-teal-300 transition-colors duration-300" href="#">Research</a>
    </div>
  </footer>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <Navbar />
      <Hero />
      <Plans />
      <AISection />
      <WhyUs />
      <Testimonials />
      <Footer />
    </div>
  );
}