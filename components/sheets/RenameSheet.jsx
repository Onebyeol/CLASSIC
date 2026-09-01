'use client';
import { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { CloseIcon } from '../icons';

function RenameSheetInner({ track, onClose, onSave }) {
  const [title, setTitle] = useState(track.title);
  const has = title.trim().length > 0;
  function confirm() { if (!has) return; onSave(title); onClose(); }
  return (
    <div className="sheet-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet">
        <div className="sheet-head">
          <div className="sheet-title">이름 변경</div>
          <button className="sheet-close" aria-label="닫기" onClick={onClose}><CloseIcon /></button>
        </div>
        <input type="text" className="text-input" placeholder="곡 제목" value={title} autoFocus onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') confirm(); }} />
        <button className="confirm-btn" style={{ background: has ? 'var(--navy)' : 'var(--divider)', color: has ? '#fff' : 'var(--text-dim)' }} onClick={confirm}>저장</button>
      </div>
    </div>
  );
}

export default function RenameSheet() {
  const { renameTarget, closeRename, findTrack, renameTrack } = usePlayer();
  if (!renameTarget) return null;
  const track = findTrack(renameTarget);
  if (!track) return null;
  return <RenameSheetInner key={renameTarget} track={track} onClose={closeRename} onSave={(title) => renameTrack(renameTarget, title)} />;
}
