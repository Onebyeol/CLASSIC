'use client';
import { usePlayer } from '@/context/PlayerContext';
import { NoteOutlineIcon, PlaylistsTabIcon, SettingsTabIcon } from './icons';

export default function TabBar() {
  const { tab, pushed, selectTab } = usePlayer();
  const active = !pushed;
  return (
    <div className="tab-bar">
      <button className="tab-btn" style={{ color: active && tab === 'library' ? 'var(--navy)' : 'var(--text-dim)' }} onClick={() => selectTab('library')}><NoteOutlineIcon size={25} /><span>노래</span></button>
      <button className="tab-btn" style={{ color: active && tab === 'playlists' ? 'var(--navy)' : 'var(--text-dim)' }} onClick={() => selectTab('playlists')}><PlaylistsTabIcon size={25} /><span>앨범</span></button>
      <button className="tab-btn" style={{ color: active && tab === 'settings' ? 'var(--navy)' : 'var(--text-dim)' }} onClick={() => selectTab('settings')}><SettingsTabIcon size={25} /><span>설정</span></button>
    </div>
  );
}
