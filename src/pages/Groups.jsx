import { useState } from 'react'
import { Card, Avatar } from '../components/UI'

const seedGroups = [
  { id: 1, name: 'Mumbai Single Moms', emoji: '🌊', members: 142, desc: 'A local circle for moms in Mumbai — meetups, tips, and chai.', joined: true },
  { id: 2, name: 'Back to Work', emoji: '💼', members: 89, desc: 'For moms returning to work or switching careers. Resume help, job leads.', joined: true },
  { id: 3, name: 'Co-parenting Support', emoji: '🤝', members: 214, desc: 'Navigating shared custody, legal questions, and communication with exes.', joined: false },
  { id: 4, name: 'School Admissions 2025', emoji: '🎒', members: 67, desc: 'Tips, experiences, and help for school admissions this year.', joined: false },
  { id: 5, name: 'Dating Again', emoji: '🌸', members: 53, desc: 'A safe, non-judgmental space to talk about relationships after divorce.', joined: false },
  { id: 6, name: 'Money & Investing', emoji: '💰', members: 178, desc: 'SIPs, savings, budgeting, and building wealth as a single mom.', joined: false },
]

const seedGroupMsgs = [
  { id: 1, author: 'Divya R.', initials: 'DR', text: 'Has anyone tried the Zerodha SIP feature? Worth it?', time: '2m ago' },
  { id: 2, author: 'Preethi K.', initials: 'PK', text: "Yes! I've been using it for 8 months. Happy to share my experience.", time: '5m ago' },
  { id: 3, author: 'Shruti M.', initials: 'SM', text: "What's the minimum SIP amount on Zerodha?", time: '12m ago' },
]

function GroupChat({ group, onBack }) {
  const [msgs, setMsgs] = useState(seedGroupMsgs)
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    setMsgs(m => [{ id: Date.now(), author: 'You', initials: 'Y', text: input, time: 'Just now' }, ...m])
    setInput('')
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="w-full max-w-[430px] bg-ivory flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-4 border-b border-border bg-surface flex items-center gap-3 flex-shrink-0">
          <button onClick={onBack} className="text-muted text-sm font-body mr-1">←</button>
          <span className="text-xl">{group.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[14px] text-ink font-body truncate">{group.name}</p>
            <p className="text-[11px] text-muted font-body">{group.members} members</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col-reverse gap-3 min-h-0">
          {msgs.map(m => (
            <div key={m.id} className={`flex gap-2.5 ${m.author === 'You' ? 'flex-row-reverse' : ''}`}>
              {m.author !== 'You' && <Avatar initials={m.initials} size={30} />}
              <div className="max-w-[75%]">
                {m.author !== 'You' && (
                  <p className="text-[10px] text-muted font-body mb-1 ml-1">{m.author}</p>
                )}
                <div className={`px-4 py-2.5 text-[13px] font-body leading-relaxed rounded-2xl
                  ${m.author === 'You'
                    ? 'bg-terra text-white rounded-br-sm'
                    : 'bg-surface border border-border text-ink rounded-bl-sm'}`}>
                  {m.text}
                </div>
                <p className={`text-[10px] text-muted font-body mt-1 ${m.author === 'You' ? 'text-right' : 'ml-1'}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-4 border-t border-border flex gap-3 bg-surface flex-shrink-0">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Message the group..."
            className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm font-body text-ink bg-ivory focus:outline-none"
          />
          <button onClick={send} className="bg-terra text-white rounded-xl px-4 text-sm font-semibold font-body">→</button>
        </div>
      </div>
    </div>
  )
}

export default function Groups() {
  const [groups, setGroups] = useState(seedGroups)
  const [activeGroup, setActiveGroup] = useState(null)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [tab, setTab] = useState('joined') // 'joined' | 'discover'

  const toggleJoin = id =>
    setGroups(gs => gs.map(g => g.id === id ? { ...g, joined: !g.joined, members: g.joined ? g.members - 1 : g.members + 1 } : g))

  const createGroup = () => {
    if (!newName.trim()) return
    setGroups(gs => [{ id: Date.now(), name: newName, emoji: '✨', members: 1, desc: newDesc, joined: true }, ...gs])
    setNewName(''); setNewDesc(''); setCreating(false)
  }

  const joined = groups.filter(g => g.joined)
  const discover = groups.filter(g => !g.joined)

  if (activeGroup) return <GroupChat group={activeGroup} onBack={() => setActiveGroup(null)} />

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-display text-[22px] font-semibold text-ink">Groups</h1>
        <button
          onClick={() => setCreating(true)}
          className="bg-terra text-white text-xs font-semibold font-body px-4 py-2 rounded-xl">
          + Create
        </button>
      </div>

      {/* Create group sheet */}
      {creating && (
        <Card className="p-4 mb-4 border-terra/20 animate-fade-in">
          <p className="text-[13px] font-semibold text-ink font-body mb-3">Create a group</p>
          <input value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="Group name"
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-body text-ink bg-ivory mb-3 focus:outline-none focus:border-terra-mid" />
          <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)}
            placeholder="What's it about? (optional)"
            rows={2}
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-body text-ink bg-ivory resize-none mb-3 focus:outline-none focus:border-terra-mid" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setCreating(false)}
              className="border border-border text-sub text-sm font-body font-medium px-3 py-2 rounded-xl bg-surface">Cancel</button>
            <button onClick={createGroup}
              className="bg-terra text-white text-sm font-semibold font-body px-4 py-2 rounded-xl">Create</button>
          </div>
        </Card>
      )}

      {/* Tab toggle */}
      <div className="flex gap-1 bg-stone rounded-xl p-1 mb-4">
        {['joined', 'discover'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 text-xs font-body font-medium py-1.5 rounded-lg transition-colors capitalize
              ${tab === t ? 'bg-surface text-ink shadow-sm' : 'text-muted'}`}>
            {t === 'joined' ? `My Groups (${joined.length})` : 'Discover'}
          </button>
        ))}
      </div>

      {/* Group list */}
      {(tab === 'joined' ? joined : discover).map(g => (
        <Card key={g.id} className="p-4 mb-3">
          <div className="flex gap-3 items-start">
            <div className="w-11 h-11 rounded-2xl bg-terra-light flex items-center justify-center text-xl flex-shrink-0">
              {g.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[14px] text-ink font-body">{g.name}</p>
              <p className="text-[11px] text-muted font-body mt-0.5">{g.members} members</p>
              <p className="text-[12px] text-sub font-body mt-1.5 leading-relaxed">{g.desc}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3 pt-3 border-t border-border">
            {g.joined && (
              <button onClick={() => setActiveGroup(g)}
                className="flex-1 bg-terra text-white text-xs font-semibold font-body py-2.5 rounded-xl">
                Open chat
              </button>
            )}
            <button
              onClick={() => toggleJoin(g.id)}
              className={`${g.joined ? 'flex-none px-4' : 'flex-1'} border text-xs font-semibold font-body py-2.5 rounded-xl transition-colors
                ${g.joined ? 'border-border text-muted' : 'border-terra text-terra'}`}>
              {g.joined ? 'Leave' : 'Join'}
            </button>
          </div>
        </Card>
      ))}

      {tab === 'joined' && joined.length === 0 && (
        <p className="text-center text-sm text-muted font-body py-10">You haven't joined any groups yet.<br/>Explore the Discover tab.</p>
      )}
    </div>
  )
}
