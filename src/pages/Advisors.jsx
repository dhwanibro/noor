import { useState } from 'react'
import { seedAdvisors } from '../data/seed'
import { Avatar, Card, Button, SectionHeader } from '../components/UI'
import BookingModal from '../components/BookingModal'

function AdvisorCard({ advisor, onView, onBook }) {
  return (
    <Card className="mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex gap-3 items-start">
          <Avatar initials={advisor.initials} size={48} />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-[15px] text-ink font-body">{advisor.name}</p>
                <p className="text-[11px] text-muted font-body mt-0.5">{advisor.title}</p>
              </div>
              <span className={`text-[10px] font-semibold font-body px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                advisor.available ? 'bg-sage-light text-sage' : 'bg-stone text-muted'
              }`}>
                {advisor.available ? '● Live' : '○ Busy'}
              </span>
            </div>
            <div className="flex gap-2 mt-2 items-center flex-wrap">
              <span className="text-[11px] bg-terra-light text-terra px-2 py-0.5 rounded-md font-semibold font-body">
                {advisor.specialty}
              </span>
              <span className="text-[11px] text-muted font-body">★ {advisor.rating} ({advisor.reviews})</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
          <Button variant="plain" onClick={() => onView(advisor)}>Posts & profile →</Button>
          <div className="flex gap-2.5 items-center">
            <span className="text-[13px] font-semibold text-ink font-body">{advisor.fee}</span>
            <Button
              variant="primary"
              onClick={() => onBook(advisor)}
              disabled={!advisor.available}
            >
              Book
            </Button>
          </div>
        </div>
      </div>

      {advisor.posts[0] && (
        <div className="border-t border-border px-4 py-3 bg-ivory">
          <p className="text-[10px] text-muted uppercase tracking-widest font-body mb-1.5">Latest tip</p>
          <p className="text-[12px] text-sub font-body leading-relaxed line-clamp-2">{advisor.posts[0].content}</p>
          <button onClick={() => onView(advisor)} className="text-[11px] text-terra font-body mt-1.5">Read more →</button>
        </div>
      )}
    </Card>
  )
}

function AdvisorProfile({ advisor, onBack, onBook, apLiked, toggleApLike }) {
  return (
    <div className="animate-fade-up">
      <div className="px-4 py-3.5 border-b border-border bg-surface flex items-center gap-3 sticky top-0 z-10">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <p className="font-semibold text-[15px] text-ink font-body">{advisor.name}</p>
      </div>
      <div className="px-4 pt-4">
        <Card className="p-4 mb-4">
          <div className="flex gap-3 items-center">
            <Avatar initials={advisor.initials} size={52} />
            <div>
              <p className="font-semibold text-[16px] text-ink font-body">{advisor.name}</p>
              <p className="text-xs text-muted font-body">{advisor.title}</p>
              <p className="text-xs text-muted font-body mt-0.5">★ {advisor.rating} · {advisor.reviews} reviews · {advisor.fee}</p>
            </div>
          </div>
          {advisor.bio && (
            <p className="text-[13px] text-sub font-body leading-relaxed mt-3 pt-3 border-t border-border">{advisor.bio}</p>
          )}
          <Button
            variant="primary"
            fullWidth
            onClick={() => onBook(advisor)}
            disabled={!advisor.available}
            className="mt-4"
          >
            {advisor.available ? `Book a Session · ${advisor.fee}` : 'Currently Unavailable'}
          </Button>
        </Card>

        <SectionHeader label="Tips & Posts" />
        {advisor.posts.map(p => (
          <Card key={p.id} className="p-4 mb-3">
            <div className="flex justify-between mb-2">
              <span className="text-[11px] text-muted font-body">{p.time}</span>
              <span className="text-[10px] bg-terra-light text-terra px-2 py-0.5 rounded-full font-semibold font-body">
                Advisor Tip
              </span>
            </div>
            <p className="text-[13px] text-sub font-body leading-relaxed">{p.content}</p>
            <button
              onClick={() => toggleApLike(p.id)}
              className={`mt-3 text-xs font-body ${apLiked[p.id] ? 'text-terra font-semibold' : 'text-muted'}`}
            >
              {apLiked[p.id] ? '♥' : '♡'} {p.likes + (apLiked[p.id] ? 1 : 0)} found helpful
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function Advisors() {
  const [selected, setSelected] = useState(null)
  const [booking, setBooking] = useState(null)
  const [apLiked, setApLiked] = useState({})

  const toggleApLike = id => setApLiked(l => ({ ...l, [id]: !l[id] }))

  if (selected) {
    return (
      <AdvisorProfile
        advisor={selected}
        onBack={() => setSelected(null)}
        onBook={a => { setBooking(a); setSelected(null) }}
        apLiked={apLiked}
        toggleApLike={toggleApLike}
      />
    )
  }

  return (
    <div className="animate-fade-up px-4 pt-5">
      <h1 className="font-display text-[22px] font-semibold text-ink mb-1">Advisors</h1>
      <p className="text-[13px] text-muted font-body mb-5">Verified experts — book sessions or read their tips</p>

      {seedAdvisors.map(a => (
        <AdvisorCard
          key={a.id}
          advisor={a}
          onView={setSelected}
          onBook={a => { setBooking(a) }}
        />
      ))}

      <BookingModal advisor={booking} onClose={() => setBooking(null)} />
    </div>
  )
}
