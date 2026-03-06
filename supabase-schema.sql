-- ══════════════════════════════════════════════════════════
-- NOOR — Supabase Schema
-- Paste this into Supabase > SQL Editor > Run
-- ══════════════════════════════════════════════════════════

-- 1. PROFILES
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  email text,
  city text,
  joined_circles text[] default array['Mumbai','Money','Career'],
  created_at timestamptz default now()
);

-- 2. POSTS
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete set null,
  author_name text,
  content text not null,
  tag text default 'Venting',
  circle text default 'all',
  anonymous boolean default false,
  hearts int default 0,
  replies jsonb default '[]',
  reactions jsonb default '{"relate":0,"strength":0,"love":0}',
  created_at timestamptz default now()
);

-- 3. CONVERSATIONS (DMs)
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid references auth.users(id) on delete cascade,
  user1_name text,
  user2_id uuid references auth.users(id) on delete cascade,
  user2_name text,
  last_message text,
  updated_at timestamptz default now()
);

-- 4. MESSAGES
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  sender_name text,
  text text not null,
  created_at timestamptz default now()
);

-- Auto-update conversation last_message on new message
create or replace function update_conversation_last_message()
returns trigger as $$
begin
  update conversations
  set last_message = new.text, updated_at = now()
  where id = new.conversation_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_message_insert on messages;
create trigger on_message_insert
  after insert on messages
  for each row execute procedure update_conversation_last_message();


-- ── ROW LEVEL SECURITY ─────────────────────────────────────

alter table profiles enable row level security;
alter table posts enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

-- Profiles
create policy "profiles_read_all"    on profiles for select using (true);
create policy "profiles_insert_own"  on profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own"  on profiles for update using (auth.uid() = id);

-- Posts: any authenticated user can read/insert/update (needed for likes & reactions)
create policy "posts_read_all"       on posts for select using (true);
create policy "posts_insert_auth"    on posts for insert to authenticated with check (auth.uid() = author_id);
create policy "posts_update_auth"    on posts for update to authenticated using (true);

-- Conversations
create policy "conversations_read"   on conversations for select using (auth.uid() = user1_id or auth.uid() = user2_id);
create policy "conversations_insert" on conversations for insert with check (auth.uid() = user1_id);
create policy "conversations_update" on conversations for update using (auth.uid() = user1_id or auth.uid() = user2_id);

-- Messages
create policy "messages_read" on messages for select using (
  exists (
    select 1 from conversations c
    where c.id = conversation_id
    and (c.user1_id = auth.uid() or c.user2_id = auth.uid())
  )
);
create policy "messages_insert" on messages for insert with check (auth.uid() = sender_id);


-- ── REALTIME ───────────────────────────────────────────────
alter publication supabase_realtime add table posts;
alter publication supabase_realtime add table messages;
