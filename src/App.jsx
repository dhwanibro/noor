import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { CIRCLES } from './data/seed'
import Community from './pages/Community'
import Profile from './pages/Profile'
import AIChat from './components/AIChat'
import DMInbox from './components/DMInbox'
import ComposeModal from './components/ComposeModal'
import Onboarding from './components/Onboarding'
import NoorLogo from './components/NoorLogo'

const AppContext = createContext(null)
export const useAppState = () => useContext(AppContext)

const NAV = [
  { id: 'community', label: 'Community', Icon: CommunityIcon },
  { id: 'profile',   label: 'Profile',   Icon: ProfileIcon },
]

export default function App() {
  const [user, setUser]               = useState(null)
  const [profile, setProfile]         = useState(null)
  const [tab, setTab]                 = useState('community')
  const [posts, setPosts]             = useState([])
  const [liked, setLiked]             = useState({})
  const [reacted, setReacted]         = useState({})
  const [chatOpen, setChatOpen]       = useState(false)
  const [dmOpen, setDmOpen]           = useState(false)
  const [dmTarget, setDmTarget]       = useState(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [joinedCircles, setJoinedCircles] = useState(['Mumbai', 'Money', 'Career'])
  const [loading, setLoading]         = useState(true)

  // ── Auth listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  // ── Fetch profile ──────────────────────────────────────────────────────────
  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) {
      setProfile(data)
      if (data.joined_circles?.length) setJoinedCircles(data.joined_circles)
    }
    setLoading(false)
  }

  // ── Fetch posts ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    fetchPosts()

    const channel = supabase
      .channel('posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, payload => {
        setPosts(ps => [formatPost(payload.new), ...ps])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user])

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(name, city)')
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) setPosts(data.map(formatPost))
  }

  const formatPost = (p) => ({
    id: p.id,
    author: p.anonymous ? 'Anonymous' : (p.profiles?.name || p.author_name || 'Someone'),
    city: p.anonymous ? '' : (p.profiles?.city || ''),
    time: timeAgo(p.created_at),
    initials: p.anonymous ? '?' : initials(p.profiles?.name || p.author_name || 'S'),
    content: p.content,
    hearts: p.hearts || 0,
    replies: p.replies || [],
    tag: p.tag,
    anonymous: p.anonymous,
    reactions: p.reactions || { relate: 0, strength: 0, love: 0 },
    circle: p.circle || 'all',
  })

  // ── Actions ────────────────────────────────────────────────────────────────
  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const likePost = async (id) => {
    const newLiked = { ...liked, [id]: !liked[id] }
    setLiked(newLiked)
    const delta = newLiked[id] ? 1 : -1
    setPosts(ps => ps.map(p => p.id === id ? { ...p, hearts: p.hearts + delta } : p))
    await supabase.from('posts').update({ hearts: posts.find(p => p.id === id)?.hearts + delta }).eq('id', id)
  }

  const replyPost = async (id, text) => {
    const post = posts.find(p => p.id === id)
    const newReply = { author: profile?.name || 'You', text, time: 'Just now' }
    const newReplies = [...(post.replies || []), newReply]
    setPosts(ps => ps.map(p => p.id === id ? { ...p, replies: newReplies } : p))
    await supabase.from('posts').update({ replies: newReplies }).eq('id', id)
  }

  const addPost = async ({ text, tag, anon, circle }) => {
    const { data, error } = await supabase.from('posts').insert({
      content: text,
      tag,
      anonymous: anon,
      circle: circle || 'all',
      hearts: 0,
      replies: [],
      reactions: { relate: 0, strength: 0, love: 0 },
      author_id: user.id,
      author_name: profile?.name || 'Someone',
    }).select('*, profiles(name, city)').single()

    if (data) setPosts(ps => [formatPost(data), ...ps])
  }

  const reactPost = async (postId, key) => {
    const newReacted = { ...reacted, [postId]: { ...reacted[postId], [key]: !reacted[postId]?.[key] } }
    setReacted(newReacted)
    const post = posts.find(p => p.id === postId)
    const delta = newReacted[postId][key] ? 1 : -1
    const newReactions = { ...post.reactions, [key]: (post.reactions[key] || 0) + delta }
    setPosts(ps => ps.map(p => p.id === postId ? { ...p, reactions: newReactions } : p))
    await supabase.from('posts').update({ reactions: newReactions }).eq('id', postId)
  }

  const joinCircle = async (id) => {
    const updated = joinedCircles.includes(id) ? joinedCircles : [...joinedCircles, id]
    setJoinedCircles(updated)
    await supabase.from('profiles').update({ joined_circles: updated }).eq('id', user.id)
  }

  const leaveCircle = async (id) => {
    const updated = joinedCircles.filter(x => x !== id)
    setJoinedCircles(updated)
    await supabase.from('profiles').update({ joined_circles: updated }).eq('id', user.id)
  }

  const openDM = target => { setDmTarget(target || null); setDmOpen(true) }

  const handleOnboardingComplete = async (u) => {
    // Profile is created in Onboarding — just set state
    setUser(u.supabaseUser)
    setProfile({ name: u.name, city: u.city, email: u.email })
    if (u.interests?.length) setJoinedCircles(u.interests)
  }

  const ctx = {
    posts, liked, reacted, likePost, replyPost, addPost, reactPost,
    user, profile, signOut, openDM,
    joinedCircles, joinCircle, leaveCircle,
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <NoorLogo size="lg" />
        <p style={{ marginTop: 16, fontSize: 13, color: '#A8A29E', fontFamily: 'DM Sans, sans-serif' }}>Loading…</p>
      </div>
    </div>
  )

  return (
    <>
      {!user ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <AppContext.Provider value={ctx}>
          <div className="app-shell">

            {/* Header */}
            <header className="app-header">
              <div className="header-inner">
                <NoorLogo size="sm" />
                <nav className="desktop-nav">
                  {NAV.map(({ id, label, Icon }) => (
                    <button key={id} onClick={() => setTab(id)} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
                      background: tab === id ? '#F5EDE8' : 'transparent',
                      color: tab === id ? '#B85C38' : '#A8A29E',
                      transition: 'all 0.15s',
                    }}>
                      <Icon active={tab === id} />
                      {label}
                    </button>
                  ))}
                  <button onClick={() => setComposeOpen(true)} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                    background: '#B85C38', color: 'white', marginLeft: 8,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    New post
                  </button>
                </nav>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => openDM(null)} style={{ position: 'relative', padding: 8, borderRadius: 12, background: 'none', border: 'none', cursor: 'pointer' }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M17.5 10c0 4.142-3.358 7.5-7.5 7.5a7.46 7.46 0 01-3.75-1L2.5 17.5l1-3.75A7.46 7.46 0 012.5 10C2.5 5.858 5.858 2.5 10 2.5s7.5 3.358 7.5 7.5z" stroke="#A8A29E" strokeWidth="1.4" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button onClick={() => setChatOpen(true)} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    fontSize: 11, fontWeight: 600, padding: '7px 12px',
                    borderRadius: 99, border: '1px solid rgba(201,168,76,0.3)',
                    background: '#1A1814', color: '#C9A84C', cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap',
                  }}>
                    Talk
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="3.5" stroke="#C9A84C" strokeWidth="1.2"/>
                      <circle cx="5" cy="5" r="1.5" fill="#C9A84C"/>
                    </svg>
                  </button>
                </div>
              </div>
            </header>

            {/* Main */}
            <main className="app-main">
              <div className="app-main-inner">
                <div className="main-content">
                  {tab === 'community' && <Community />}
                  {tab === 'profile'   && <Profile />}
                </div>
                <div className="sidebar-content">
                  <Sidebar />
                </div>
              </div>
            </main>

            {/* Mobile bottom nav */}
            <nav className="mobile-nav">
              <MobileNavBtn label="Community" active={tab === 'community'} onPress={() => setTab('community')}>
                <CommunityIcon active={tab === 'community'} />
              </MobileNavBtn>
              <div className="mobile-nav-compose">
                <button onClick={() => setComposeOpen(true)} style={{
                  width: 46, height: 46, borderRadius: '50%',
                  background: '#B85C38', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(184,92,56,0.45)',
                  marginTop: -16,
                }}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4v12M4 10h12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <MobileNavBtn label="Profile" active={tab === 'profile'} onPress={() => setTab('profile')}>
                <ProfileIcon active={tab === 'profile'} />
              </MobileNavBtn>
              <MobileNavBtn label="Talk" active={false} onPress={() => setChatOpen(true)}>
                <TalkIcon />
              </MobileNavBtn>
            </nav>

            <AIChat open={chatOpen} onClose={() => setChatOpen(false)} />
            <DMInbox open={dmOpen} onClose={() => { setDmOpen(false); setDmTarget(null) }} initialDM={dmTarget} />
            <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} />
          </div>
        </AppContext.Provider>
      )}
    </>
  )
}

