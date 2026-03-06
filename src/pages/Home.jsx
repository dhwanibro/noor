import { useAppState } from '../App'
import PostCard from '../components/PostCard'
import { SectionHeader, Card } from '../components/UI'

export default function Home({ setTab }) {
  const { posts, liked, reacted, likePost, replyPost, reactPost } = useAppState()

  return (
    <div className="animate-fade-up px-4 pt-5">
      <SectionHeader label="Latest Story" action="See all" onAction={() => setTab('community')} />
      <PostCard
        post={posts[0]}
        liked={liked[posts[0]?.id]}
        reacted={reacted[posts[0]?.id]}
        onLike={likePost}
        onReply={replyPost}
        onReact={reactPost}
      />

      <SectionHeader label="Expert Tip" action="All experts" onAction={() => setTab('experts')} />
      <Card className="p-4 mb-4">
        <div className="flex gap-2.5 items-center mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #D4856A, #B85C38)' }}>SP</div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-[13px] font-semibold text-ink font-body">Dr. Sneha Patel</p>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full flex-shrink-0"
                style={{ background: '#C9A84C' }}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4L3 5.5L6.5 2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            <p className="text-[11px] text-muted font-body">Family Therapist</p>
          </div>
        </div>
        <p className="text-[13px] text-sub font-body leading-relaxed">
          Guilt is the most common emotion single mothers carry. But guilt means you care deeply. The fact that you're questioning whether you're enough is proof that you are.
        </p>
      </Card>

      <div className="bg-[#FFFBF0] border border-[#EDE0B0] rounded-2xl p-4 flex gap-3 items-center mb-2">
        <span className="text-2xl">🏦</span>
        <div className="flex-1">
          <p className="text-[10px] text-muted font-body uppercase tracking-widest">Sponsored · SBI Life</p>
          <p className="text-[13px] font-semibold text-ink font-body mt-0.5">Special term plans for single mothers</p>
          <p className="text-[11px] text-terra font-body mt-1 cursor-pointer">Learn more →</p>
        </div>
      </div>
    </div>
  )
}
