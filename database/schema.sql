create table templates (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table batches (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table batch_messages (
  id uuid default uuid_generate_v4() primary key,
  batch_id uuid references batches(id) on delete cascade,
  sender_first_name text,
  sender_last_name text,
  sender_email text,
  sender_state text,
  content text not null,
  response_content text,
  responded_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);