# Classic MP3

개인용 MP3 플레이어. Next.js 프론트가 Supabase에 직접 연결됩니다(별도 백엔드 서버 없음).

## 실행
1. `supabase-rls.sql`을 Supabase SQL Editor에서 실행 (이미 했다면 다시 해도 안전함)
2. `.env.local`에 Supabase URL + anon 키 입력
3. `npm install && npm run dev` → http://localhost:3001

## 배포
Vercel에 프론트만 올리면 끝. 환경변수 두 개(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)만 등록.
