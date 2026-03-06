import { useState } from 'react'
import { Avatar, Tag, Card } from './UI'
import { useAppState } from '../App'

const REACTIONS = [
  { key: 'relate',   label: 'I relate',        emoji: '🤍' },
  { key: 'strength', label: "You've got this",  emoji: '💪' },
  { key: 'love',     label: 'Sending love',     emoji: '🫂' },
]

const CIRCLES_MAP = {
  Mumbai: '🌊 Mumbai', Delhi: '🏛️ Delhi', Bengaluru: '🌿 Bengaluru',
  Pune: '☕ Pune', Hyderabad: '💎 Hyderabad', Money: '💰 Money',
  Career: '📈 Career', 'Co-parenting': '🤝 Co-parenting',
  'Dating Again': '🌸 Dating Again', School: '🎒 School', Wellness: '🧘 Wellness',
}

function ReplyBox({ onSubmit, onCancel }) {
  const [text, setText] = useState('')
  return (
    <div className="mt-2 animate-fade-in">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write a reply..."
        rows={2}
        className="w-full border border-border rounded-xl px-3 py-2 text-base font-body text-ink bg-ivory resize-none focus:outline-none focus:border-terra-mid"
      />
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={onCancel}
          className="border border-border text-sub text-sm font-body font-medium px-3 py-1.5 rounded-xl bg-surface">
          Cancel
        </button>
        <button onClick={() => { if (text.trim()) { onSubmit(text); setText('') } }}
          className="bg-terra text-white text-sm font-semibold font-body px-3 py-1.5 rounded-xl">
          Reply
        </button>
      </div>
    </div>
  )
}

export default function PostCard({ post, liked, reacted, onLike, onReply, onReact }) {
  const { openDM } = useAppState()
  const [replyOpen, setReplyOpen] = useState(false)
  const [reactOpen, setReactOpen] = useState(false)

  const handleDM = () => {
    openDM({ id: post.id, with: post.author, initials: post.initials, lastMsg: '', time: 'Now' })
  }

  return (
    <Card className="p-4 mb-3">
      {/* Author row */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2.5 items-center">
          <Avatar initials={post.anonymous ? '?' : post.initials} size={38} />
          <div>
            <p className="font-semibold text-[13px] text-ink font-body">
              {post.anonymous ? 'Anonymous' : post.author}
            </p>
            <p className="text-[11px] text-muted font-body">
              {!post.anonymous && post.city ? `${post.city} · ` : ''}{post.time}
              {post.circle && post.circle !== 'all' && (
                <span className="ml-1.5 text-[10px] bg-gold-light text-[#92680A] px-1.5 py-0.5 rounded-full font-medium">
                  {CIRCLES_MAP[post.circle] || post.circle}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tag label={post.tag} />
          {/* DM button — only on non-anonymous posts */}
          {!post.anonymous && (
            <button
              onClick={handleDM}
              className="text-muted hover:text-terra transition-colors p-1"
              title={`Message ${post.author}`}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M13.5 7.5c0 3.314-2.686 6-6 6a5.97 5.97 0 01-3-.8L1.5 13.5l.8-3A5.97 5.97 0 011.5 7.5c0-3.314 2.686-6 6-6s6 2.686 6 6z"
                  stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-[13px] text-sub font-body leading-relaxed mb-3">{post.content}</p>

      {/* Reaction counts */}
      {post.reactions && (
        <div className="flex gap-3 mb-3">
          {REACTIONS.map(r => {
            const count = (post.reactions[r.key] || 0) + (reacted?.[r.key] ? 1 : 0)
            return count > 0 ? (
              <span key={r.key} className="text-[11px] text-muted font-body">{r.emoji} {count}</span>
            ) : null
          })}
        </div>
      )}

      {/* Replies */}
      {post.replies.length > 0 && (
        <div className="border-t border-border pt-3 mb-3 space-y-2">
          {post.replies.map((r, i) => (
            <p key={i} className="text-xs text-sub font-body">
              <span className="font-semibold text-ink">{r.author}</span>: {r.text}
              <span className="text-muted ml-2">· {r.time}</span>
            </p>
          ))}
        </div>
      )}

      {replyOpen && (
        <ReplyBox
          onSubmit={text => { onReply(post.id, text); setReplyOpen(false) }}
          onCancel={() => setReplyOpen(false)}
        />
      )}

      {/* Reaction picker */}
      {reactOpen && (
        <div className="flex gap-2 mb-3 animate-fade-in flex-wrap">
          {REACTIONS.map(r => (
            <button key={r.key}
              onClick={() => { onReact(post.id, r.key); setReactOpen(false) }}
              className={`flex items-center gap-1.5 text-xs font-body px-3 py-1.5 rounded-full border transition-colors
                ${reacted?.[r.key] ? 'bg-terra-light border-terra/30 text-terra' : 'bg-ivory border-border text-sub'}`}>
              {r.emoji} {r.label}
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-3 border-t border-border">
        <button onClick={() => onLike(post.id)}
          className={`text-xs font-body transition-colors ${liked ? 'text-terra font-semibold' : 'text-muted'}`}>
          {liked ? '♥' : '♡'} {post.hearts + (liked ? 1 : 0)}
        </button>
        <button onClick={() => setReactOpen(r => !r)} className="text-xs text-muted font-body">
          ✦ React
        </button>
        <button onClick={() => setReplyOpen(r => !r)} className="text-xs text-muted font-body">
          💬 {post.replies.length}
        </button>
      </div>
    </Card>
  )
}
