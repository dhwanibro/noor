export function Avatar({ initials, size = 40, className = '' }) {
  const fontSize = Math.round(size * 0.32)
  return (
    <div
      className={`rounded-full flex items-center justify-center font-body font-semibold text-white flex-shrink-0 ${className}`}
      style={{
        width: size, height: size, fontSize,
        background: 'linear-gradient(135deg, #D4856A, #B85C38)',
      }}
    >
      {initials === '?' ? '◌' : initials}
    </div>
  )
}

export function Tag({ label }) {
  const styles = {
    Venting: 'bg-[#FDF0EB] text-terra',
    Win:     'bg-[#EBFAF2] text-sage',
    Help:    'bg-[#FEF9EC] text-[#92680A]',
    Advice:  'bg-[#F0EEFF] text-[#5B4EA8]',
  }
  const s = styles[label] || 'bg-stone text-sub'
  return (
    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full font-body whitespace-nowrap ${s}`}>
      {label === 'Win' ? 'Win 🎉' : label}
    </span>
  )
}

export function VerifiedBadge() {
  return (
    <span
      title="Verified Expert"
      className="inline-flex items-center justify-center w-4 h-4 rounded-full ml-1 flex-shrink-0"
      style={{ background: '#C9A84C' }}
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1.5 4L3 5.5L6.5 2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  )
}

export function SectionHeader({ label, action, onAction }) {
  return (
    <div className="flex justify-between items-center mb-3">
      <h2 className="font-display text-[17px] font-semibold text-ink">{label}</h2>
      {action && (
        <button onClick={onAction} className="text-xs text-terra font-body font-medium">
          {action} →
        </button>
      )}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface border border-border rounded-3xl ${className}`}>
      {children}
    </div>
  )
}

export function Button({ children, variant = 'primary', onClick, disabled, className = '', fullWidth }) {
  const base = 'font-body font-semibold text-sm rounded-xl transition-opacity disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-terra text-white px-4 py-2.5',
    ghost:   'bg-terra-light text-terra px-4 py-2.5',
    outline: 'border border-border text-sub px-4 py-2.5 bg-surface',
    plain:   'text-terra text-xs p-0',
    gold:    'bg-charcoal text-gold px-4 py-2.5 border border-gold/30',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  )
}

export function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-t-[28px] w-full max-w-[430px] animate-fade-up"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-[11px] font-body font-medium px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-colors
        ${active ? 'bg-ink text-white border-ink' : 'bg-surface text-muted border-border'}`}
    >
      {label}
    </button>
  )
}
