import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { loginEmail, loginPassword, signUp, forgotPassword } from '../../api/authApi'

// ── Icons ──────────────────────────────────────────────────────────────────────

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
)

const EyeIcon = ({ show }) => show ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)

const MailIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

// ── Logo ───────────────────────────────────────────────────────────────────────

const Logo = () => (
  <div className="flex items-center gap-2 mb-6">
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="10" fill="#052B34"/>
      <path d="M18 8C18 8 10 13 10 19.5C10 24.1 13.6 27 18 27C22.4 27 26 24.1 26 19.5C26 13 18 8 18 8Z" fill="white" opacity="0.9"/>
      <path d="M18 14C18 14 14 17 14 20.5C14 22.9 15.8 24.5 18 24.5C20.2 24.5 22 22.9 22 20.5C22 17 18 14 18 14Z" fill="#50CD95"/>
    </svg>
    <span className="text-lg font-semibold text-[#052B34]">NutriTrack</span>
  </div>
)

// ── Helpers ────────────────────────────────────────────────────────────────────

const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())

const Input = ({ error, ...props }) => (
  <input
    {...props}
    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition
      focus:ring-2 focus:ring-[#50CD95]/40
      ${error
        ? 'border-red-400 bg-red-50 focus:border-red-400'
        : 'border-gray-200 bg-white focus:border-[#50CD95]'
      } disabled:opacity-50`}
  />
)

const PrimaryBtn = ({ loading, children, ...props }) => (
  <button
    {...props}
    className="w-full py-2.5 rounded-xl bg-[#052B34] text-white text-sm font-medium
      hover:bg-[#0a3d4a] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {children}
  </button>
)

const ErrorMsg = ({ msg }) => msg
  ? <p className="text-xs text-red-500 mt-1">{msg}</p>
  : null

// ── Main Component ─────────────────────────────────────────────────────────────

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [step, setStep]           = useState(1)
  const [prevStep, setPrevStep]   = useState(null)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState('forward')

  const [email, setEmail]             = useState('')
  const [emailError, setEmailError]   = useState('')
  const [password, setPassword]       = useState('')
  const [passError, setPassError]     = useState('')
  const [showPass, setShowPass]       = useState(false)
  const [successType, setSuccessType] = useState(null)

  const [loadingEmail, setLoadingEmail]   = useState(false)
  const [loadingPass, setLoadingPass]     = useState(false)
  const [loadingReset, setLoadingReset]   = useState(false)
  const [loadingReg, setLoadingReg]       = useState(false)

  const [regName, setRegName]       = useState('')
  const [regEmail, setRegEmail]     = useState('')
  const [regPass, setRegPass]       = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [showRegPass, setShowRegPass] = useState(false)
  const [showRegConf, setShowRegConf] = useState(false)
  const [regErrors, setRegErrors]   = useState({})
  const [resetEmail, setResetEmail] = useState('')

  const goTo = (next, dir = 'forward') => {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setPrevStep(step)
    setTimeout(() => {
      setStep(next)
      setPrevStep(null)
      setAnimating(false)
    }, 300)
  }

  const redirectByRole = (role, approvalStatus) => {
    if (role === 'admin') navigate('/admin')
    else if (role === 'nutritionist') {
      if (approvalStatus !== 'approved') return 'pending'
      navigate('/nutritionist')
    } else navigate('/dashboard')
  }

  const handleEmailContinue = async () => {
    if (!validateEmail(email)) { setEmailError('Please enter a valid email address.'); return }
    setEmailError('')
    setLoadingEmail(true)
    try {
      await loginEmail(email)
      goTo(2)
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error
      setEmailError(err.response?.status === 404 ? 'No account found with this email.' : msg || 'Something went wrong.')
    } finally { setLoadingEmail(false) }
  }

  const handleSignIn = async () => {
    if (!password) { setPassError('Please enter your password.'); return }
    if (password.length < 6) { setPassError('Password must be at least 6 characters.'); return }
    setPassError('')
    setLoadingPass(true)
    try {
      const data = await loginPassword(password)
      login(data.user || {}, data.role, data.access_token)
      const result = redirectByRole(data.role, data.approval_status)
      if (result === 'pending') { setSuccessType('pending'); goTo(4) }
      else { setSuccessType('signin'); goTo(4) }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error
      setPassError(err.response?.status === 401 ? 'Incorrect password.' : msg || 'Something went wrong.')
    } finally { setLoadingPass(false) }
  }

  const handleSendReset = async () => {
    if (!validateEmail(resetEmail)) return
    setLoadingReset(true)
    try { await forgotPassword(resetEmail) } catch {}
    finally {
      setLoadingReset(false)
      setSuccessType('reset')
      goTo(4)
    }
  }

  const handleRegister = async () => {
    const errors = {}
    if (!regName.trim()) errors.name = 'Full name is required.'
    if (!validateEmail(regEmail)) errors.email = 'Please enter a valid email.'
    if (regPass.length < 6) errors.password = 'At least 6 characters.'
    if (regConfirm !== regPass) errors.confirm = 'Passwords do not match.'
    if (Object.keys(errors).length) { setRegErrors(errors); return }
    setRegErrors({})
    setLoadingReg(true)
    const parts = regName.trim().split(' ')
    try {
      await signUp({ first_name: parts[0], last_name: parts.slice(1).join(' ') || ' ', email: regEmail, password: regPass })
      setSuccessType('register')
      goTo(4)
      setTimeout(() => navigate('/dashboard'), 2500)
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error
      setRegErrors({ email: err.response?.status === 409 ? 'Email already exists.' : msg || 'Registration failed.' })
    } finally { setLoadingReg(false) }
  }

  const slideClass = animating
    ? direction === 'forward' ? '-translate-x-4 opacity-0' : 'translate-x-4 opacity-0'
    : 'translate-x-0 opacity-100'

  const renderStep = (s) => {
    switch (s) {
      case 1: return (
        <>
          <Logo />
          <h1 className="text-2xl font-semibold text-[#052B34] mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Email address</label>
            <Input
              type="email" placeholder="you@example.com" value={email} error={emailError}
              autoFocus autoComplete="email" disabled={loadingEmail}
              onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleEmailContinue()}
            />
            <ErrorMsg msg={emailError} />
          </div>
          <PrimaryBtn loading={loadingEmail} disabled={loadingEmail} onClick={handleEmailContinue}>
            {loadingEmail ? 'Checking…' : 'Continue'}
          </PrimaryBtn>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200"/>
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200"/>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition">
            <GoogleIcon /> Continue with Google
          </button>
        </>
      )

      case 2: return (
        <>
          <Logo />
          <button
            onClick={() => goTo(1, 'backward')}
            className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1 mb-5 hover:bg-gray-50 transition"
          >
            <span className="truncate max-w-[180px]">{email}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <h2 className="text-xl font-semibold text-[#052B34] mb-6">How do you want to sign in?</h2>
          <div className="flex flex-col gap-3">
            <button onClick={() => goTo('3a')} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 hover:border-[#50CD95] hover:bg-[#50CD95]/5 transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Continue with password
            </button>
            <button onClick={() => { setResetEmail(email); goTo('3b') }} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 hover:border-[#50CD95] hover:bg-[#50CD95]/5 transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
              Forgot password?
            </button>
          </div>
        </>
      )

      case '3a': return (
        <>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => { setPassError(''); goTo(2, 'backward') }} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500"><ArrowLeft /></button>
            <Logo />
          </div>
          <h2 className="text-xl font-semibold text-[#052B34] mb-1">Enter your password</h2>
          <p className="text-sm text-gray-500 mb-5">Signing in as {email}</p>
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Password</label>
            <div className="relative">
              <Input
                type={showPass ? 'text' : 'password'} placeholder="••••••••"
                value={password} error={passError}
                autoFocus autoComplete="current-password" disabled={loadingPass}
                onChange={(e) => { setPassword(e.target.value); setPassError('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
              />
              <button type="button" onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <EyeIcon show={showPass} />
              </button>
            </div>
            <ErrorMsg msg={passError} />
          </div>
          <PrimaryBtn loading={loadingPass} disabled={loadingPass} onClick={handleSignIn}>
            {loadingPass ? 'Signing in…' : 'Sign in'}
          </PrimaryBtn>
        </>
      )

      case '3b': return (
        <>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => goTo(2, 'backward')} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500"><ArrowLeft /></button>
            <Logo />
          </div>
          <h2 className="text-xl font-semibold text-[#052B34] mb-1">Reset your password</h2>
          <p className="text-sm text-gray-500 mb-5">We'll send a reset link to your email</p>
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Email address</label>
            <Input
              type="email" value={resetEmail} autoFocus autoComplete="email" disabled={loadingReset}
              onChange={(e) => setResetEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendReset()}
            />
          </div>
          <PrimaryBtn loading={loadingReset} disabled={loadingReset} onClick={handleSendReset}>
            {loadingReset ? 'Sending…' : 'Send reset link'}
          </PrimaryBtn>
        </>
      )

      case 4: return (
        <div className="flex flex-col items-center text-center py-6">
          {successType === 'signin' || successType === 'register' ? (
            <>
              <CheckIcon />
              <h2 className="text-xl font-semibold text-[#052B34] mt-4 mb-1">
                {successType === 'register' ? 'Account created!' : "You're signed in!"}
              </h2>
              <p className="text-sm text-gray-500 mb-6">Redirecting you to your dashboard…</p>
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#50CD95] rounded-full animate-[progress_2.5s_linear_forwards]" style={{animation: 'progress 2.5s linear forwards'}}/>
              </div>
            </>
          ) : successType === 'reset' ? (
            <>
              <MailIcon />
              <h2 className="text-xl font-semibold text-[#052B34] mt-4 mb-1">Check your inbox</h2>
              <p className="text-sm text-gray-500">A reset link has been sent to your email.</p>
            </>
          ) : successType === 'pending' ? (
            <>
              <MailIcon />
              <h2 className="text-xl font-semibold text-[#052B34] mt-4 mb-1">Account pending approval</h2>
              <p className="text-sm text-gray-500">Your nutritionist account is under review. You'll receive an email once approved.</p>
            </>
          ) : null}
        </div>
      )

      case 'reg': return (
        <>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => { setRegErrors({}); goTo(1, 'backward') }} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500"><ArrowLeft /></button>
            <Logo />
          </div>
          <h2 className="text-xl font-semibold text-[#052B34] mb-1">Create an account</h2>
          <p className="text-sm text-gray-500 mb-5">Join NutriTrack and start your journey</p>

          {[
            { label: 'Full name', id: 'reg-name', type: 'text', val: regName, set: setRegName, err: regErrors.name, field: 'name', placeholder: 'Name', auto: 'name' },
            { label: 'Email address', id: 'reg-email', type: 'email', val: regEmail, set: setRegEmail, err: regErrors.email, field: 'email', placeholder: 'you@example.com', auto: 'email' },
          ].map(f => (
            <div key={f.id} className="mb-3">
              <label className="text-xs font-medium text-gray-600 mb-1 block">{f.label}</label>
              <Input type={f.type} placeholder={f.placeholder} value={f.val} error={f.err}
                autoComplete={f.auto} disabled={loadingReg}
                onChange={(e) => { f.set(e.target.value); setRegErrors(p => ({...p, [f.field]: ''})) }}
              />
              <ErrorMsg msg={f.err} />
            </div>
          ))}

          {[
            { label: 'Password', val: regPass, set: setRegPass, show: showRegPass, toggleShow: () => setShowRegPass(v=>!v), err: regErrors.password, field: 'password', placeholder: 'Min. 6 characters', auto: 'new-password' },
            { label: 'Confirm password', val: regConfirm, set: setRegConfirm, show: showRegConf, toggleShow: () => setShowRegConf(v=>!v), err: regErrors.confirm, field: 'confirm', placeholder: 'Repeat password', auto: 'new-password' },
          ].map((f, i) => (
            <div key={i} className="mb-3">
              <label className="text-xs font-medium text-gray-600 mb-1 block">{f.label}</label>
              <div className="relative">
                <Input type={f.show ? 'text' : 'password'} placeholder={f.placeholder}
                  value={f.val} error={f.err} autoComplete={f.auto} disabled={loadingReg}
                  onChange={(e) => { f.set(e.target.value); setRegErrors(p => ({...p, [f.field]: ''})) }}
                  onKeyDown={(e) => e.key === 'Enter' && i === 1 && handleRegister()}
                />
                <button type="button" onClick={f.toggleShow} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <EyeIcon show={f.show} />
                </button>
              </div>
              <ErrorMsg msg={f.err} />
            </div>
          ))}

          <div className="mt-2">
            <PrimaryBtn loading={loadingReg} disabled={loadingReg} onClick={handleRegister}>
              {loadingReg ? 'Creating account…' : 'Create account'}
            </PrimaryBtn>
          </div>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200"/>
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200"/>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition">
            <GoogleIcon /> Continue with Google
          </button>
        </>
      )

      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF5DE] flex flex-col items-center justify-center px-4">
      <div className={`w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition-all duration-300 ${slideClass}`}>
        {renderStep(step)}
      </div>
      {step === 1 && (
        <p className="mt-4 text-sm text-gray-500">
          Don't have an account?{' '}
          <button onClick={() => goTo('reg')} className="text-[#052B34] font-medium hover:underline">Register</button>
        </p>
      )}
      {step === 'reg' && (
        <p className="mt-4 text-sm text-gray-500">
          Already have an account?{' '}
          <button onClick={() => { setRegErrors({}); goTo(1, 'backward') }} className="text-[#052B34] font-medium hover:underline">Sign in</button>
        </p>
      )}
    </div>
  )
}