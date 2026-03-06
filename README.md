# अम्मा · Amma

> For India's strongest women — community, financial guidance, and support for single mothers.

## Stack
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Claude API (AI Companion)

## Getting started

```bash
cd /Users/dhwanibalchandani/Developer/amma
npm install
npm run dev
```

App runs at http://localhost:5173

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect the `/Users/dhwanibalchandani/Developer/amma` folder in the Vercel dashboard — it will auto-detect Vite.

## Project structure

```
src/
  App.jsx           # Root, global state, layout, bottom nav
  pages/
    Home.jsx        # Dashboard
    Community.jsx   # Feed, compose, anonymous posting
    Advisors.jsx    # Advisor cards, profiles, booking
    Resources.jsx   # Govt schemes, SIP calculator, job board, helplines
    Profile.jsx     # User profile, saved posts, language toggle
  components/
    UI.jsx          # Avatar, Tag, Card, Button, Modal, Chip, SectionHeader
    PostCard.jsx    # Community post with replies
    AIChat.jsx      # Claude-powered chat drawer
    BookingModal.jsx# Advisor booking flow
  data/
    seed.js         # All mock data (posts, advisors, schemes, jobs, helplines)
```

## Monetisation hooks
- **Advisor bookings** — commission per session booked via the app
- **Sponsor banner** — Home page (currently SBI Life placeholder)
- **Job board** — affiliate / listing fee per job post

## Notes
- AI Companion uses the Anthropic API — the API key is injected automatically by the Claude.ai environment. For production, set `VITE_ANTHROPIC_API_KEY` and pass it in `AIChat.jsx`.
- All data is currently in-memory (seed.js). Replace with Supabase or Firebase for persistence.
