import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Navbar from '../../components/layout/Navbar'

const CheckIcon = () => (
  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  </div>
)

export default function ApplyNutritionist() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    specialty: '',
    experience: '',
    bio: '',
    portfolio: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Mocking API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 text-center shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="flex justify-center mb-8">
            <CheckIcon />
          </div>
          <h2 className="font-headline text-3xl font-black text-slate-900 mb-4">Application Sent!</h2>
          <p className="text-slate-500 leading-relaxed mb-10">
            Our clinical review board will evaluate your credentials. You will receive an email confirmation within 48 hours.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-body text-on-surface selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <Navbar />
      <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
            <span className="material-symbols-outlined text-sm">medical_services</span> Professionals
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-black text-slate-900 mb-4">Join Our Clinical Network</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Partner with CaloAI to reach thousands of users seeking precision nutrition guidance.
          </p>
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-slate-200/60 border border-slate-100 grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="font-headline text-2xl font-bold text-slate-900 mb-6">Requirements</h3>
            <ul className="space-y-6">
              {[
                { icon: 'verified', title: 'Certified Background', desc: 'Active RD, RDN, or equivalent clinical certification.' },
                { icon: 'clinical_notes', title: 'Evidence Based', desc: 'Commitment to science-backed nutritional protocols.' },
                { icon: 'diversity_1', title: 'User Focused', desc: 'Ability to translate complex data into empathetic care.' }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-tight mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">Primary Specialty</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Sports Performance, Keto, Clinical" 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={formData.specialty}
                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">Years of Experience</label>
              <input 
                required
                type="number" 
                placeholder="Total years in practice" 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">Professional Bio</label>
              <textarea 
                required
                rows="4"
                placeholder="Tell us about your philosophy..." 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">Resume / Portfolio Link</label>
              <input 
                required
                type="url" 
                placeholder="https://linkedin.com/in/..." 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={formData.portfolio}
                onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
              />
            </div>

            <button 
              className="w-full py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-black tracking-wide hover:-translate-y-1 hover:shadow-xl transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit Application'}
            </button>

            {!user && (
              <p className="text-center text-xs text-slate-400 font-medium">
                Note: You will be asked to create a basic account after submission if you don't have one.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  </div>
  )
}
