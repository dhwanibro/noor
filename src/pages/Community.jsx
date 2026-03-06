import { useState } from 'react'
import { useAppState } from '../App'
import { ExploreCirclesModal } from '../App'
import PostCard from '../components/PostCard'
import { CIRCLES } from '../data/seed'

const TAGS = ['All', 'Venting', 'Win', 'Help', 'Advice']
const font = "'DM Sans', sans-serif"
const serif = "'Cormorant Garamond', Georgia, serif"

function Chip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 12, fontFamily: font, fontWeight: 500,
      padding: '6px 14px', borderRadius: 99, whiteSpace: 'nowrap', flexShrink: 0,
      border: `1px solid ${active ? '#1C1917' : '#EDE8E0'}`,
      background: active ? '#1C1917' : '#FFFFFF',
      color: active ? '#fff' : '#A8A29E',
      cursor: 'pointer', transition: 'all 0.12s',
    }}>{label}</button>
  )
}

export default function Community() {
  const { posts, liked, reacted, likePost, replyPost, reactPost, joinedCircles, joinCircle, leaveCircle } = useAppState()
  const [activeCircle, setActiveCircle] = useState('all')
  const [activeTag, setActiveTag] = useState('All')
  const [view, setView] = useState('feed')
  const [showExplore, setShowExplore] = useState(false)

  // Feed chips: All + joined circles only + Explore button
  const feedCircleOptions = [
    { id: 'all', label: '✦ All', emoji: '' },
    ...CIRCLES.filter(c => c.id !== 'all' && joinedCircles.includes(c.id)),
  ]

  // If the active circle was left, reset to all
  const safeCircle = activeCircle === 'all' || joinedCircles.includes(activeCircle) ? activeCircle : 'all'

  const filtered = posts.filter(p => {
    const circleMatch = safeCircle === 'all' || p.circle === safeCircle
    const tagMatch = activeTag === 'All' || p.tag === activeTag
    return circleMatch && tagMatch
  })

  const joinedList = CIRCLES.filter(c => joinedCircles.includes(c.id))
  const exploreList = CIRCLES.filter(c => c.id !== 'all' && !joinedCircles.includes(c.id))

  return (
    <div>
      <h1 style={{ fontFamily: serif, fontSize: 26, fontWeight: 600, color: '#1C1917', marginBottom: 16 }}>
        Community
      </h1>

      {/* Feed / Circles toggle */}
      <div style={{ display: 'flex', gap: 4, background: '#EDE8E0', borderRadius: 14, padding: 4, marginBottom: 20 }}>
        {['feed', 'circles'].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 500, fontFamily: font,
            background: view === v ? '#FFFFFF' : 'transparent',
            color: view === v ? '#1C1917' : '#A8A29E',
            boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s', textTransform: 'capitalize',
          }}>
            {v === 'feed' ? 'Feed' : 'Circles'}
          </button>
        ))}
      </div>

      {/* ── FEED VIEW ── */}
      {view === 'feed' && (
        <div>
          {/* Circle filter chips — only joined + All */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 8 }}>
            {feedCircleOptions.map(c => (
              <Chip
                key={c.id}
                label={c.id === 'all' ? '✦ All' : `${c.emoji} ${c.label}`}
                active={safeCircle === c.id}
                onClick={() => setActiveCircle(c.id)}
              />
            ))}
            {/* Explore chip always at the end */}
            <button onClick={() => setShowExplore(true)} style={{
              fontSize: 12, fontFamily: font, fontWeight: 500,
              padding: '6px 14px', borderRadius: 99, whiteSpace: 'nowrap', flexShrink: 0,
              border: '1px dashed #EDE8E0', background: 'transparent',
              color: '#A8A29E', cursor: 'pointer',
            }}>＋ Explore</button>
          </div>

          {/* Tag filter chips */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 16 }}>
            {TAGS.map(t => (
              <Chip key={t} label={t === 'Win' ? 'Win 🎉' : t} active={activeTag === t} onClick={() => setActiveTag(t)} />
            ))}
          </div>

          {filtered.length === 0
            ? <p style={{ textAlign: 'center', color: '#A8A29E', padding: '40px 0', fontFamily: font }}>No posts here yet. Be the first 🌱</p>
            : filtered.map(p => (
              <PostCard key={p.id} post={p} liked={liked[p.id]} reacted={reacted[p.id]}
                onLike={likePost} onReply={replyPost} onReact={reactPost} />
            ))
          }
        </div>
      )}

      {/* ── CIRCLES VIEW ── */}
      {view === 'circles' && (
        <div>
          {/* Joined circles */}
          <p style={{ fontSize: 11, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: font, marginBottom: 12 }}>
            Your Circles
          </p>
          {joinedList.length === 0 ? (
            <p style={{ fontSize: 13, color: '#A8A29E', fontFamily: font, marginBottom: 24 }}>
              You haven't joined any circles yet. Explore below to get started.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 28 }}>
              {joinedList.map(c => (
                <div key={c.id} style={{
                  padding: 16, borderRadius: 16,
                  border: '1.5px solid #B85C38',
                  background: '#FFF8F5',
                  position: 'relative',
                }}>
                  <button
                    onClick={() => { setActiveCircle(c.id); setView('feed') }}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', width: '100%' }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{c.emoji}</div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#B85C38', fontFamily: font, margin: 0 }}>{c.label}</p>
                  </button>
                  <button onClick={() => leaveCircle(c.id)} style={{
                    position: 'absolute', top: 10, right: 10,
                    fontSize: 10, color: '#A8A29E', background: 'none', border: 'none', cursor: 'pointer', fontFamily: font,
                  }}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Explore unjoined */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: font, margin: 0 }}>
              Explore
            </p>
          </div>
          {exploreList.length === 0 ? (
            <p style={{ fontSize: 13, color: '#A8A29E', fontFamily: font }}>You've joined all available circles!</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
              {exploreList.map(c => (
                <div key={c.id} style={{ padding: 16, borderRadius: 16, border: '1px solid #EDE8E0', background: '#FFFFFF' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{c.emoji}</div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1C1917', fontFamily: font, margin: '0 0 10px' }}>{c.label}</p>
                  <button onClick={() => joinCircle(c.id)} style={{
                    fontSize: 11, color: '#B85C38', background: '#F5EDE8',
                    border: 'none', borderRadius: 8, padding: '5px 12px',
                    cursor: 'pointer', fontFamily: font, fontWeight: 600,
                  }}>+ Join</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showExplore && <ExploreCirclesModal onClose={() => setShowExplore(false)} />}
    </div>
  )
}
