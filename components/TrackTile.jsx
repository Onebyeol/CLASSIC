'use client';
import { NoteIcon } from './icons';

const NOTE_SIZE = { sm: 17, md: 20, np: 72 };

function EqBars({ animated }) {
  return (
    <span className={animated ? 'eq-bars playing' : 'eq-bars'}>
      <span /><span /><span /><span />
    </span>
  );
}

export default function TrackTile({ size = 'md', dim = false, playing = false, active = false }) {
  const className = ['tile', size === 'sm' ? 'sm' : null, size === 'np' ? 'np' : null, dim ? 'dim' : null].filter(Boolean).join(' ');
  return (
    <div className={className}>
      {playing ? <EqBars animated={active} /> : <NoteIcon size={NOTE_SIZE[size] || NOTE_SIZE.md} opacity={0.85} />}
    </div>
  );
}
