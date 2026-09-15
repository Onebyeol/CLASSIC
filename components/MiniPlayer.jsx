'use client';
import { usePlayer } from '@/context/PlayerContext';
import { PlayIcon, PauseIcon, PrevIcon, NextIcon } from './icons';
import TrackTile from './TrackTile';

export default function MiniPlayer() {
  const { findTrack, currentTrackId, isPlaying, showNowPlaying, playNext, playPrev, togglePlayPause, openNowPlaying } = usePlayer();
  const track = findTrack(currentTrackId);
  if (!track || showNowPlaying) return null;
  return (
    <button className="mini-player" onClick={openNowPlaying}>
      <TrackTile size="sm" />
      <div className="mini-meta">
        <div className="mini-title">{track.title}</div>
        <div className="mini-artist">{track.artist}</div>
      </div>
      <span className="mini-ctrl" role="button" aria-label="이전 곡" onClick={(e) => { e.stopPropagation(); playPrev(); }}><PrevIcon /></span>
      <span className="mini-ctrl play" role="button" aria-label="재생/일시정지" onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</span>
      <span className="mini-ctrl" role="button" aria-label="다음 곡" onClick={(e) => { e.stopPropagation(); playNext(); }}><NextIcon /></span>
    </button>
  );
}
