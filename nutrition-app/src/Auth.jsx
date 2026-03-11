import { useState, useRef } from 'react';
import styles from './Auth.module.css';
import {
  loginEmail,
  loginPassword,
  signUp,
  forgotPassword,
} from './authApi';

// ─── Icons ────────────────────────────────────────────────────────────────────

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const KeyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);

const EyeIcon = ({ show }) =>
  show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const MailIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

// ─── Logo ─────────────────────────────────────────────────────────────────────

const Logo = () => (
  <div className={styles.logo}>
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="10" fill="#1a6b3c"/>
      <path d="M18 8C18 8 10 13 10 19.5C10 24.1 13.6 27 18 27C22.4 27 26 24.1 26 19.5C26 13 18 8 18 8Z" fill="white" opacity="0.9"/>
      <path d="M18 14C18 14 14 17 14 20.5C14 22.9 15.8 24.5 18 24.5C20.2 24.5 22 22.9 22 20.5C22 17 18 14 18 14Z" fill="#1a6b3c"/>
    </svg>
    <span className={styles.logoText}>NutriTrack</span>
  </div>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

// ─── Role-based redirect ──────────────────────────────────────────────────────

const redirectByRole = (role, approvalStatus) => {
  if (role === 'admin') {
    window.location.href = '/admin';
  } else if (role === 'nutritionist') {
    if (approvalStatus !== 'approved') {
      // stays on step 4 — the pending message is shown there
      return 'pending';
    }
    window.location.href = '/nutritionist';
  } else {
    window.location.href = '/dashboard';
  }
};

// ─── Main Auth Component ───────────────────────────────────────────────────────

export default function Auth() {
  const [step, setStep]           = useState(1);
  const [prevStep, setPrevStep]   = useState(null);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('forward');

  const [email, setEmail]               = useState('');
  const [emailError, setEmailError]     = useState('');
  const [password, setPassword]         = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successType, setSuccessType]   = useState(null); // 'signin' | 'reset' | 'register' | 'pending'

  // Loading states — one per action
  const [loadingEmail, setLoadingEmail]       = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingReset, setLoadingReset]       = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  // Register fields
  const [regName, setRegName]         = useState('');
  const [regEmail, setRegEmail]       = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm]   = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConf, setShowRegConf] = useState(false);
  const [regErrors, setRegErrors]     = useState({});

  const [resetEmail, setResetEmail] = useState('');

  const containerRef = useRef(null);

  // ── Transition helper ────────────────────────────────────────────────────────
  const goTo = (nextStep, dir = 'forward') => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setPrevStep(step);
    setTimeout(() => {
      setStep(nextStep);
      setPrevStep(null);
      setAnimating(false);
    }, 350);
  };

  // ── Step 1: email check with API ─────────────────────────────────────────────
  const handleEmailContinue = async () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setLoadingEmail(true);
    try {
      await loginEmail(email);
      goTo(2);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error;
      if (err.response?.status === 404) {
        setEmailError('No account found with this email.');
      } else {
        setEmailError(msg || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google OAuth — integrate your OAuth provider here');
  };

  // ── Step 2 choices ───────────────────────────────────────────────────────────
  const handlePasswordChoice = () => goTo('3a');

  const handleForgotChoice = () => {
    setResetEmail(email);
    goTo('3b');
  };

  // ── Step 3a: sign in with password ───────────────────────────────────────────
  const handleSignIn = async () => {
    if (!password) {
      setPasswordError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    setPasswordError('');
    setLoadingPassword(true);
    try {
      const data = await loginPassword(password);
      // data should contain: { access_token, refresh_token, role, approval_status }
      const result = redirectByRole(data.role, data.approval_status);
      if (result === 'pending') {
        setSuccessType('pending');
        goTo(4);
      } else {
        setSuccessType('signin');
        goTo(4);
        // redirect happens after progress bar animation
        setTimeout(() => redirectByRole(data.role, data.approval_status), 2500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error;
      if (err.response?.status === 401) {
        setPasswordError('Incorrect password. Please try again.');
      } else {
        setPasswordError(msg || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoadingPassword(false);
    }
  };

  // ── Step 3b: forgot password ─────────────────────────────────────────────────
  const handleSendReset = async () => {
    if (!validateEmail(resetEmail)) return;
    setLoadingReset(true);
    try {
      await forgotPassword(resetEmail);
      setSuccessType('reset');
      goTo(4);
    } catch (err) {
      // even on error we show the success screen for security reasons
      // (don't reveal whether email exists or not)
      setSuccessType('reset');
      goTo(4);
    } finally {
      setLoadingReset(false);
    }
  };

  // ── Email chip back ──────────────────────────────────────────────────────────
  const handleEditEmail = () => {
    setPassword('');
    setPasswordError('');
    goTo(1, 'backward');
  };

  // ── Register with API ────────────────────────────────────────────────────────
  const handleRegister = async () => {
    const errors = {};
    if (!regName.trim()) errors.name = 'Full name is required.';
    if (!validateEmail(regEmail)) errors.email = 'Please enter a valid email address.';
    if (regPassword.length < 6) errors.password = 'Password must be at least 6 characters.';
    if (regConfirm !== regPassword) errors.confirm = 'Passwords do not match.';
    if (Object.keys(errors).length > 0) {
      setRegErrors(errors);
      return;
    }
    setRegErrors({});
    setLoadingRegister(true);

    // split full name into first_name and last_name for the API
    const nameParts  = regName.trim().split(' ');
    const first_name = nameParts[0];
    const last_name  = nameParts.slice(1).join(' ') || ' ';

    try {
      await signUp({ first_name, last_name, email: regEmail, password: regPassword });
      setSuccessType('register');
      goTo(4);
      setTimeout(() => { window.location.href = '/dashboard'; }, 2500);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error;
      if (err.response?.status === 409) {
        setRegErrors({ email: 'An account with this email already exists.' });
      } else {
        setRegErrors({ email: msg || 'Registration failed. Please try again.' });
      }
    } finally {
      setLoadingRegister(false);
    }
  };

  // ── Step renderer ────────────────────────────────────────────────────────────
  const renderStep = (s) => {
    switch (s) {
      case 1: return <Step1
        email={email} setEmail={setEmail}
        emailError={emailError} setEmailError={setEmailError}
        onContinue={handleEmailContinue}
        onGoogle={handleGoogleLogin}
        loading={loadingEmail}
      />;
      case 2: return <Step2
        email={email}
        onEditEmail={handleEditEmail}
        onPassword={handlePasswordChoice}
        onForgot={handleForgotChoice}
      />;
      case '3a': return <Step3a
        password={password} setPassword={setPassword}
        passwordError={passwordError} setPasswordError={setPasswordError}
        showPassword={showPassword} setShowPassword={setShowPassword}
        onSignIn={handleSignIn}
        loading={loadingPassword}
        onBack={() => { setPasswordError(''); goTo(2, 'backward'); }}
      />;
      case '3b': return <Step3b
        email={resetEmail} setEmail={setResetEmail}
        onSend={handleSendReset}
        loading={loadingReset}
        onBack={() => goTo(2, 'backward')}
      />;
      case 4: return <Step4 successType={successType} />;
      case 'reg': return <StepRegister
        regName={regName} setRegName={setRegName}
        regEmail={regEmail} setRegEmail={setRegEmail}
        regPassword={regPassword} setRegPassword={setRegPassword}
        regConfirm={regConfirm} setRegConfirm={setRegConfirm}
        showRegPass={showRegPass} setShowRegPass={setShowRegPass}
        showRegConf={showRegConf} setShowRegConf={setShowRegConf}
        regErrors={regErrors} setRegErrors={setRegErrors}
        onRegister={handleRegister}
        loading={loadingRegister}
        onBack={() => { setRegErrors({}); goTo(1, 'backward'); }}
        onGoogle={handleGoogleLogin}
      />;
      default: return null;
    }
  };

  const slideClass = animating
    ? direction === 'forward' ? styles.slideOutLeft : styles.slideOutRight
    : direction === 'forward' ? styles.slideInRight : styles.slideInLeft;

  return (
    <div className={styles.page}>
      <div className={styles.cardWrapper}>
        <div ref={containerRef} className={`${styles.card} ${slideClass}`}>
          {renderStep(step)}
        </div>
        {step === 1 && (
          <p className={styles.registerLink}>
            Don&apos;t have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); goTo('reg'); }}>
              Register
            </a>
          </p>
        )}
        {step === 'reg' && (
          <p className={styles.registerLink}>
            Already have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setRegErrors({}); goTo(1, 'backward'); }}>
              Sign in
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Step 1: Email Entry ───────────────────────────────────────────────────────

function Step1({ email, setEmail, emailError, setEmailError, onContinue, onGoogle, loading }) {
  return (
    <>
      <Logo />
      <h1 className={styles.title}>Welcome back</h1>
      <p className={styles.subtitle}>Sign in to your account</p>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          className={`${styles.input} ${emailError ? styles.inputError : ''}`}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && onContinue()}
          autoFocus
          autoComplete="email"
          disabled={loading}
        />
        {emailError && <span className={styles.errorMsg}>{emailError}</span>}
      </div>

      <button
        id="btn-continue-email"
        className={styles.btnPrimary}
        onClick={onContinue}
        disabled={loading}
      >
        {loading ? 'Checking…' : 'Continue'}
      </button>

      <div className={styles.divider}>
        <span className={styles.dividerLine}/>
        <span className={styles.dividerText}>or</span>
        <span className={styles.dividerLine}/>
      </div>

      <button id="btn-google" className={styles.btnGoogle} onClick={onGoogle} disabled={loading}>
        <GoogleIcon />
        Continue with Google
      </button>
    </>
  );
}

// ─── Step 2: Auth Method ──────────────────────────────────────────────────────

function Step2({ email, onEditEmail, onPassword, onForgot }) {
  return (
    <>
      <Logo />
      <button className={styles.emailChip} onClick={onEditEmail} aria-label="Edit email">
        <span className={styles.emailChipText}>{email}</span>
        <EditIcon />
      </button>

      <h2 className={styles.title} style={{ marginTop: '0.5rem' }}>How do you want to sign in?</h2>

      <div className={styles.methodButtons}>
        <button id="btn-use-password" className={styles.btnMethod} onClick={onPassword}>
          <LockIcon />
          Continue with password
        </button>
        <button id="btn-forgot-password" className={styles.btnMethod} onClick={onForgot}>
          <KeyIcon />
          Forgot password?
        </button>
      </div>
    </>
  );
}

// ─── Step 3a: Password Entry ──────────────────────────────────────────────────

function Step3a({ password, setPassword, passwordError, setPasswordError, showPassword, setShowPassword, onSignIn, onBack, loading }) {
  return (
    <>
      <div className={styles.stepHeader}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Go back" disabled={loading}>
          <ArrowLeftIcon />
        </button>
        <Logo />
      </div>

      <h2 className={styles.title}>Enter your password</h2>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="password">Password</label>
        <div className={styles.passwordWrapper}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className={`${styles.input} ${passwordError ? styles.inputError : ''}`}
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && onSignIn()}
            autoFocus
            autoComplete="current-password"
            disabled={loading}
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={loading}
          >
            <EyeIcon show={showPassword} />
          </button>
        </div>
        {passwordError && <span className={styles.errorMsg}>{passwordError}</span>}
      </div>

      <button
        id="btn-signin"
        className={styles.btnPrimary}
        onClick={onSignIn}
        disabled={loading}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </>
  );
}

// ─── Step 3b: Forgot Password ─────────────────────────────────────────────────

function Step3b({ email, setEmail, onSend, onBack, loading }) {
  return (
    <>
      <div className={styles.stepHeader}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Go back" disabled={loading}>
          <ArrowLeftIcon />
        </button>
        <Logo />
      </div>

      <h2 className={styles.title}>Reset your password</h2>
      <p className={styles.subtitle}>We will send a reset link to your email</p>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="reset-email">Email address</label>
        <input
          id="reset-email"
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          autoFocus
          autoComplete="email"
          disabled={loading}
        />
      </div>

      <button
        id="btn-send-reset"
        className={styles.btnPrimary}
        onClick={onSend}
        disabled={loading}
      >
        {loading ? 'Sending…' : 'Send reset link'}
      </button>
    </>
  );
}

// ─── Step 4: Success ──────────────────────────────────────────────────────────

function Step4({ successType }) {
  return (
    <div className={styles.successContainer}>
      {successType === 'signin' && (
        <>
          <div className={styles.successIcon}><CheckCircleIcon /></div>
          <h2 className={styles.successTitle}>You&apos;re signed in!</h2>
          <p className={styles.successSub}>Redirecting you to your dashboard…</p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} />
          </div>
        </>
      )}
      {successType === 'register' && (
        <>
          <div className={styles.successIcon}><CheckCircleIcon /></div>
          <h2 className={styles.successTitle}>Account created!</h2>
          <p className={styles.successSub}>Welcome aboard! Redirecting you to your dashboard…</p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} />
          </div>
        </>
      )}
      {successType === 'reset' && (
        <>
          <div className={styles.successIcon}><MailIcon /></div>
          <h2 className={styles.successTitle}>Check your inbox</h2>
          <p className={styles.successSub}>A reset link has been sent to your email address.</p>
        </>
      )}
      {successType === 'pending' && (
        <>
          <div className={styles.successIcon}><MailIcon /></div>
          <h2 className={styles.successTitle}>Account pending approval</h2>
          <p className={styles.successSub}>Your nutritionist account is under review. You will receive an email once approved.</p>
        </>
      )}
    </div>
  );
}

// ─── Step Register ────────────────────────────────────────────────────────────

function StepRegister({
  regName, setRegName,
  regEmail, setRegEmail,
  regPassword, setRegPassword,
  regConfirm, setRegConfirm,
  showRegPass, setShowRegPass,
  showRegConf, setShowRegConf,
  regErrors, setRegErrors,
  onRegister, onBack, onGoogle, loading
}) {
  const clearErr = (field) => setRegErrors((e) => ({ ...e, [field]: '' }));

  return (
    <>
      <div className={styles.stepHeader}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Go back" disabled={loading}>
          <ArrowLeftIcon />
        </button>
        <Logo />
      </div>

      <h2 className={styles.title}>Create an account</h2>
      <p className={styles.subtitle}>Join NutriTrack and start your journey</p>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="reg-name">Full name</label>
        <input
          id="reg-name"
          type="text"
          className={`${styles.input} ${regErrors.name ? styles.inputError : ''}`}
          placeholder="Name"
          value={regName}
          onChange={(e) => { setRegName(e.target.value); clearErr('name'); }}
          autoFocus
          autoComplete="name"
          disabled={loading}
        />
        {regErrors.name && <span className={styles.errorMsg}>{regErrors.name}</span>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="reg-email">Email address</label>
        <input
          id="reg-email"
          type="email"
          className={`${styles.input} ${regErrors.email ? styles.inputError : ''}`}
          placeholder="you@example.com"
          value={regEmail}
          onChange={(e) => { setRegEmail(e.target.value); clearErr('email'); }}
          autoComplete="email"
          disabled={loading}
        />
        {regErrors.email && <span className={styles.errorMsg}>{regErrors.email}</span>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="reg-password">Password</label>
        <div className={styles.passwordWrapper}>
          <input
            id="reg-password"
            type={showRegPass ? 'text' : 'password'}
            className={`${styles.input} ${regErrors.password ? styles.inputError : ''}`}
            placeholder="Min. 6 characters"
            value={regPassword}
            onChange={(e) => { setRegPassword(e.target.value); clearErr('password'); }}
            autoComplete="new-password"
            disabled={loading}
          />
          <button type="button" className={styles.eyeBtn} onClick={() => setShowRegPass((v) => !v)} aria-label="Toggle password" disabled={loading}>
            <EyeIcon show={showRegPass} />
          </button>
        </div>
        {regErrors.password && <span className={styles.errorMsg}>{regErrors.password}</span>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="reg-confirm">Confirm password</label>
        <div className={styles.passwordWrapper}>
          <input
            id="reg-confirm"
            type={showRegConf ? 'text' : 'password'}
            className={`${styles.input} ${regErrors.confirm ? styles.inputError : ''}`}
            placeholder="Repeat password"
            value={regConfirm}
            onChange={(e) => { setRegConfirm(e.target.value); clearErr('confirm'); }}
            onKeyDown={(e) => e.key === 'Enter' && onRegister()}
            autoComplete="new-password"
            disabled={loading}
          />
          <button type="button" className={styles.eyeBtn} onClick={() => setShowRegConf((v) => !v)} aria-label="Toggle confirm password" disabled={loading}>
            <EyeIcon show={showRegConf} />
          </button>
        </div>
        {regErrors.confirm && <span className={styles.errorMsg}>{regErrors.confirm}</span>}
      </div>

      <button
        id="btn-register"
        className={styles.btnPrimary}
        onClick={onRegister}
        disabled={loading}
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <div className={styles.divider}>
        <span className={styles.dividerLine}/>
        <span className={styles.dividerText}>or</span>
        <span className={styles.dividerLine}/>
      </div>

      <button id="btn-google-register" className={styles.btnGoogle} onClick={onGoogle} disabled={loading}>
        <GoogleIcon />
        Continue with Google
      </button>
    </>
  );
}