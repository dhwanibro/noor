import { useState, useRef, useEffect } from 'react'
import { Button } from './UI'

const SYSTEM = `You are a warm, empathetic AI companion inside "Amma" — an app built for single mothers in India. Your role is to listen without judgment, validate feelings, and offer gentle practical guidance. You understand the unique challenges: financial stress, social stigma, lack of support, childcare, loneliness. Speak like a trusted, knowing friend — warm, real, never preachy. Keep responses to 2–4 sentences. For money questions, occasionally suggest booking a financial advisor on the app.`

export default function AIChat({ open, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi 💙 I\'m here whenever you need to talk. What\'s on your mind today?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM,
          messages: updated,
        }),
      })
      const data = await res.json()
      const reply = data.content?.map(b => b.text || '').join('') || 'I\'m here with you. 💙'
      setMessages(m => [...m, { role: 'assistant', content: reply }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'I\'m here. Sometimes the connection drops, but I never do. 💙' }])
    }
    setLoading(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center animate-fade-in">
      <div className="bg-surface rounded-t-[28px] w-full max-w-[430px] flex flex-col" style={{ height: '82vh' }}>
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">Your Companion</h3>
            <p className="text-[11px] text-sage font-body mt-0.5">● Always here for you</p>
          </div>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[78%] px-4 py-2.5 text-[13px] font-body leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-terra text-white rounded-[18px] rounded-br-[4px]'
                    : 'bg-ivory border border-border text-ink rounded-[18px] rounded-bl-[4px]'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-ivory border border-border rounded-[18px] rounded-bl-[4px] px-5 py-3 text-lg text-muted tracking-widest">
                ···
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="px-4 pb-6 pt-3 border-t border-border flex gap-3 flex-shrink-0">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Say anything..."
            className="flex-1 border border-border rounded-xl px-4 py-3 text-base font-body text-ink bg-ivory focus:outline-none focus:border-terra-mid"
          />
          <button
            onClick={send}
            disabled={loading}
            className="bg-terra text-white rounded-xl px-5 text-base font-semibold disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
