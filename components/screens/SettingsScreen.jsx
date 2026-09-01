'use client';
import { usePlayer } from '@/context/PlayerContext';
import { EqualizerIcon, TrashIcon, ChevronRightIcon } from '../icons';

export default function SettingsScreen() {
  const { openEqualizer, openTrash } = usePlayer();
  return (
    <section className="screen">
      <div className="hdr"><div className="hdr-title">설정</div></div>
      <div className="settings-card">
        <button className="settings-row" onClick={openEqualizer}>
          <div className="settings-row-left"><div className="settings-icon" style={{ background: 'var(--navy)' }}><EqualizerIcon /></div><span className="settings-label">이퀄라이저</span></div>
          <ChevronRightIcon />
        </button>
        <button className="settings-row" onClick={openTrash}>
          <div className="settings-row-left"><div className="settings-icon" style={{ background: '#8a8a8e' }}><TrashIcon size={14} /></div><span className="settings-label">휴지통</span></div>
          <ChevronRightIcon />
        </button>
      </div>
      <div className="settings-footer">CLASSIC MUSIC MP3 WEBSITE · v1.0</div>
    </section>
  );
}
