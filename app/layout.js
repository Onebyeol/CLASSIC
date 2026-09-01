import './globals.css';

export const metadata = {
  title: 'Classic MP3',
  description: '개인용 MP3 플레이어 웹 앱',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Classic MP3' },
};

export const viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 1, viewportFit: 'cover', themeColor: '#1f3a5f',
};

export default function RootLayout({ children }) {
  return (<html lang="ko"><body>{children}</body></html>);
}