// ── Explore modal ─────────────────────────────────────────────────────────────
export function ExploreCirclesModal({ onClose }) {
  const { joinedCircles, joinCircle, leaveCircle } = useAppState()
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 460, maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #EDE8E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 20, fontWeight: 600, color: '#1C1917', margin: 0 }}>All Circles</h3>
          <button onClick={onClose} style={{ fontSize: 13, color: '#A8A29E', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Close</button>
        </div>
        <div style={{ overflowY: 'auto', padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {CIRCLES.filter(c => c.id !== 'all').map(c => {
            const isJoined = joinedCircles.includes(c.id)
            return (
              <div key={c.id} style={{ padding: 16, borderRadius: 14, border: `1px solid ${isJoined ? '#B85C38' : '#EDE8E0'}`, background: isJoined ? '#FFF8F5' : '#FAFAFA' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{c.emoji}</div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1C1917', fontFamily: 'DM Sans, sans-serif', margin: '0 0 10px' }}>{c.label}</p>
                {isJoined
                  ? <button onClick={() => leaveCircle(c.id)} style={{ fontSize: 11, color: '#A8A29E', background: 'none', border: '1px solid #EDE8E0', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Joined ✓</button>
                  : <button onClick={() => joinCircle(c.id)} style={{ fontSize: 11, color: '#B85C38', background: '#F5EDE8', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>+ Join</button>
                }
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar() {
  const { joinedCircles, leaveCircle } = useAppState()
  const [showExplore, setShowExplore] = useState(false)
  const joined = CIRCLES.filter(c => joinedCircles.includes(c.id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #EDE8E0', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 16, fontWeight: 600, color: '#1C1917', margin: 0 }}>Your Circles</p>
          <button onClick={() => setShowExplore(true)} style={{ fontSize: 11, fontWeight: 600, color: '#B85C38', fontFamily: 'DM Sans, sans-serif', background: '#F5EDE8', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}>Explore</button>
        </div>
        {joined.length === 0 && (
          <p style={{ padding: '12px 20px 16px', fontSize: 12, color: '#A8A29E', fontFamily: 'DM Sans, sans-serif' }}>No circles joined yet.</p>
        )}
        {joined.map(c => (
          <div key={c.id} style={{ padding: '10px 20px', borderTop: '1px solid #EDE8E0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1C1917', fontFamily: 'DM Sans, sans-serif' }}>
            <span>{c.emoji}</span>
            <span style={{ flex: 1 }}>{c.label}</span>
            <button onClick={() => leaveCircle(c.id)} style={{ fontSize: 10, color: '#A8A29E', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Leave</button>
          </div>
        ))}
      </div>
      {showExplore && <ExploreCirclesModal onClose={() => setShowExplore(false)} />}
    </div>
  )
}

// ── Mobile nav button ─────────────────────────────────────────────────────────
function MobileNavBtn({ label, active, onPress, children }) {
  return (
    <button className="mobile-nav-btn" onClick={onPress}>
      {children}
      <span className="mobile-nav-label" style={{ color: active ? '#B85C38' : '#A8A29E', fontWeight: active ? 600 : 400 }}>{label}</span>
    </button>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function timeAgo(ts) {
  if (!ts) return ''
  const diff = (Date.now() - new Date(ts)) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function CommunityIcon({ active }) {
  const c = active ? '#B85C38' : '#A8A29E'
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="7" cy="7" r="3" stroke={c} strokeWidth="1.5"/>
    <circle cx="13" cy="7" r="3" stroke={c} strokeWidth="1.5"/>
    <path d="M1 17c0-3 2.5-5 6-5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M19 17c0-3-2.5-5-6-5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 13c2.5 0 4.5 1.5 4.5 4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 13c-2.5 0-4.5 1.5-4.5 4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
}
function ProfileIcon({ active }) {
  const c = active ? '#B85C38' : '#A8A29E'
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="6.5" r="3.5" stroke={c} strokeWidth="1.5"/>
    <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
}
function TalkIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="7" stroke="#A8A29E" strokeWidth="1.5"/>
    <circle cx="10" cy="10" r="3" stroke="#C9A84C" strokeWidth="1.5"/>
    <circle cx="10" cy="10" r="1" fill="#C9A84C"/>
  </svg>
}
