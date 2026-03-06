import { useState } from 'react'
import NoorLogo from './NoorLogo'
import { supabase } from '../lib/supabase'

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Other']
const TOPICS = [
  { id: 'Money',        label: 'Money & Finance', emoji: '💰' },
  { id: 'Career',       label: 'Career',          emoji: '📈' },
  { id: 'Co-parenting', label: 'Co-parenting',    emoji: '🤝' },
  { id: 'School',       label: 'School & Kids',   emoji: '🎒' },
  { id: 'Dating Again', label: 'Dating Again',    emoji: '🌸' },
  { id: 'Wellness',     label: 'Wellness',        emoji: '🧘' },
]

const font = "'DM Sans', sans-serif"
const serif = "'Cormorant Garamond', Georgia, serif"

function Page({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #EDE8E0', flexShrink: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center' }}>
          <NoorLogo size="sm" />
        </div>
      </header>
      <main style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '48px 16px 80px' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>{children}</div>
      </main>
    </div>
  )
}

function Btn({ children, onClick, disabled, loading, variant = 'primary' }) {
  const bg = variant === 'ghost' ? 'transparent' : disabled || loading ? '#D4856A' : '#B85C38'
  const color = variant === 'ghost' ? '#A8A29E' : '#fff'
  const border = variant === 'ghost' ? '1px solid #EDE8E0' : 'none'
  return (
    <button onClick={onClick} disabled={disabled || loading} style={{
      width: '100%', padding: '14px 20px', borderRadius: 14, border,
      fontSize: 15, fontWeight: 600, fontFamily: font,
      background: bg, color,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled || loading ? 0.7 : 1,
      transition: 'opacity 0.15s',
    }}>
      {loading ? 'Please wait…' : children}
    </button>
  )
}

function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', marginBottom: 6, fontSize: 11, fontWeight: 600, fontFamily: font, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</label>
      <input {...props} style={{
        width: '100%', boxSizing: 'border-box',
        padding: '13px 15px', background: '#FFFFFF',
        border: `1.5px solid ${error ? '#B85C38' : '#EDE8E0'}`,
        borderRadius: 12, fontSize: 16, fontFamily: font, color: '#1C1917', outline: 'none',
      }}
        onFocus={e => e.target.style.borderColor = '#B85C38'}
        onBlur={e => e.target.style.borderColor = error ? '#B85C38' : '#EDE8E0'}
      />
    </div>
  )
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: font, color: '#A8A29E', padding: 0, marginBottom: 32, display: 'block' }}>
      ← Back
    </button>
  )
}

// ── Splash ────────────────────────────────────────────────────────────────────
function Splash({ onNext }) {
  return (
    <Page>
      <h1 style={{ fontFamily: serif, fontSize: 38, fontWeight: 600, color: '#1C1917', margin: '0 0 10px' }}>
        Welcome to Noor.
      </h1>
      <p style={{ fontFamily: serif, fontSize: 20, fontWeight: 500, color: '#B85C38', margin: '0 0 20px', lineHeight: 1.5, fontStyle: 'italic' }}>
        Strong alone. Stronger together.
      </p>
      <p style={{ fontFamily: font, fontSize: 14, color: '#57534E', margin: '0 0 16px', lineHeight: 1.85 }}>
        Noor is a community for single mothers in India — a place where you can finally exhale. Whether you're navigating a tough co-parenting situation, figuring out your finances alone, or just need someone who gets it at 11pm, Noor connects you with women living the same life. Real support, real advice, real people.
      </p>
      <p style={{ fontFamily: font, fontSize: 13, color: '#A8A29E', margin: '0 0 36px', lineHeight: 1.8, borderLeft: '3px solid #EDE8E0', paddingLeft: 14 }}>
        Thousands of mothers across Mumbai, Delhi, Bengaluru and beyond are already here — sharing, supporting, and showing up for each other every day. Your circle is waiting.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Btn onClick={() => onNext('signup')}>Join Noor — it's free</Btn>
        <Btn variant="ghost" onClick={() => onNext('signin')}>I already have an account</Btn>
      </div>
    </Page>
  )
}

// ── Sign In ───────────────────────────────────────────────────────────────────
function SignIn({ onBack, onDone }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setError('')
    if (!email.trim() || !password.trim()) return setError('Please fill in all fields.')
    setLoading(true)
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) return setError(err.message)
    onDone(data.user)
  }

  return (
    <Page>
      <BackBtn onClick={onBack} />
      <h1 style={{ fontFamily: serif, fontSize: 32, fontWeight: 600, color: '#1C1917', margin: '0 0 6px' }}>Welcome back.</h1>
      <p style={{ fontFamily: font, fontSize: 13, color: '#A8A29E', margin: '0 0 32px' }}>Sign in to your account</p>
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
      {error && <p style={{ fontSize: 12, color: '#B85C38', fontFamily: font, margin: '-8px 0 16px' }}>{error}</p>}
      <Btn onClick={submit} loading={loading}>Sign in</Btn>
    </Page>
  )
}

