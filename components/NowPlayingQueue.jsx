'use client';
import { usePlayer } from '@/context/PlayerContext';
import { CloseIcon } from './icons';

export default function NowPlayingQueue({ onClose }) {
  const { getContextIds, currentTrackId, findTrack, playContextPlaylistId, playTrack } = usePlayer();
  const ids = getContextIds();
  const queueTracks = ids.map((id) => findTrack(id)).filter(Boolean);
  return (
    <div className="queue-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="queue-panel">
        <div className="sheet-head">
          <div className="sheet-title">재생목록</div>
          <button className="sheet-close" aria-label="닫기" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="queue-list">
          {queueTracks.map((t) => (
            <button key={t.id} className="queue-row" onClick={() => playTrack(t.id, playContextPlaylistId)}>
              <div className="tile sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/default-cover.png" alt="" />
              </div>
              <div className="row-meta">
                <div className="row-title" style={{ color: t.id === currentTrackId ? 'var(--navy)' : 'var(--text)' }}>{t.title}</div>
                <div className="row-artist">{t.artist}</div>
              </div>
            </button>
          ))}
          {queueTracks.length === 0 && (
            <div style={{ padding: '24px 4px', textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>재생목록이 비어있어요</div>
          )}
        </div>
      </div>
    </div>
  );
}
