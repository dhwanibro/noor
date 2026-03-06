import { useState } from 'react'
import { seedAdvisors } from '../data/seed'
import { Avatar, Card, Button, VerifiedBadge } from '../components/UI'
import BookingModal from '../components/BookingModal'

// ── Expert post card (interactive) ────────────────────────────────────────────
function ExpertPostCard({ post, expert }) {
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState([])
  const [commenting, setCommenting] = useState(false)
  const [input, setInput] = useState('')

  const submitComment = () => {
    if (!input.trim()) return
    setComments(c => [...c, { author: 'You', text: input, time: 'Just now' }])
    setInput('')
    setCommenting(false)
  }

  return (
    <Card className="p-4 mb-3">
      {/* Expert byline */}
      <div className="flex gap-2.5 items-center mb-3">
        <Avatar initials={expert.initials} size={34} />
        <div>
          <div className="flex items-center gap-1">
            <p className="text-[13px] font-semibold text-ink font-body">{expert.name}</p>
            {expert.verified && <VerifiedBadge />}
          </div>
          <p className="text-[10px] text-muted font-body">{expert.title} · {post.time}</p>
        </div>
        <span className="ml-auto text-[10px] bg-terra-light text-terra px-2 py-0.5 rounded-full font-semibold font-body flex-shrink-0">
          Expert Tip
        </span>
      </div>

      <p className="text-[13px] text-sub font-body leading-relaxed mb-3">{post.content}</p>

      {/* Comments */}
      {comments.length > 0 && (
        <div className="border-t border-border pt-3 mb-3 space-y-2">
          {comments.map((c, i) => (
            <p key={i} className="text-xs text-sub font-body">
              <span className="font-semibold text-ink">{c.author}</span>: {c.text}
              <span className="text-muted ml-2">· {c.time}</span>
            </p>
          ))}
        </div>
      )}

      {/* Comment input */}
      {commenting && (
        <div className="mb-3 animate-fade-in">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question or share your thoughts..."
            rows={2}
            className="w-full border border-border rounded-xl px-3 py-2 text-sm font-body text-ink bg-ivory resize-none focus:outline-none focus:border-terra-mid"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setCommenting(false)}
              className="border border-border text-sub text-xs font-body font-medium px-3 py-1.5 rounded-xl bg-surface">
              Cancel
            </button>
            <button onClick={submitComment}
              className="bg-terra text-white text-xs font-semibold font-body px-3 py-1.5 rounded-xl">
              Post
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-3 border-t border-border">
        <button onClick={() => setLiked(l => !l)}
          className={`text-xs font-body transition-colors ${liked ? 'text-terra font-semibold' : 'text-muted'}`}>
          {liked ? '♥' : '♡'} {post.likes + (liked ? 1 : 0)} helpful
        </button>
        <button onClick={() => setCommenting(c => !c)} className="text-xs text-muted font-body">
          💬 {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </button>
      </div>
    </Card>
  )
}

// ── Expert card ───────────────────────────────────────────────────────────────
function ExpertCard({ expert, onView, onBook }) {
  return (
    <Card className="mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex gap-3 items-start">
          <Avatar initials={expert.initials} size={48} />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-[15px] text-ink font-body">{expert.name}</p>
                  {expert.verified && <VerifiedBadge />}
                </div>
                <p className="text-[11px] text-muted font-body mt-0.5">{expert.title}</p>
              </div>
              <span className={`text-[10px] font-semibold font-body px-2 py-0.5 rounded-full flex-shrink-0
                ${expert.available ? 'bg-sage-light text-sage' : 'bg-stone text-muted'}`}>
                {expert.available ? '● Live' : '○ Busy'}
              </span>
            </div>
            <div className="flex gap-2 mt-2 items-center flex-wrap">
              <span className="text-[11px] bg-terra-light text-terra px-2 py-0.5 rounded-md font-semibold font-body">
                {expert.specialty}
              </span>
              <span className="text-[11px] text-muted font-body">★ {expert.rating} ({expert.reviews})</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
          <button onClick={() => onView(expert)} className="text-xs text-terra font-semibold font-body">
            View profile →
          </button>
          <div className="flex gap-2.5 items-center">
            <span className="text-[13px] font-semibold text-ink font-body">{expert.fee}</span>
            <Button variant="primary" onClick={() => onBook(expert)} disabled={!expert.available}>Book</Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

// ── Expert profile ────────────────────────────────────────────────────────────
function ExpertProfile({ expert, onBack, onBook }) {
  return (
    <div className="animate-fade-up">
      <div className="px-4 py-3.5 border-b border-border bg-surface flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}
          className="border border-border text-sub text-sm font-body font-medium px-3 py-1.5 rounded-xl bg-surface">
          ← Back
        </button>
        <div className="flex items-center gap-1">
          <p className="font-semibold text-[15px] text-ink font-body">{expert.name}</p>
          {expert.verified && <VerifiedBadge />}
        </div>
      </div>
      <div className="px-4 pt-4">
        <Card className="p-4 mb-4">
          <div className="flex gap-3 items-center">
            <Avatar initials={expert.initials} size={52} />
            <div>
              <div className="flex items-center gap-1">
                <p className="font-semibold text-[16px] text-ink font-body">{expert.name}</p>
                {expert.verified && <VerifiedBadge />}
              </div>
              <p className="text-xs text-muted font-body">{expert.title}</p>
              <p className="text-xs text-muted font-body mt-0.5">
                ★ {expert.rating} · {expert.reviews} reviews · {expert.fee}
              </p>
            </div>
          </div>
          {expert.bio && (
            <p className="text-[13px] text-sub font-body leading-relaxed mt-3 pt-3 border-t border-border">
              {expert.bio}
            </p>
          )}
          <Button variant="primary" fullWidth onClick={() => onBook(expert)} disabled={!expert.available} className="mt-4">
            {expert.available ? `Book a Session · ${expert.fee}` : 'Currently Unavailable'}
          </Button>
        </Card>

        <p className="font-display text-[17px] font-semibold text-ink mb-3">Tips & Posts</p>
        {expert.posts.map(p => (
          <ExpertPostCard key={p.id} post={p} expert={expert} />
        ))}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Experts() {
  const [subtab, setSubtab] = useState('feed') // 'feed' | 'find'
  const [selected, setSelected] = useState(null)
  const [booking, setBooking] = useState(null)

  // Flatten all expert posts into a single feed
  const allPosts = seedAdvisors.flatMap(a =>
    a.posts.map(p => ({ post: p, expert: a }))
  ).sort((a, b) => a.post.id - b.post.id)

  if (selected) {
    return (
      <>
        <ExpertProfile expert={selected} onBack={() => setSelected(null)} onBook={e => setBooking(e)} />
        <BookingModal advisor={booking} onClose={() => setBooking(null)} />
      </>
    )
  }

  return (
    <>
      <div className="animate-fade-up">
        <div className="mb-4">
          <h1 className="font-display text-[22px] font-semibold text-ink mb-4">Experts</h1>
          {/* Sub-tabs */}
          <div className="flex gap-1 bg-stone rounded-xl p-1">
            {[['feed', 'Tips Feed'], ['find', 'Find an Expert']].map(([id, label]) => (
              <button key={id} onClick={() => setSubtab(id)}
                className={`flex-1 text-xs font-body font-medium py-1.5 rounded-lg transition-colors
                  ${subtab === id ? 'bg-surface text-ink shadow-sm' : 'text-muted'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          {subtab === 'feed' && (
            <div className="animate-fade-in">
              {allPosts.map(({ post, expert }) => (
                <ExpertPostCard key={post.id} post={post} expert={expert} />
              ))}
            </div>
          )}

          {subtab === 'find' && (
            <div className="animate-fade-in">
              {seedAdvisors.map(a => (
                <ExpertCard key={a.id} expert={a} onView={setSelected} onBook={e => setBooking(e)} />
              ))}
            </div>
          )}
        </div>
      </div>

      <BookingModal advisor={booking} onClose={() => setBooking(null)} />
    </>
  )
}
