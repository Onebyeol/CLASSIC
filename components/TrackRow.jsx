'use client';
import { GripIcon, DotsIcon } from './icons';
import { formatTime } from '@/lib/constants';

export default function TrackRow({ track, index, isCurrent, showDuration = true, editMode = false, dragStyle, onClick, onMenuClick, onPointerDownHandle }) {
  return (
    <li className="track-row" style={dragStyle} onClick={editMode ? undefined : onClick}>
      {editMode && (
        <span className="grip grip-active" onPointerDown={(e) => onPointerDownHandle(e, index)}><GripIcon /></span>
      )}
      <div className="tile">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/default-cover.png" alt="" />
      </div>
      <div className="row-meta">
        <div className="row-title" style={{ color: isCurrent ? 'var(--navy)' : 'var(--text)' }}>{track.title}</div>
        <div className="row-artist">{track.artist}</div>
      </div>
      {showDuration && !editMode && <span className="row-dur">{formatTime(track.duration)}</span>}
      {!editMode && (
        <button className="menu-btn" aria-label="메뉴" onClick={(e) => { e.stopPropagation(); onMenuClick(); }}><DotsIcon /></button>
      )}
    </li>
  );
}
