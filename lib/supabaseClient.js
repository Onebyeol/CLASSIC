'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (typeof window !== 'undefined' && !isConfigured) {
  console.error('[classic-mp3] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다. .env.local을 확인하세요.');
}

// 설정 전(.env.local이 비어있을 때)에는 createClient()가 즉시 예외를 던져서 빌드/렌더 자체가
// 깨지므로, 값이 없을 땐 더미 값으로 클라이언트를 만들어둡니다.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  { auth: { persistSession: false } }
);

export const BUCKETS = { tracks: 'track-files', covers: 'playlist-covers' };

export function publicUrlFor(bucket, path) {
  if (!path) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data ? data.publicUrl : null;
}
