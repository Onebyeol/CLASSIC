'use client';
import { GripIcon, DotsIcon } from './icons';
import { formatTime } from '@/lib/constants';
import TrackTile from './TrackTile';

export default function TrackRow({ track, index, isCurrent, isPlaying = false, showDuration = true, editMode = false, dragStyle, onClick, onMenuClick, onPointerDownHandle }) {
  return (
    <li className={isCurrent ? 'track-row playing' : 'track-row'} style={dragStyle} onClick={editMode ? undefined : onClick}>
      {editMode && (
        <span className="grip grip-active" onPointerDown={(e) => onPointerDownHandle(e, index)}><GripIcon /></span>
      )}
      <TrackTile playing={isCurrent} active={isCurrent && isPlaying} />
      <div className="row-meta">
        <div className="row-title" style={{ color: isCurrent ? 'var(--accent)' : 'var(--text)' }}>{track.title}</div>
        <div className="row-artist">{track.artist}</div>
      </div>
      {showDuration && !editMode && <span className="row-dur">{formatTime(track.duration)}</span>}
      {!editMode && (
        <button className="menu-btn" aria-label="메뉴" onClick={(e) => { e.stopPropagation(); onMenuClick(); }}><DotsIcon /></button>
      )}
    </li>
  );
}
