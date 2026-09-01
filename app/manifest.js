export default function manifest() {
  return {
    name: 'Classic MP3', short_name: 'Classic MP3', description: '개인용 MP3 플레이어 웹 앱',
    start_url: '/', display: 'standalone', background_color: '#dcdce0', theme_color: '#1f3a5f',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
