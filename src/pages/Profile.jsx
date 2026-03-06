import { useState } from 'react'
import { useAppState } from '../App'
import PostCard from '../components/PostCard'
import { Card, SectionHeader } from '../components/UI'

export default function Profile() {
  const { posts, liked, reacted, likePost, replyPost, reactPost, user, profile, signOut } = useAppState()
  const [lang, setLang] = useState('EN')

  const savedPosts = posts.filter(p => liked[p.id])
  const myPosts = posts.filter(p => p.author === profile?.name || p.author === 'You')
  const initials = profile?.name ? profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'ME'

  return (
    <div>
      {/* Profile card */}
      <div style={{ background: '#FFFFFF', border: '1px solid #EDE8E0', borderRadius: 20, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #D4856A, #B85C38)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 20, fontWeight: 600,
          }}>{initials}</div>
          <div>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 22, fontWeight: 600, color: '#1C1917' }}>
              {profile?.name || 'You'}
            </p>
            {profile?.city && <p style={{ fontSize: 12, color: '#A8A29E', fontFamily: 'DM Sans, sans-serif', marginTop: 2 }}>{profile.city}</p>}
            {profile?.email && <p style={{ fontSize: 11, color: '#A8A29E', fontFamily: 'DM Sans, sans-serif', marginTop: 2 }}>{profile.email}</p>}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 16, paddingTop: 16, borderTop: '1px solid #EDE8E0', textAlign: 'center' }}>
          {[{ v: myPosts.length, l: 'Posts' }, { v: savedPosts.length, l: 'Saved' }].map(s => (
            <div key={s.l}>
              <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 20, fontWeight: 600, color: '#1C1917' }}>{s.v}</p>
              <p style={{ fontSize: 10, color: '#A8A29E', fontFamily: 'DM Sans, sans-serif', marginTop: 2 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Language */}
      <div style={{ background: '#FFFFFF', border: '1px solid #EDE8E0', borderRadius: 20, padding: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1C1917', fontFamily: 'DM Sans, sans-serif' }}>Language</p>
          <p style={{ fontSize: 11, color: '#A8A29E', fontFamily: 'DM Sans, sans-serif', marginTop: 2 }}>Switch app language</p>
        </div>
        <div style={{ display: 'flex', border: '1px solid #EDE8E0', borderRadius: 12, overflow: 'hidden' }}>
          {['EN', 'हिं'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: '8px 16px', border: 'none', cursor: 'pointer',
              fontSize: 13, fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
              background: lang === l ? '#1A1814' : '#FFFFFF',
              color: lang === l ? '#C9A84C' : '#A8A29E',
              transition: 'all 0.15s',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Saved posts */}
      <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 18, fontWeight: 600, color: '#1C1917', marginBottom: 12 }}>
        Saved Posts
      </p>
      {savedPosts.length === 0
        ? <div style={{ background: '#FFFFFF', border: '1px solid #EDE8E0', borderRadius: 20, padding: 24, textAlign: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: '#A8A29E', fontFamily: 'DM Sans, sans-serif' }}>Posts you ♥ will appear here.</p>
          </div>
        : savedPosts.map(p => (
          <PostCard key={p.id} post={p} liked={liked[p.id]} reacted={reacted[p.id]}
            onLike={likePost} onReply={replyPost} onReact={reactPost} />
        ))
      }

      {/* Settings */}
      <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 18, fontWeight: 600, color: '#1C1917', marginBottom: 12 }}>
        Settings
      </p>
      <div style={{ background: '#FFFFFF', border: '1px solid #EDE8E0', borderRadius: 20, overflow: 'hidden', marginBottom: 32 }}>
        {['Notifications', 'Privacy', 'About Noor'].map((item, i) => (
          <button key={item} style={{
            width: '100%', padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '1px solid #EDE8E0', fontFamily: 'DM Sans, sans-serif',
            fontSize: 13, fontWeight: 500, color: '#1C1917',
          }}>
            {item} <span style={{ color: '#A8A29E' }}>→</span>
          </button>
        ))}
        <button onClick={signOut} style={{
          width: '100%', padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, color: '#B85C38',
        }}>
          Sign out
        </button>
      </div>
    </div>
  )
}
