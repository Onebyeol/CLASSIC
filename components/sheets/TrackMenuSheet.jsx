'use client';
import { usePlayer } from '@/context/PlayerContext';

export default function TrackMenuSheet() {
  const { trackMenu, closeTrackMenu, openAddToPlaylist, openRename, findTrack, removeTrackFromPlaylist, deleteTrack } = usePlayer();
  if (!trackMenu) return null;
  const track = findTrack(trackMenu.trackId);
  return (
    <div className="action-menu-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeTrackMenu(); }}>
      <div className="action-menu-card">
        <div className="action-menu-title">{track ? track.title : ''}</div>
        <button className="action-menu-item" onClick={() => openRename(trackMenu.trackId)}>이름 변경</button>
        <button className="action-menu-item" onClick={() => openAddToPlaylist(trackMenu.trackId)}>재생목록에 추가</button>
        {trackMenu.playlistId && (
          <button className="action-menu-item" onClick={() => { removeTrackFromPlaylist(trackMenu.playlistId, trackMenu.trackId); closeTrackMenu(); }}>이 재생목록에서 제거</button>
        )}
        <button className="action-menu-item danger" onClick={() => { deleteTrack(trackMenu.trackId); closeTrackMenu(); }}>삭제</button>
      </div>
    </div>
  );
}
