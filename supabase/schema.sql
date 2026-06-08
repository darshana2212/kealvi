-- =========================
-- CLEAN Q&A SCHEMA (Day 5 style simplified)
-- =========================

-- Drop existing tables safely
drop table if exists votes;
drop table if exists questions cascade;
drop table if exists poll_votes;
drop table if exists poll_options;
drop table if exists polls;

-- =========================
-- QUESTIONS TABLE
-- =========================
create table questions (
  id uuid primary key default gen_random_uuid(),
  body text not null,
  author text,
  votes int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- index for faster sorting
create index questions_created_at_idx on questions(created_at desc);

-- =========================
-- VOTES TABLE (prevents double voting)
-- =========================
create table votes (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  voter_id text not null,
  created_at timestamptz default now(),
  unique(question_id, voter_id)
);

create index votes_question_id_idx on votes(question_id);

-- =========================
-- POLLS TABLE
-- =========================
create table polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  created_at timestamptz default now()
);

-- =========================
-- POLL OPTIONS
-- =========================
create table poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references polls(id) on delete cascade,
  option_text text not null,
  created_at timestamptz default now()
);

create index poll_options_poll_id_idx on poll_options(poll_id);

-- =========================
-- POLL VOTES
-- =========================
create table poll_votes (
  id uuid primary key default gen_random_uuid(),
  option_id uuid not null references poll_options(id) on delete cascade,
  voter_id text not null,
  created_at timestamptz default now(),
  unique(option_id, voter_id)
);

create index poll_votes_option_id_idx on poll_votes(option_id);

-- =========================
-- SEED DATA (optional)
-- =========================
insert into questions (body, author, votes, created_at)
values
('How do I deploy a Next.js app?', 'Priya', 0, now()),
('What is Supabase used for?', 'Amit', 0, now()),
('How does authentication work in web apps?', 'Sara', 0, now());