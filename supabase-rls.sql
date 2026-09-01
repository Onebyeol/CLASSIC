-- ============================================================
-- Classic MP3 — 프론트 직접연결(anon key)용 RLS 정책
-- Supabase 대시보드 → SQL Editor 에 전체 붙여넣고 실행하세요.
-- (이미 한 번 실행하셨다면, DROP POLICY IF EXISTS 로 되어있어서 다시 실행해도 안전해요)
-- ============================================================

alter table tracks enable row level security;
alter table playlists enable row level security;
alter table playlist_tracks enable row level security;
alter table eq_settings enable row level security;

drop policy if exists "anon_all_tracks" on tracks;
create policy "anon_all_tracks" on tracks for all to anon using (true) with check (true);

drop policy if exists "anon_all_playlists" on playlists;
create policy "anon_all_playlists" on playlists for all to anon using (true) with check (true);

drop policy if exists "anon_all_playlist_tracks" on playlist_tracks;
create policy "anon_all_playlist_tracks" on playlist_tracks for all to anon using (true) with check (true);

drop policy if exists "anon_all_eq_settings" on eq_settings;
create policy "anon_all_eq_settings" on eq_settings for all to anon using (true) with check (true);

drop policy if exists "anon_read_tracks" on storage.objects;
create policy "anon_read_tracks" on storage.objects for select to anon using (bucket_id = 'track-files');
drop policy if exists "anon_write_tracks" on storage.objects;
create policy "anon_write_tracks" on storage.objects for insert to anon with check (bucket_id = 'track-files');
drop policy if exists "anon_update_tracks" on storage.objects;
create policy "anon_update_tracks" on storage.objects for update to anon using (bucket_id = 'track-files');
drop policy if exists "anon_delete_tracks" on storage.objects;
create policy "anon_delete_tracks" on storage.objects for delete to anon using (bucket_id = 'track-files');

drop policy if exists "anon_read_covers" on storage.objects;
create policy "anon_read_covers" on storage.objects for select to anon using (bucket_id = 'playlist-covers');
drop policy if exists "anon_write_covers" on storage.objects;
create policy "anon_write_covers" on storage.objects for insert to anon with check (bucket_id = 'playlist-covers');
drop policy if exists "anon_update_covers" on storage.objects;
create policy "anon_update_covers" on storage.objects for update to anon using (bucket_id = 'playlist-covers');
drop policy if exists "anon_delete_covers" on storage.objects;
create policy "anon_delete_covers" on storage.objects for delete to anon using (bucket_id = 'playlist-covers');
