import { useState } from 'react'
import { CIRCLES } from '../data/seed'
import { useAppState } from '../App'

const font = "'DM Sans', sans-serif"
const serif = "'Cormorant Garamond', Georgia, serif"

export default function ComposeModal({ open, onClose }) {
  const { addPost, joinedCircles } = useAppState()
  const [text, setText] = useState('')
  const [tag, setTag] = useState('Venting')
  const [circle, setCircle] = useState('all')
  const [anon, setAnon] = useState(false)

  if (!open) return null

  const submit = () => {
    if (!text.trim()) return
    addPost({ text, tag, anon, circle })
    setText(''); setTag('Venting'); setCircle('all'); setAnon(false)
    onClose()
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 520,
          background: '#FFFFFF', borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #EDE8E0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <p style={{ fontFamily: serif, fontSize: 18, fontWeight: 600, color: '#1C1917', margin: 0 }}>New post</p>
          <button onClick={onClose} style={{ fontSize: 13, color: '#A8A29E', background: 'none', border: 'none', cursor: 'pointer', fontFamily: font }}>Cancel</button>
        </div>

        <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Share, vent, ask, celebrate..."
            rows={4}
            autoFocus
            style={{
              width: '100%', boxSizing: 'border-box',
              border: '1.5px solid #EDE8E0', borderRadius: 12,
              padding: '12px 14px', fontSize: 16, fontFamily: font,
              color: '#1C1917', background: '#FAF8F5',
              resize: 'none', outline: 'none', lineHeight: 1.6,
            }}
            onFocus={e => e.target.style.borderColor = '#B85C38'}
            onBlur={e => e.target.style.borderColor = '#EDE8E0'}
          />

          {/* Tag */}
          <div>
            <p style={{ fontSize: 10, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: font, fontWeight: 600, marginBottom: 8 }}>Tag</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Venting', 'Win', 'Help', 'Advice'].map(t => (
                <button key={t} onClick={() => setTag(t)} style={{
                  fontSize: 12, fontFamily: font, fontWeight: 500,
                  padding: '6px 14px', borderRadius: 99,
                  border: `1px solid ${tag === t ? '#1C1917' : '#EDE8E0'}`,
                  background: tag === t ? '#1C1917' : 'transparent',
                  color: tag === t ? '#fff' : '#A8A29E',
                  cursor: 'pointer', transition: 'all 0.12s',
                }}>{t === 'Win' ? 'Win 🎉' : t}</button>
              ))}
            </div>
          </div>

          {/* Circle */}
          <div>
            <p style={{ fontSize: 10, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: font, fontWeight: 600, marginBottom: 8 }}>Circle (optional)</p>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {CIRCLES.filter(c => c.id === 'all' || joinedCircles.includes(c.id)).map(c => (
                <button key={c.id} onClick={() => setCircle(c.id)} style={{
                  fontSize: 12, fontFamily: font, fontWeight: 500,
                  padding: '6px 12px', borderRadius: 99, whiteSpace: 'nowrap',
                  border: `1px solid ${circle === c.id ? '#1C1917' : '#EDE8E0'}`,
                  background: circle === c.id ? '#1C1917' : 'transparent',
                  color: circle === c.id ? '#fff' : '#A8A29E',
                  cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
                }}>{c.emoji} {c.label}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#57534E', fontFamily: font, cursor: 'pointer' }}>
              <input type="checkbox" checked={anon} onChange={e => setAnon(e.target.checked)} style={{ accentColor: '#B85C38' }} />
              Post anonymously
            </label>
            <button onClick={submit} disabled={!text.trim()} style={{
              background: text.trim() ? '#B85C38' : '#D4856A',
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '10px 24px', fontSize: 14, fontWeight: 600,
              fontFamily: font, cursor: text.trim() ? 'pointer' : 'not-allowed',
              opacity: text.trim() ? 1 : 0.5,
            }}>Post</button>
          </div>
        </div>
      </div>
    </div>
  )
}
