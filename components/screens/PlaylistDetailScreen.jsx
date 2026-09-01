'use client';
import { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { useDragReorder } from '@/hooks/useDragReorder';
import TrackRow from '../TrackRow';
import { ChevronLeftIcon, PlayIcon } from '../icons';

export default function PlaylistDetailScreen() {
  const { playlists, findTrack, activePlaylistId, currentTrackId, back, playTrack, openTrackMenu, reorderPlaylistTracks } = usePlayer();
  const [editMode, setEditMode] = useState(false);
  const playlist = playlists.find((p) => p.id === activePlaylistId);
  const trackCount = playlist ? playlist.trackIds.length : 0;
  const { onPointerDown, getRowStyle } = useDragReorder(trackCount, (from, to) => { if (playlist) reorderPlaylistTracks(playlist.id, from, to); });

  if (!playlist) {
    return (
      <section className="screen">
        <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 8px' }}>
          <button className="back-btn" aria-label="뒤로" onClick={back}><ChevronLeftIcon /></button>
        </div>
      </section>
    );
  }
  return (
    <section className="screen">
      <div style={{ padding: 'calc(20px + env(safe-area-inset-top)) 20px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <button className="back-btn" aria-label="뒤로" onClick={back}><ChevronLeftIcon /></button>
          {trackCount > 1 && (editMode ? <button className="edit-btn" onClick={() => setEditMode(false)}>완료</button> : <button className="edit-btn" onClick={() => setEditMode(true)}>편집</button>)}
        </div>
        <div className="hdr-title" style={{ fontSize: 26 }}>{playlist.name}</div>
        <div className="hdr-sub">{playlist.trackIds.length}곡</div>
        {!editMode && (
          <button style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--navy)', color: '#fff', padding: '10px 20px', borderRadius: 20, fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: 'inherit' }} onClick={() => { if (playlist.trackIds.length) playTrack(playlist.trackIds[0], playlist.id); }}>
            <PlayIcon size={14} /> 재생
          </button>
        )}
      </div>
      <div style={{ padding: '8px 20px 100px' }}>
        <ul>
          {playlist.trackIds.map((id, i) => {
            const t = findTrack(id);
            if (!t) return null;
            return (
              <TrackRow key={t.id} track={t} index={i} isCurrent={t.id === currentTrackId} showDuration={false} editMode={editMode} dragStyle={getRowStyle(i)} onClick={() => playTrack(t.id, playlist.id)} onMenuClick={() => openTrackMenu(t.id, playlist.id)} onPointerDownHandle={onPointerDown} />
            );
          })}
        </ul>
      </div>
    </section>
  );
}
