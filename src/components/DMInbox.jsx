import { useState, useRef, useEffect } from 'react'
import { Avatar } from './UI'
import { supabase } from '../lib/supabase'
import { useAppState } from '../App'

const font = "'DM Sans', sans-serif"
const serif = "'Cormorant Garamond', Georgia, serif"

function Modal({ onClose, children, width = 480, height = 600 }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: width, height, maxHeight: 'calc(100vh - 48px)', background: '#FFFFFF', borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
        {children}
      </div>
    </div>
  )
}

function ModalHeader({ title, onClose, left }) {
  return (
    <div style={{ padding: '16px 20px', borderBottom: '1px solid #EDE8E0', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
      {left && <button onClick={left} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#A8A29E', padding: 0, lineHeight: 1 }}>←</button>}
      <span style={{ fontFamily: serif, fontSize: 18, fontWeight: 600, color: '#1C1917', flex: 1 }}>{title}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#A8A29E', fontFamily: font }}>Close</button>
    </div>
  )
}

// ── Thread ────────────────────────────────────────────────────────────────────
function DMThread({ dm, onBack, onClose }) {
  const { user, profile } = useAppState()
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    fetchMessages()
    const channel = supabase
      .channel(`dm-${dm.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${dm.id}` }, payload => {
        setMsgs(m => [...m, payload.new])
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [dm.id])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', dm.id)
      .order('created_at', { ascending: true })
    if (data) setMsgs(data)
  }

  const send = async () => {
    if (!input.trim()) return
    const text = input
    setInput('')
    await supabase.from('messages').insert({
      conversation_id: dm.id,
      sender_id: user.id,
      sender_name: profile?.name || 'You',
      text,
    })
  }

  return (
    <Modal onClose={onClose} height={600}>
      <ModalHeader title={dm.with} onClose={onClose} left={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.length === 0 && (
          <p style={{ textAlign: 'center', fontSize: 13, color: '#A8A29E', fontFamily: font, paddingTop: 40 }}>Say hello 👋</p>
        )}
        {msgs.map((m, i) => {
          const isMe = m.sender_id === user?.id
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '72%', padding: '10px 14px', borderRadius: 16,
                borderBottomRightRadius: isMe ? 4 : 16,
                borderBottomLeftRadius: isMe ? 16 : 4,
                background: isMe ? '#B85C38' : '#F5F0EA',
                color: isMe ? '#fff' : '#1C1917',
                fontSize: 13, fontFamily: font, lineHeight: 1.5,
              }}>{m.text}</div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>
      <div style={{ padding: '12px 16px', borderTop: '1px solid #EDE8E0', display: 'flex', gap: 10, flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Send a message..."
          style={{ flex: 1, border: '1.5px solid #EDE8E0', borderRadius: 12, padding: '10px 14px', fontSize: 16, fontFamily: font, color: '#1C1917', background: '#FAF8F5', outline: 'none' }}
        />
        <button onClick={send} style={{ background: '#B85C38', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 16px', fontSize: 14, fontFamily: font, cursor: 'pointer' }}>→</button>
      </div>
    </Modal>
  )
}

// ── Inbox ─────────────────────────────────────────────────────────────────────
export default function DMInbox({ open, onClose, initialDM }) {
  const { user } = useAppState()
  const [conversations, setConversations] = useState([])
  const [active, setActive] = useState(null)

  useEffect(() => { if (initialDM) setActive(initialDM) }, [initialDM])
  useEffect(() => { if (!open) setActive(null) }, [open])
  useEffect(() => { if (open && user) fetchConversations() }, [open, user])

  const fetchConversations = async () => {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order('updated_at', { ascending: false })
    if (data) setConversations(data.map(c => ({
      id: c.id,
      with: c.user1_id === user.id ? c.user2_name : c.user1_name,
      initials: (c.user1_id === user.id ? c.user2_name : c.user1_name)?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?',
      lastMsg: c.last_message || '',
      time: timeAgo(c.updated_at),
      unread: 0,
    })))
  }

  if (!open && !active) return null

  if (active) {
    return <DMThread dm={active} onBack={() => setActive(null)} onClose={() => { setActive(null); onClose() }} />
  }

  return (
    <Modal onClose={onClose} height={500}>
      <ModalHeader title="Messages" onClose={onClose} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {conversations.length === 0 && (
          <p style={{ textAlign: 'center', fontSize: 13, color: '#A8A29E', fontFamily: font, padding: '40px 20px' }}>No messages yet. Connect with someone from the community!</p>
        )}
        {conversations.map((dm, i) => (
          <button key={dm.id} onClick={() => setActive(dm)} style={{
            width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
            borderBottom: i < conversations.length - 1 ? '1px solid #EDE8E0' : 'none',
            background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#FAF8F5'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <Avatar initials={dm.initials} size={42} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1C1917', fontFamily: font, margin: 0 }}>{dm.with}</p>
              <p style={{ fontSize: 12, color: '#A8A29E', fontFamily: font, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dm.lastMsg}</p>
            </div>
            <span style={{ fontSize: 11, color: '#A8A29E', fontFamily: font, flexShrink: 0 }}>{dm.time}</span>
          </button>
        ))}
      </div>
    </Modal>
  )
}

function timeAgo(ts) {
  if (!ts) return ''
  const diff = (Date.now() - new Date(ts)) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
