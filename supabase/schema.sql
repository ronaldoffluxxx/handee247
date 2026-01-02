-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- LISTINGS Table
create table public.listings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  category text not null,
  type text check (type in ('offer', 'request')) not null,
  images text[], -- Array of image URLs
  status text default 'active' check (status in ('active', 'paused', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.listings enable row level security;

create policy "Listings are viewable by everyone."
  on listings for select
  using ( true );

create policy "Users can insert their own listings."
  on listings for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own listings."
  on listings for update
  using ( auth.uid() = user_id );

-- DEALS Table
create table public.deals (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  requester_id uuid references public.profiles(id) on delete cascade not null,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'proposed' check (status in ('proposed', 'accepted', 'in_progress', 'completed', 'cancelled')),
  terms text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.deals enable row level security;

create policy "Users can view their own deals."
  on deals for select
  using ( auth.uid() = requester_id or auth.uid() = owner_id );

create policy "Users can insert deals."
  on deals for insert
  with check ( auth.uid() = requester_id );

create policy "Users can update their own deals."
  on deals for update
  using ( auth.uid() = requester_id or auth.uid() = owner_id );

-- MESSAGES Table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  deal_id uuid references public.deals(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  type text default 'text' check (type in ('text', 'image', 'file')),
  read_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;

create policy "Users can view messages in their deals."
  on messages for select
  using ( exists (
    select 1 from deals
    where deals.id = messages.deal_id
    and (deals.requester_id = auth.uid() or deals.owner_id = auth.uid())
  ));

create policy "Users can insert messages in their deals."
  on messages for insert
  with check ( exists (
    select 1 from deals
    where deals.id = messages.deal_id
    and (deals.requester_id = auth.uid() or deals.owner_id = auth.uid())
  ));

-- REVIEWS Table
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  deal_id uuid references public.deals(id) on delete cascade not null,
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  reviewee_id uuid references public.profiles(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone."
  on reviews for select
  using ( true );

create policy "Users can insert reviews for their completed deals."
  on reviews for insert
  with check ( auth.uid() = reviewer_id );
