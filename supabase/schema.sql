-- 旅行紀錄器資料庫結構(可重複執行:已存在的物件會跳過或重建政策)
-- 請在 Supabase Dashboard → SQL Editor 執行本檔案

-- 標記點(一個國家可以有多個)
create table if not exists public.markers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  lat double precision not null,
  lng double precision not null,
  description text default '',
  travel_start date,
  travel_end date,
  created_at timestamptz not null default now()
);

-- 照片 / 影音
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  marker_id uuid not null references public.markers (id) on delete cascade,
  type text not null check (type in ('image', 'video')),
  url text not null,
  path text,
  created_at timestamptz not null default now()
);

-- RLS:所有人可讀,登入者才能寫入
alter table public.markers enable row level security;
alter table public.media enable row level security;

drop policy if exists "public read markers" on public.markers;
drop policy if exists "auth insert markers" on public.markers;
drop policy if exists "auth update markers" on public.markers;
drop policy if exists "auth delete markers" on public.markers;

create policy "public read markers"
  on public.markers for select using (true);
create policy "auth insert markers"
  on public.markers for insert to authenticated with check (true);
create policy "auth update markers"
  on public.markers for update to authenticated using (true);
create policy "auth delete markers"
  on public.markers for delete to authenticated using (true);

drop policy if exists "public read media" on public.media;
drop policy if exists "auth insert media" on public.media;
drop policy if exists "auth update media" on public.media;
drop policy if exists "auth delete media" on public.media;

create policy "public read media"
  on public.media for select using (true);
create policy "auth insert media"
  on public.media for insert to authenticated with check (true);
create policy "auth update media"
  on public.media for update to authenticated using (true);
create policy "auth delete media"
  on public.media for delete to authenticated using (true);

-- 儲存空間(照片/影音檔案)
insert into storage.buckets (id, name, public)
values ('travel-media', 'travel-media', true)
on conflict (id) do nothing;

drop policy if exists "public read media files" on storage.objects;
drop policy if exists "auth upload media files" on storage.objects;
drop policy if exists "auth delete media files" on storage.objects;

create policy "public read media files"
  on storage.objects for select
  using (bucket_id = 'travel-media');
create policy "auth upload media files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'travel-media');
create policy "auth delete media files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'travel-media');
