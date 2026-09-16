'use client';
import { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { CloseIcon } from '../icons';

export default function CreatePlaylistSheet() {
  const { showCreatePlaylist, closeCreatePlaylist, createPlaylist } = usePlayer();
  const [name, setName] = useState('');
  if (!showCreatePlaylist) return null;
  function close() { closeCreatePlaylist(); setName(''); }
  function confirm() { if (!name.trim()) return; createPlaylist(name); setName(''); }
  const has = name.trim().length > 0;
  return (
    <div className="sheet-overlay" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="sheet">
        <div className="sheet-head">
          <div className="sheet-title">새 재생목록</div>
          <button className="sheet-close" aria-label="닫기" onClick={close}><CloseIcon /></button>
        </div>
        <input type="text" className="text-input" placeholder="재생목록 이름" value={name} autoFocus onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') confirm(); }} />
        <button className="confirm-btn" style={{ background: has ? 'var(--accent)' : 'var(--surface-3)', color: has ? 'var(--on-accent)' : 'var(--text-dim)' }} onClick={confirm}>만들기</button>
      </div>
    </div>
  );
}
