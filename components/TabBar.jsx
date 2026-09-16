'use client';
import { usePlayer } from '@/context/PlayerContext';
import { NoteOutlineIcon, PlaylistsTabIcon, SettingsTabIcon } from './icons';

export default function TabBar() {
  const { tab, pushed, selectTab } = usePlayer();
  const isPushed = !!pushed;
  function tabClass(name) {
    return 'tab-btn' + (!isPushed && tab === name ? ' active' : '');
  }
  function tabColor(name) {
    return !isPushed && tab === name ? 'var(--accent)' : 'var(--text-dim)';
  }
  return (
    <div className="tab-bar">
      <button className={tabClass('library')} style={{ color: tabColor('library') }} onClick={() => selectTab('library')}><NoteOutlineIcon size={25} /><span>노래</span></button>
      <button className={tabClass('playlists')} style={{ color: tabColor('playlists') }} onClick={() => selectTab('playlists')}><PlaylistsTabIcon size={25} /><span>앨범</span></button>
      <button className={tabClass('settings')} style={{ color: tabColor('settings') }} onClick={() => selectTab('settings')}><SettingsTabIcon size={25} /><span>설정</span></button>
    </div>
  );
}
