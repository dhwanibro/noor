export const seedPosts = [
  {
    id: 1, author: 'Meera S.', city: 'Mumbai', time: '2h ago', initials: 'MS',
    content: 'Today was one of those days where everything felt impossible. Dropped Arjun at school, got to work late, then the EMI didn\'t go through. Anyone else feel like they\'re juggling everything and still dropping it all?',
    hearts: 34, replies: [], tag: 'Venting', anonymous: false,
    reactions: { relate: 18, strength: 9, love: 7 },
    circle: 'Mumbai',
  },
  {
    id: 2, author: 'Divya R.', city: 'Hyderabad', time: '5h ago', initials: 'DR',
    content: 'Small win — finally opened a separate savings account just for Aarohi\'s education. Just ₹500 to start, but it\'s a start. 🌱 Someone here told me to just begin small. Thank you for that!',
    hearts: 87, replies: [], tag: 'Win', anonymous: false,
    reactions: { relate: 52, strength: 31, love: 44 },
    circle: 'Money',
  },
  {
    id: 3, author: 'Anonymous', city: '', time: '1d ago', initials: '?',
    content: 'Does anyone know if single mothers qualify for PM Awas Yojana? My landlord raised the rent and I\'m really stressed. Any help appreciated 🙏',
    hearts: 19, replies: [], tag: 'Help', anonymous: true,
    reactions: { relate: 23, strength: 5, love: 14 },
    circle: 'Co-parenting',
  },
  {
    id: 4, author: 'Shruti M.', city: 'Bengaluru', time: '2d ago', initials: 'SM',
    content: 'Three years of doing this alone. Three years of school runs, late nights, salary stretching. And today my daughter told her teacher her mum is her hero. That\'s enough. That\'s everything.',
    hearts: 204, replies: [], tag: 'Win', anonymous: false,
    reactions: { relate: 98, strength: 76, love: 130 },
    circle: 'Bengaluru',
  },
  {
    id: 5, author: 'Preethi K.', city: 'Chennai', time: '3d ago', initials: 'PK',
    content: 'Just got my first salary hike in 3 years. 22%. I cried in the office bathroom. This one\'s for every late night I stayed up after putting the kids to bed to upskill.',
    hearts: 311, replies: [], tag: 'Win', anonymous: false,
    reactions: { relate: 145, strength: 201, love: 167 },
    circle: 'Career',
  },
]

export const CIRCLES = [
  { id: 'all',         label: 'All',          emoji: '✦' },
  { id: 'Mumbai',      label: 'Mumbai',        emoji: '🌊' },
  { id: 'Delhi',       label: 'Delhi',         emoji: '🏛️' },
  { id: 'Bengaluru',   label: 'Bengaluru',     emoji: '🌿' },
  { id: 'Pune',        label: 'Pune',          emoji: '☕' },
  { id: 'Hyderabad',   label: 'Hyderabad',     emoji: '💎' },
  { id: 'Money',       label: 'Money',         emoji: '💰' },
  { id: 'Career',      label: 'Career',        emoji: '📈' },
  { id: 'Co-parenting',label: 'Co-parenting',  emoji: '🤝' },
  { id: 'Dating Again',label: 'Dating Again',  emoji: '🌸' },
  { id: 'School',      label: 'School & Kids', emoji: '🎒' },
  { id: 'Wellness',    label: 'Wellness',      emoji: '🧘' },
]

export const WEEKLY_PROMPT = {
  question: 'What\'s one thing you stopped apologising for this week?',
  date: 'This week\'s prompt',
}

export const seedAdvisors = [
  {
    id: 1, name: 'Priya Mehta', title: 'Certified Financial Planner',
    specialty: 'Savings & Insurance', rating: 4.9, reviews: 128,
    available: true, fee: '₹499/session', initials: 'PM', verified: true,
    bio: 'CFP with 11 years of experience specialising in financial planning for women and single-parent households. I believe financial security is a right, not a privilege.',
    posts: [
      { id: 101, content: 'Always keep 3 months of expenses as an emergency fund before investing anywhere. This is your safety net first — not a luxury, a necessity. 🛡️', time: '1h ago', likes: 42 },
      { id: 102, content: 'Sukanya Samriddhi Yojana gives 8.2% interest for your daughter\'s future. Open one today with just ₹250. One of the best government schemes for single mothers.', time: '3d ago', likes: 91 },
    ],
  },
  {
    id: 2, name: 'Sunita Rao', title: 'Investment Advisor',
    specialty: 'Mutual Funds & SIP', rating: 4.8, reviews: 94,
    available: true, fee: '₹399/session', initials: 'SR', verified: true,
    bio: 'SEBI-registered investment advisor focused on making wealth-building accessible to every woman, regardless of income level.',
    posts: [
      { id: 201, content: 'SIPs as low as ₹100/month can grow to lakhs in 15 years. Don\'t wait for the \'right time\' — start small, start now. Compounding works for everyone.', time: '6h ago', likes: 67 },
    ],
  },
  {
    id: 3, name: 'Kavitha Nair', title: 'Tax Consultant',
    specialty: 'ITR & Tax Savings', rating: 4.7, reviews: 76,
    available: false, fee: '₹599/session', initials: 'KN', verified: true,
    bio: 'CA with a focus on tax planning for salaried women and freelancers. I help you keep more of what you earn.',
    posts: [
      { id: 301, content: 'Section 80C allows you to save up to ₹46,800 in taxes annually. Filing ITR also makes it much easier to get loans. Two powerful reasons to file every year.', time: '2d ago', likes: 55 },
    ],
  },
  {
    id: 4, name: 'Dr. Sneha Patel', title: 'Family Therapist',
    specialty: 'Emotional Wellbeing', rating: 4.9, reviews: 203,
    available: true, fee: '₹799/session', initials: 'SP', verified: true,
    bio: 'Licensed therapist specialising in single-parent families, co-parenting conflict, and rebuilding identity after divorce or loss.',
    posts: [
      { id: 401, content: 'Guilt is the most common emotion single mothers carry. But guilt means you care deeply. The fact that you\'re questioning whether you\'re enough is proof that you are.', time: '4h ago', likes: 188 },
    ],
  },
]

export const seedDMs = [
  { id: 1, with: 'Divya R.', initials: 'DR', lastMsg: 'Thank you so much, that helped!', time: '10m ago', unread: 2 },
  { id: 2, with: 'Shruti M.', initials: 'SM', lastMsg: 'Which school did you finally choose?', time: '2h ago', unread: 0 },
  { id: 3, with: 'Preethi K.', initials: 'PK', lastMsg: 'Yes, let\'s connect this weekend 🌸', time: '1d ago', unread: 0 },
]

export const helplines = [
  { name: 'iCall', desc: 'Mental health support', number: '9152987821' },
  { name: 'WCD Helpline', desc: 'Women & child welfare', number: '181' },
  { name: 'National Legal Aid', desc: 'Free legal counsel', number: '15100' },
  { name: 'Childline', desc: 'Child safety', number: '1098' },
]