// ── Sign Up ───────────────────────────────────────────────────────────────────
function SignUp({ onBack, onNext }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setError('')
    if (!name.trim() || !email.trim() || !password.trim()) return setError('Please fill in all fields.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    const { data, error: err } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (err) return setError(err.message)
    onNext({ name: name.trim(), email: email.trim(), supabaseUser: data.user })
  }

  return (
    <Page>
      <BackBtn onClick={onBack} />
      <h1 style={{ fontFamily: serif, fontSize: 32, fontWeight: 600, color: '#1C1917', margin: '0 0 6px' }}>Create your account.</h1>
      <p style={{ fontFamily: font, fontSize: 13, color: '#A8A29E', margin: '0 0 32px' }}>Takes less than a minute.</p>
      <Input label="Your name" value={name} onChange={e => setName(e.target.value)} placeholder="First name is fine" />
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" />
      {error && <p style={{ fontSize: 12, color: '#B85C38', fontFamily: font, margin: '-8px 0 16px' }}>{error}</p>}
      <p style={{ fontFamily: font, fontSize: 11, color: '#A8A29E', lineHeight: 1.7, margin: '8px 0 24px' }}>
        By continuing you agree to our Terms of Service and Privacy Policy.
      </p>
      <Btn onClick={submit} loading={loading}>Continue</Btn>
    </Page>
  )
}

// ── City ──────────────────────────────────────────────────────────────────────
function OnboardCity({ user, onNext }) {
  const [city, setCity] = useState('')

  return (
    <Page>
      <p style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>1 of 2</p>
      <h1 style={{ fontFamily: serif, fontSize: 32, fontWeight: 600, color: '#1C1917', margin: '0 0 6px' }}>
        Where are you based, {user.name.split(' ')[0]}?
      </h1>
      <p style={{ fontFamily: font, fontSize: 13, color: '#A8A29E', margin: '0 0 28px' }}>We'll connect you with your local circle.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 32 }}>
        {CITIES.map(c => (
          <button key={c} onClick={() => setCity(c)} style={{
            padding: '13px 8px', borderRadius: 12,
            border: `1.5px solid ${city === c ? '#B85C38' : '#EDE8E0'}`,
            background: city === c ? '#B85C38' : '#FFFFFF',
            color: city === c ? '#FFFFFF' : '#1C1917',
            fontSize: 13, fontWeight: 500, fontFamily: font,
            cursor: 'pointer', transition: 'all 0.12s',
          }}>{c}</button>
        ))}
      </div>
      <Btn onClick={() => city && onNext({ ...user, city })} disabled={!city}>Continue</Btn>
    </Page>
  )
}

// ── Interests ────────────────────────────────────────────────────────────────
function OnboardInterests({ user, onDone }) {
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const toggle = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const finish = async () => {
    setLoading(true)
    // Create profile row in Supabase
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    const { error: err } = await supabase.from('profiles').upsert({
      id: currentUser?.id || user.supabaseUser.id,
      name: user.name,
      email: user.email,
      city: user.city,
      joined_circles: selected.length ? selected : ['Mumbai', 'Money', 'Career'],
    })
    setLoading(false)
    if (err) return setError(err.message)
    onDone({ ...user, interests: selected })
  }

  return (
    <Page>
      <p style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>2 of 2</p>
      <h1 style={{ fontFamily: serif, fontSize: 32, fontWeight: 600, color: '#1C1917', margin: '0 0 6px' }}>What matters most to you?</h1>
      <p style={{ fontFamily: font, fontSize: 13, color: '#A8A29E', margin: '0 0 28px' }}>Pick as many as you like.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 32 }}>
        {TOPICS.map(t => (
          <button key={t.id} onClick={() => toggle(t.id)} style={{
            padding: '16px 14px', borderRadius: 12, textAlign: 'left',
            border: `1.5px solid ${selected.includes(t.id) ? '#B85C38' : '#EDE8E0'}`,
            background: selected.includes(t.id) ? '#B85C38' : '#FFFFFF',
            cursor: 'pointer', transition: 'all 0.12s',
          }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{t.emoji}</div>
            <div style={{ fontSize: 13, fontWeight: 500, fontFamily: font, color: selected.includes(t.id) ? '#FFFFFF' : '#1C1917' }}>{t.label}</div>
          </button>
        ))}
      </div>
      {error && <p style={{ fontSize: 12, color: '#B85C38', fontFamily: font, margin: '-16px 0 16px' }}>{error}</p>}
      <Btn onClick={finish} loading={loading}>
        {selected.length === 0 ? 'Skip for now' : "Let's go →"}
      </Btn>
    </Page>
  )
}

// ── Export ────────────────────────────────────────────────────────────────────
export default function Onboarding({ onComplete }) {
  const [screen, setScreen] = useState('splash')
  const [draft, setDraft] = useState({})

  if (screen === 'splash')    return <Splash onNext={s => setScreen(s)} />
  if (screen === 'signin')    return <SignIn onBack={() => setScreen('splash')} onDone={u => onComplete({ supabaseUser: u })} />
  if (screen === 'signup')    return <SignUp onBack={() => setScreen('splash')} onNext={u => { setDraft(u); setScreen('city') }} />
  if (screen === 'city')      return <OnboardCity user={draft} onNext={u => { setDraft(u); setScreen('interests') }} />
  if (screen === 'interests') return <OnboardInterests user={draft} onDone={u => onComplete(u)} />
  return null
}
