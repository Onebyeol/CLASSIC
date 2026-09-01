'use client';
import { usePlayer } from '@/context/PlayerContext';
import { CloseIcon, CheckIcon, PlusIcon } from '../icons';

export default function AddToPlaylistSheet() {
  const { addToPlaylistFor, closeAddToPlaylist, findTrack, tracks, playlists, toggleTrackInPlaylist, setShowCreatePlaylist } = usePlayer();
  if (!addToPlaylistFor) return null;
  const track = findTrack(addToPlaylistFor);
  return (
    <div className="sheet-overlay" style={{ zIndex: 41 }} onClick={(e) => { if (e.target === e.currentTarget) closeAddToPlaylist(); }}>
      <div className="sheet" style={{ maxHeight: '85%', display: 'flex', flexDirection: 'column' }}>
        <div className="sheet-head" style={{ alignItems: 'flex-start', flex: 'none' }}>
          <div>
            <div className="sheet-title">재생목록에 추가</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>{track ? track.title : ''}</div>
          </div>
          <button className="sheet-close" aria-label="닫기" onClick={closeAddToPlaylist}><CloseIcon /></button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <button className="add-pl-cover-row" onClick={() => { closeAddToPlaylist(); setShowCreatePlaylist(true); }}>
            <div className="add-pl-cover add-pl-cover-new"><PlusIcon size={22} /></div>
            <span className="add-pl-cover-name">새 재생목록 만들기</span>
          </button>
          {playlists.map((p) => {
            const has = p.trackIds.includes(addToPlaylistFor);
            const swatches = p.trackIds.slice(0, 4).map((id) => tracks.find((t) => t.id === id)?.color || '#e5e5ea');
            while (swatches.length < 4) swatches.push('#e5e5ea');
            return (
              <button key={p.id} className="add-pl-cover-row" onClick={() => toggleTrackInPlaylist(p.id, addToPlaylistFor)}>
                <div className="add-pl-cover">
                  {p.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.cover} alt="" />
                  ) : (
                    <div className="pl-swatches">{swatches.map((c, i) => <div key={i} style={{ background: c }} />)}</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div className="add-pl-cover-name">{p.name}</div>
                  <div className="add-pl-cover-count">{p.trackIds.length}곡</div>
                </div>
                {has && <CheckIcon />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
