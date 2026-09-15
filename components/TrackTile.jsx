'use client';
import { NoteIcon } from './icons';

const NOTE_SIZE = { sm: 17, md: 20, np: 72 };
const TILE_GRAY = '#c7c7cc';

export default function TrackTile({ size = 'md', dim = false }) {
  const className = ['tile', size === 'sm' ? 'sm' : null, size === 'np' ? 'np' : null, dim ? 'dim' : null].filter(Boolean).join(' ');
  return (
    <div className={className} style={{ background: TILE_GRAY }}>
      <NoteIcon size={NOTE_SIZE[size] || NOTE_SIZE.md} opacity={0.92} />
    </div>
  );
}
