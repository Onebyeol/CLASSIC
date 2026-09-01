'use client';
import { useEffect, useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import LibraryScreen from './screens/LibraryScreen';
import PlaylistsScreen from './screens/PlaylistsScreen';
import SettingsScreen from './screens/SettingsScreen';
import TrashScreen from './screens/TrashScreen';
import EqualizerScreen from './screens/EqualizerScreen';
import PlaylistDetailScreen from './screens/PlaylistDetailScreen';
import MiniPlayer from './MiniPlayer';
import TabBar from './TabBar';
import NowPlaying from './NowPlaying';
import UploadSheet from './sheets/UploadSheet';
import CreatePlaylistSheet from './sheets/CreatePlaylistSheet';
import TrackMenuSheet from './sheets/TrackMenuSheet';
import RenameSheet from './sheets/RenameSheet';
import AddToPlaylistSheet from './sheets/AddToPlaylistSheet';
import EmptyTrashConfirmDialog from './sheets/EmptyTrashConfirmDialog';

const SCREENS = { library: LibraryScreen, playlists: PlaylistsScreen, settings: SettingsScreen, trash: TrashScreen, equalizer: EqualizerScreen, playlistDetail: PlaylistDetailScreen };

export default function ClassicMp3App() {
  const { tab, pushed, showNowPlaying, initialLoading, loadError } = usePlayer();
  const currentScreen = pushed || tab;
  const ScreenComponent = SCREENS[currentScreen] || LibraryScreen;
  const [showSlowHint, setShowSlowHint] = useState(false);
  useEffect(() => {
    if (!initialLoading) return undefined;
    const t = setTimeout(() => setShowSlowHint(true), 4000);
    return () => clearTimeout(t);
  }, [initialLoading]);

  if (initialLoading) {
    return (
      <div className="app" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-dim)', fontSize: 14 }}>불러오는 중…</div>
        {showSlowHint && <div style={{ color: 'var(--text-faint)', fontSize: 12, marginTop: 10, textAlign: 'center', padding: '0 32px', lineHeight: 1.6 }}>연결을 확인하고 있어요</div>}
      </div>
    );
  }
  if (loadError) {
    return (
      <div className="app" style={{ alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>연결할 수 없어요</div>
        <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 20, lineHeight: 1.6 }}>{loadError}</div>
        <button onClick={() => window.location.reload()} style={{ background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>다시 시도</button>
      </div>
    );
  }
  return (
    <div className="app">
      <div className="scroll-area"><ScreenComponent /></div>
      <MiniPlayer />
      <TabBar />
      {showNowPlaying && <NowPlaying />}
      <UploadSheet />
      <CreatePlaylistSheet />
      <TrackMenuSheet />
      <RenameSheet />
      <AddToPlaylistSheet />
      <EmptyTrashConfirmDialog />
    </div>
  );
}
