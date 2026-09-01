'use client';
import { useEffect, useRef } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { PlusIcon, DotsIcon } from '../icons';

export default function PlaylistsScreen() {
  const { playlists, tracks, playlistMenuFor, togglePlaylistMenu, deletePlaylist, setPlaylistCover, setShowCreatePlaylist, openPlaylistDetail } = usePlayer();
  const menuRef = useRef(null);
  useEffect(() => {
    if (!playlistMenuFor) return;
    function onDocClick(e) { if (menuRef.current && !menuRef.current.contains(e.target)) togglePlaylistMenu(playlistMenuFor); }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [playlistMenuFor, togglePlaylistMenu]);
  function handleCoverChange(e, playlistId) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setPlaylistCover(playlistId, file);
  }
  return (
    <section className="screen">
      <div className="hdr">
        <div className="hdr-title">앨범</div>
        <button className="round-btn solid" aria-label="새 재생목록" style={{ marginTop: 6 }} onClick={() => setShowCreatePlaylist(true)}><PlusIcon /></button>
      </div>
      <div className="list-pad" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {playlists.map((p) => {
          const swatches = p.trackIds.slice(0, 4).map((id) => tracks.find((t) => t.id === id)?.color || '#e5e5ea');
          while (swatches.length < 4) swatches.push('#e5e5ea');
          return (
            <div className="pl-card-row" key={p.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', flex: 1, minWidth: 0 }} onClick={() => openPlaylistDetail(p.id)}>
                <div className="pl-cover">
                  {p.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.cover} alt="" />
                  ) : (
                    <div className="pl-swatches">{swatches.map((c, i) => <div key={i} style={{ background: c }} />)}</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="pl-name">{p.name}</div>
                  <div className="pl-count">{p.trackIds.length}곡</div>
                </div>
              </div>
              <button className="menu-btn" aria-label="메뉴" onClick={(e) => { e.stopPropagation(); togglePlaylistMenu(p.id); }}><DotsIcon /></button>
              {playlistMenuFor === p.id && (
                <div className="pl-menu" ref={menuRef}>
                  <label>앨범 표지 설정<input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleCoverChange(e, p.id)} /></label>
                  <div className="danger-item" onClick={() => deletePlaylist(p.id)}>재생목록 삭제</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
