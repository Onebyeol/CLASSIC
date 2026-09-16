'use client';
import { useEffect, useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { PlayIcon, PauseIcon, PrevIcon, NextIcon } from './icons';
import TrackTile from './TrackTile';

export default function MiniPlayer() {
  const { audioRef, findTrack, currentTrackId, isPlaying, showNowPlaying, playNext, playPrev, togglePlayPause, openNowPlaying } = usePlayer();
  const track = findTrack(currentTrackId);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const onTimeUpdate = () => setPct(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => audio.removeEventListener('timeupdate', onTimeUpdate);
  }, [audioRef, currentTrackId]);

  if (!track || showNowPlaying) return null;
  const r = 16;
  const c = 2 * Math.PI * r;
  return (
    <button className="mini-player" onClick={openNowPlaying}>
      <TrackTile size="sm" />
      <div className="mini-meta">
        <div className="mini-title">{track.title}</div>
        <div className="mini-artist">{track.artist}</div>
      </div>
      <span className="mini-ctrl" role="button" aria-label="이전 곡" onClick={(e) => { e.stopPropagation(); playPrev(); }}><PrevIcon /></span>
      <span className="mini-ctrl play" role="button" aria-label="재생/일시정지" onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}>
        <svg className="mini-ring" width="36" height="36" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r={r} fill="none" stroke="var(--divider)" strokeWidth="2" />
          <circle cx="18" cy="18" r={r} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} transform="rotate(-90 18 18)" />
        </svg>
        <span className="mini-ring-icon">{isPlaying ? <PauseIcon /> : <PlayIcon />}</span>
      </span>
      <span className="mini-ctrl" role="button" aria-label="다음 곡" onClick={(e) => { e.stopPropagation(); playNext(); }}><NextIcon /></span>
    </button>
  );
}
